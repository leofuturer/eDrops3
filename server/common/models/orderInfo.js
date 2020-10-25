'use strict';

module.exports = function(OrderInfo) {
    //Remote Methods

    // Caller: Shopify web hook, when an order is created
    // This hook is called when the order is paid for
    OrderInfo.newOrderCreated = (body, cb) => {
        // console.log(body);
        console.log("An order was just paid, receiving webhook info from Shopify");
        // TODO: Verify the request came from Shopify
        if(body.checkout_token !== null){
            OrderInfo.findOne({where: {checkoutToken: body.checkout_token}}, (err, orderInfoInstance) => {
                if(err){
                    cb(err);
                }
                else{
                    // console.log(orderInfoInstance);
                    var date = new Date();
                    orderInfoInstance.updateAttributes({
                        orderInfoId:    body.id,
                        orderStatusURL: body.order_status_url,
                        orderComplete: true, 
                        status: "Payment made",
                        lastModifiedAt: date.toISOString(),
                        
                        fees_and_taxes: (parseFloat(body.total_price) - parseFloat(body.total_line_items_price)).toString(),

                        sa_name:     body.shipping_address.first_name + body.shipping_address.last_name,
                        sa_address1: body.shipping_address.address1,
                        sa_address2: body.shipping_address.address2,
                        sa_city:     body.shipping_address.city,
                        sa_province: body.shipping_address.province,
                        sa_zip:      body.shipping_address.zip,
                        sa_country:  body.shipping_address.country,
                        
                        ba_name:     body.billing_address.first_name + body.billing_address.last_name,
                        ba_address1: body.billing_address.address1,
                        ba_address2: body.billing_address.address2,
                        ba_city:     body.billing_address.city,
                        ba_province: body.billing_address.province,
                        ba_zip:      body.billing_address.zip,
                        ba_country:  body.billing_address.country,
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
    OrderInfo.orderProcessStarted = async (body) => {
        // For when a new checkout is created
        // Currently does nothing
        // Query the database to find whether the OrderInfo exists
        const OrderInfoId = body.id;
        console.log("Customer just went to Shopify");
        // console.log(body);
        
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

    OrderInfo.remoteMethod('newOrderCreated', {
        description: 'An Order (customer has paid) was created by Shopify',
        accepts: [
            {arg: 'body', type: 'object', http: {source: 'body'}},
        ],
        http: {path: '/newOrderCreated', verb: 'post'},
        returns: {arg: 'msg', type: 'string'}
    });
};
