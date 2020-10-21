'use strict';

module.exports = function(FoundryWorker) {
    FoundryWorker.prototype.getChipOrders = function(ctx, cb){
        const foundryWorker = this;
        var allOrderChips = [];
        foundryWorker.workerOrders({})
        .then(chipOrders => {
            var promises = chipOrders.map((chipOrder, index) => {
                // console.log(chipOrder);
                return FoundryWorker.app.models.orderInfo.findById(chipOrder.orderId)
                .then(orderInfo => {
                    chipOrder.customerId = orderInfo.customerId;
                    allOrderChips = allOrderChips.concat(chipOrder);
                })
                .catch(err => {
                    console.error(err);
                    cb(err);
                });
            });
            Promise.all(promises).then(() => {
                var promises2 = allOrderChips.map((orderChip, index) => {
                    return FoundryWorker.app.models.customer.findById(orderChip.customerId)
                    .then(customer => {
                        orderChip.customerName = `${customer.firstName} ${customer.lastName}`;
                    })
                    .catch(err => {
                        console.error(err);
                        cb(err);
                    })
                })
                Promise.all(promises2).then(() => {
                    cb(null, allOrderChips);
                });
            });
        })
        .catch(err => {
            cb(err);
        });
    }

    FoundryWorker.remoteMethod('prototype.getChipOrders', {
        description: 'CUSTOM METHOD: Get all chip orders',
        accepts: [
            {arg: 'ctx', type: 'object', http: { source: 'context' }},
        ],
        http: {path: '/orderChips', verb: 'get'},
        returns: [{arg: 'orderChips', type: 'array'}],
    });

    FoundryWorker.downloadFile = function(ctx, cb){
        const fileId = ctx.req.query.fileId;
        if(fileId === undefined){
            let error = new Error(`Missing fileId argument`)
            error.status = 400;
            cb(error);
        } else {
            FoundryWorker.app.models.fileInfo.findById(fileId, function(err, file){
                if(err){
                    console.error(`Error getting file: ${err}`)
                    cb(err)
                } else if(file === null){
                    let error = new Error(`File not found`);
                    error.status = 404;
                    cb(error);
                } else {
                    ctx.res.set('Content-Disposition', `inline; filename="${file.fileName}"`); // this sets the file name
                    FoundryWorker.app.models.container.download('test_container', file.containerFileName, ctx.req, ctx.res, function(err, fileData){
                        if(err){
                            cb(err);
                        } else {
                            cb(null);
                        }
                    });
                }
            });
        }
    }

    FoundryWorker.remoteMethod('downloadFile', {
        description: 'CUSTOM METHOD: Download a file',
        accepts: [
            {arg: 'ctx', type: 'object', http: { source: 'context' }},
        ],
        http: {path: '/downloadFile', verb: 'get'},
        returns: [],
    });
};
