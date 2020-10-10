'use strict';
const app = require("../server");
const {formatBytes, currentTime} = require('../toolbox/calculate') ;

module.exports = (ctx, containerInstance, next) => {
    const Customer = app.models.customer;
    const customerId = ctx.req.accessToken.userId;
    const files = ctx.result.result.files;
    const name = files['attach-document'][0].name;
    const size = files['attach-document'][0].size;
    const time = currentTime();
    const formatedSize = formatBytes(size, 1);
    //const time = files['attach-document'][0].time;
    
    //Method One: use callback
    Customer.findById(customerId, (err, customerInstance) => {
        if (err)
            console.log(err);
        else {
            let fileId;
            const customerName = customerInstance.username;
            const data = {};
            data.filename = name;
            data.uploader = customerName;
            data.uploadTime = time;
            data.fileSize = formatedSize;
            customerInstance.customerFiles.create(data, (err, fileInstance) => {
                if (err) {
                    console.log(err);
                } else {
                    fileId = fileInstance.id;
                    console.log(fileInstance);
                }
            })
            /*
            Fileinfo.create(data, (err, fileInfoInstance) => {
            if(err) console.log(err);
            else
            console.log(fileInfoInstance);
            });
            */
            next(fileId);
        }
    });
    
   
    // Method Two: use Promise
    /*
    return new Promise((resolve, reject) => {
        Customer.findById(customerId, (err, customerInstance) => {
            if(err)
            return reject(err);
            else
            return resolve(customerInstance);
            });
        })
        .then((customerInstance) => {
        const customerName = customerInstance.username;
        const customerId = customerInstance.id;
        const data = {};
        data.filename = name;
        data.uploader = customerName;
        data.uploaderId = customerId;
        data.status = "Unassigned to Foundry";
        next() //According to the documentation, it has to be called at some point!!
        return new Promise((resolve, reject) => {
            fileInfo.create(data, (err, fileInfoInstance) => {
                if(err)
                return reject(err);
                else {
                    //console.log(fileInfoInstance);
                    return resolve(fileInfoInstance);
                    }
                });
            });
        })
        .catch((err) => {
            next(); //According to the documentation, it has to be called at some point!!
            console.log(err);
            throw err;
        });
    */
}