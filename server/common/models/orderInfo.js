'use strict';

module.exports = function(OrderInfo) {
    //Remote Methods

    // Caller: Shopify web hook, when an order is created
    OrderInfo.newOrderCreated = (body, cb) => {
        console.log(body);
        if(body.checkout_token !== null){
            OrderInfo.findOne({where: {checkoutToken: body.checkout_token}}, (err, orderInfoInstance) => {
                if(err){
                    cb(err);
                }
                else{
                    // console.log(orderInfoInstance);
                    var date = new Date();
                    orderInfoInstance.updateAttributes({
                        orderInfoId: body.id,
                        orderComplete: true,
                        orderStatusURL: body.order_status_url,
                        status: "Payment made",
                        lastModifiedAt: date.toISOString(),
                    });
                    cb(null);
                } 
            });
        }
        else{
            cb(null);
        }    
    }

    //Without the "next" parameter
    OrderInfo.newOrderInfoCreated = async (body) => {
        // For whena  new checkout is created
        // Currently does nothing
    // Query the database to find whether the OrderInfo exists
    const OrderInfoId = body.id;
    console.log("Shopfiy web hook");
    console.log(body);
    
    // try {
    //     let OrderInfoInstance = await OrderInfo.findById(OrderInfoId);
    //     if (!OrderInfoInstance) {
    //         //console.log(body.line_items[0].properties);
    //         console.log(body);
    //         let data = {};
    //         data.orderInfoId = OrderInfoId;
    //         // data.email = body.email;
    //         // data.createdAt = body.created_at;
    //         // data.process = body.line_items[0].properties[0].value;
    //         // data.coverPlate = body.line_items[0].properties[1].value === "true" ? "Yes" : "No";;
    //         // data.fileName = body.line_items[0].properties[2].value;
    //         // data.orderStatusURL = body.order_status_url;
    //         // data.orderAddress = body.customer.default_address;
    //         // data.sampleQuantity = body.line_items[0].quantity;

    //         let Customer = OrderInfo.app.models.customer;
    //         let customerInstance = await Customer.findOne({where: {email: body.email}});
    //         data.customerId = customerInstance.id;
    //         await OrderInfo.create(data);
    //     } else {
    //         console.log('OrderInfo already exists!');
    //     }
    // }
    // catch(err) {
    //     console.log(err);
    // }

    /* Old version using callback
    OrderInfo.findOne({where: {OrderInfoId: OrderInfoId}}, (err, OrderInfoInstance) => {
        if (err) {
                console.log(err);
            } 
            else if (!OrderInfoInstance) {
                let data = {};
                data.OrderInfoId = OrderInfoId;
                data.email = body.email;
                data.createdAt = body.created_at;
                OrderInfo.app.models.customer.findOne({where: {email: body.email}}, (err, customerInstance) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(customerInstance);
                        data.customerId = customerInstance.id;
                        OrderInfo.create(data, (err, createdOrderInfo) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("created successfully");
                            }
                        });
                    }
                })
            } else {
                console.log("already existed");
            }
        })
    */
   
    }

    OrderInfo.prototype.addOrderChipToCart = (body, cb) => {
        // console.log(body);
        // Find the specified orderInfo (top level)
        OrderInfo.findById(body.orderInfoId, (err, orderInfo) => {
            if(err){
                console.error(err);
                cb(err);
            }
            else {
                // console.log(orderInfo);
                // Then see if product order already created, if we need to create one
                orderInfo.orderChips({"where": {"variantIdShopify": body.variantIdShopify, "otherDetails": body.otherDetails}}, function(err, orderChips){
                    // variant ID should uniquely identify it
                    // console.log(orderProducts);
                    if(err || orderChips.length > 1){
                        console.error(`Error occurred or more than one entry for product`);
                        console.error(err);
                        cb(err);
                    }
                    // not present, need to create a new one
                    else if(orderChips.length === 0){
                        orderInfo.orderChips.create(body, (err, orderChip) => {
                            // console.log(orderProduct);
                            if(err){
                                console.error(err);
                                cb(err);
                            }
                            else{
                                console.log(`Created orderChips with product order id ${orderChip.id}, product ${orderChip.description}`);
                                cb(null);
                            }
                        });
                    }
                    else if(orderChips.length === 1){ //already exists
                        let newQtyData = {
                            "quantity": orderChips[0].quantity + body.quantity
                        };
                        orderChips[0].updateAttributes(newQtyData, (err, orderChip) => {
                            // console.log(orderProduct);
                            if(err){
                                console.error(err);
                                cb(err);
                            }
                            else{
                                console.log(`Updated quantity to ${orderChip.quantity} for product order ID: ${orderChip.id}, product ${orderChip.description}`);
                                cb(null);
                            }
                        });
                    }
                });
            }
        });
    }

    // This function:
    // (1) Updates the specified order with given ID (represents customer's cart)
    // (2) Searches if the appropriate item is already in the customer's cart
    //      If so, update quantity; if not, create item and then add to cart
    // (3) Returns success/failure
    OrderInfo.prototype.addOrderProductToCart = (body, cb) => {
        // console.log(body);
        // Find the specified orderInfo (top level)
        OrderInfo.findById(body.orderInfoId, (err, orderInfo) => {
            if(err){
                console.error(err);
                cb(err);
            }
            else {
                // console.log(orderInfo);
                // Then see if product order already created, if we need to create one
                orderInfo.orderProducts({"where": {"variantIdShopify": body.variantIdShopify, "otherDetails": body.otherDetails}}, function(err, orderProducts){
                    // variant ID should uniquely identify it
                    // console.log(orderProducts);
                    if(err || orderProducts.length > 1){
                        console.error(`Error occurred or more than one entry for product`);
                        console.error(err);
                        cb(err);
                    }
                    // not present, need to create a new one
                    else if(orderProducts.length === 0){
                        orderInfo.orderProducts.create(body, (err, orderProduct) => {
                            // console.log(orderProduct);
                            if(err){
                                console.error(err);
                                cb(err);
                            }
                            else{
                                console.log(`Created orderProduct with product order id ${orderProduct.id}, product ${orderProduct.description}`);
                                cb(null);
                            }
                        });
                    }
                    else if(orderProducts.length === 1){ //already exists
                        let newQtyData = {
                            "quantity": orderProducts[0].quantity + body.quantity
                        };
                        orderProducts[0].updateAttributes(newQtyData, (err, orderProduct) => {
                            // console.log(orderProduct);
                            if(err){
                                console.error(err);
                                cb(err);
                            }
                            else{
                                console.log(`Updated quantity to ${orderProduct.quantity} for product order ID: ${orderProduct.id}, product ${orderProduct.description}`);
                                cb(null);
                            }
                        });
                    }
                });
            }
        });
    }

    OrderInfo.remoteMethod('prototype.addOrderProductToCart', {
        description: 'CUSTOM METHOD: Add product order to cart (increase quantity)',
        accepts: [
            {arg: 'body', type: 'object', http: {source: 'body'}}
        ],
        http: {path: '/addOrderProductToCart', verb: 'post'},
        returns: [],
    });

    OrderInfo.remoteMethod('prototype.addOrderChipToCart', {
        description: 'CUSTOM METHOD: Add chip order to cart (increase quantity)',
        accepts: [
            {arg: 'body', type: 'object', http: {source: 'body'}}
        ],
        http: {path: '/addOrderChipToCart', verb: 'post'},
        returns: [],
    });

    OrderInfo.remoteMethod('newOrderInfoCreated', {
        description: 'An OrderInfo was created by Shopify',
        accepts: [
            {arg: 'body', type: 'object', http: {source: 'body'}},
        ],
        http: {path: '/newOrderInfoCreated', verb: 'post'},
        returns: {arg: 'msg', type: 'string'}
    });

    OrderInfo.remoteMethod('newOrderCreated', {
        description: 'An Order (customer has paid) was created by Shopify',
        accepts: [
            {arg: 'body', type: 'object', http: {source: 'body'}},
        ],
        http: {path: '/newOrderCreated', verb: 'post'},
        returns: {arg: 'msg', type: 'string'}
    });

    /*  OrderInfo assignment
    *   para: OrderInfoKey: the primary key generated by loopback instead of the OrderInfoId from shopify
    *         workerId: the id property of worker instance
    *         next: uncertain
    */
    OrderInfo.assignOrderInfo = async (orderId, workerId, next) => {
        const workerModel = OrderInfo.app.models.foundryWorker;
        let data = {};
        data.workerId = workerId;
        try {
            const workerInstance = await workerModel.findById(workerId);
            data.workerName = workerInstance.username;
            data.status = 'Assigned to Foundry';

            let OrderInfoInstance = await OrderInfo.findById(orderId);
            if (OrderInfoInstance) {
                var updatedOrderInfoData = await OrderInfoInstance.updateAttributes(data);
                //next();  When we add this ,it shows error like this: (node:2160) UnhandledPromiseRejectionWarning: Error: Callback was already called.
            } else {
                throw Error('OrderInfo not exist!');
            }
        }
        catch(err) {
            console.log(err);
        }
        
        return updatedOrderInfoData;
    }

    OrderInfo.remoteMethod('assignOrderInfo', {
        description: 'Admin assignOrderInfo to foundry worker.',
        accepts: [
            {arg: 'orderId', type: 'number', http: {source: 'form'}},
            {arg: 'workerId', type: 'number', http: {source: 'form'}}
        ],
        returns: {arg: 'updatedOrderInfoData', type: 'object'},
        http: {path: '/assign-order-info', verb: 'post'}
    });

    /* OrderInfo status editing
    *  para: OrderInfoId: id property of OrderInfo instance which is passed from client side
    *        status: the status data from the frontend
    */ 
    OrderInfo.editStatus = async (orderId, status) => {
        try {
            let OrderInfoInstance = await OrderInfo.findById(orderId);
            if (!OrderInfoInstance) {
                throw new Error('OrderInfo does not exist!');
            } else {
                let updatedOrderInfoInstance = await OrderInfoInstance.updateAttribute('status', status);
                return updatedOrderInfoInstance;
            }
        }
        catch(err) {
            console.log(err);
        }
    }

    OrderInfo.remoteMethod('editStatus', {
        description: 'Worker is able to edit status in using the feature.',
        accepts: [
            {arg: 'orderId', type: 'number', http: {source: 'form'}},
            {arg: 'status', type: 'string', http: {source: 'form'}}
        ],
        returns: {arg: 'updatedOrderInfoInstance', type: 'object', root: true},
        http: {path: '/edit-order-status', verb: 'post', status: 200}
    })
};
