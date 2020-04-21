'use strict';

module.exports = function(Order) {
    //Remote Method
    Order.newOrderCreated = (ctx, body, next) => {
        // Query the database to find whether the order exists
        const orderId = body.id;
        Order.findOne({where: {orderId: orderId}}, (err, orderInstance) => {
            if (err) {
                console.log(err);
                return next(err, null);
            } else if (!orderInstance) {
                let data = {};
                data.orderId = orderId;
                data.email = body.email;
                data.createdAt = body.created_at;
                Order.create(data, (err, createdOrder) => {
                    if (err) {
                        console.log(err);
                        return next(err, null);
                    } else {
                        console.log("created successfully");
                        return next(null, "success");
                    }
                });
            } else {
                console.log("already existed");
                return next(null, "existed");
            }
        })
    } 

    Order.remoteMethod('newOrderCreated', {
        discription: 'A Order was created by Shopfify',
        accepts: [
            {arg: 'ctx', type: 'object', http: {source: 'context'}},
            {arg: 'body', type: 'object', http: {source: 'body'}}
        ],
        http: {path: '/newOrderCreated', verb: 'post'},
        returns: {arg: 'msg', type: 'string'}
    })
};
