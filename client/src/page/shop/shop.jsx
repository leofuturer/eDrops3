/* 
    Some basic concepts here:
    product: a type of product created in the Shopify development store

    product variant: a product can have multiple product variant, the "EWOD chip manufacturing service" 
    is a product variant set in the Shopify development store

    checkout: a "checkout" can be treated as bundled information used to create an order in the Shopify development store,
    it contains multiple lineItems

    lineItem: when a product variant is added to the cart (essentially added to the shopifyClient.checkout.lineItems),
    it becomes a lineItem in that "checkout"
*/

import React from 'react';
import './shop.css';
import Cookies from "js-cookie";
import {getCustomerCart, manipulateCustomerOrders, addOrderChipToCart} from "../../api/serverConfig";
import API from "../../api/api";
import { ewodFabServiceId, 
    ewodFabServiceVariantId } from "../../constants";

class Shop extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            cIndex: 0,
            material: ['ITO Glass', 'Paper', 'PCB'],
            materialVal: 'ITO Glass',
            quantity: 1,
            wcpb: false,
            fileInfo: {
                id: 0,
                fileName: "",
            },
        }
      
        this.setCurrentIndex = this.setCurrentIndex.bind(this);
        this.addVariantToCart = this.addVariantToCart.bind(this);
    }

    componentDidMount() {
        // console.log(this.props);  
        if(Cookies.get('access_token') === undefined){
            alert("Login required for this page");
            this.props.history.push('/login');
            return;
        }
        else if(this.props.location.state === undefined){
            alert("Please pick a file for fabrication");
            this.props.history.push('/manage/files');
            return;
        }
        else{
            
            let _this = this;
            let url = getCustomerCart.replace('id', Cookies.get('userId'));
            let shopifyClient = _this.props.shopifyClient;
            _this.setState({
                fileInfo: this.props.location.state.fileInfo,
            });
            shopifyClient.product.fetch(ewodFabServiceId)
            .then((product) => {
                // console.log(product);
                _this.setState({
                    product: product,
                });
            })
            .catch((err) => {
                console.error(err);
                //redirect to all items page if product ID is invalid
                this.props.history.push('/allItems'); 
            });
            API.Request(url, 'GET', {}, true)
            .then(res => {
                if(res.data.id){
                    // console.log(`Have cart already with ID ${res.data.id}`);
                    _this.setState({
                        orderInfoId: res.data.id,
                        shopifyClientCheckoutId: res.data.checkoutIdClient,
                    });
                }
                else{ //no cart, need to create one
                    // create Shopify cart
                    // console.log(`No cart currently exists, so need to create one`);
                    shopifyClient.checkout.create()
                    .then(res => {
                        // console.log(res);
                        _this.setState({
                            shopifyClientCheckoutId: res.id
                        });
                        let lastSlash = res.webUrl.lastIndexOf('/');
                        let lastQuestionMark = res.webUrl.lastIndexOf('?');
                        let shopifyCheckoutToken = res.webUrl.slice(lastSlash + 1, lastQuestionMark);
                        let data = {
                            "checkoutIdClient": res.id,
                            "checkoutToken": shopifyCheckoutToken,
                            "checkoutLink": res.webUrl,
                            "createdAt": res.createdAt,
                            "lastModifiedAt": res.updatedAt,
                            "orderComplete": false,
                            "status": "Order in progress",
                            "shippingAddressId": 0, //0 to indicate no address selected yet (pk cannot be 0)
                            "billingAddressId": 0
                        };
                        // and then create orderInfo in our backend
                        url = manipulateCustomerOrders.replace('id', Cookies.get('userId'));
                        API.Request(url, 'POST', data, true)
                        .then(res => {
                            // console.log(res);
                            _this.setState({
                                orderInfoId: res.data.id,
                            });
                        })
                        .catch(err => {
                            console.error(err);
                        });
                    })
                    .catch(err => {
                        console.error(err);
                    });
                }
            })
            .catch(err => {
                console.error(err);
            });
        }
        
    }
    
    handleChange(key, value) {
        this.setState(
            {
                [key]: value
            }
        )
    }

    /*
        This function realize the functionality of adding the manufacture service to the cart

        We create a virtual product called "EWOD Chip Manufacturing Service" in Shopify development store
        and here we are actually add this product with some customized options 
        set in the Shopify development store by the "customAttribute" (a feature provided by Shopify -> Product) 
        to the "shopifyClient.checkout.lineItems", an API provided by js-buy-sdk. 
        
        Then later in the cart.jsx, when "shopifyClient.checkout.webUrl" is opened by a new "window" Object,
        all the items added to the "shopifyClient.checkout.lineItems" will be added to the created order(taken care of by js-buy-sdk) 
        automatically when customers checkout in that page.

        @variantId: The variantId here is the variantId of the product set by the development
                    we hard code it in the "render()" function below and pass the value in
        @quantity: The quantity seleted by customer, put in from frontend page
    */
    addVariantToCart(variantId, quantity){
        if(quantity < 1){
            alert("Quantity must be at least 1");
            return;
        } else {
            let _this = this;
            const wcpbVal = _this.state.wcpb.toString();
            const lineItemsToAdd = [{variantId, 
                                    quantity: parseInt(quantity, 10), 
                                    customAttributes: [
                                    {
                                        key: "material",
                                        value: _this.state.materialVal
                                    },
                                    {
                                        key: "withCoverPlateAssembled",
                                        value: wcpbVal
                                    },
                                    {
                                        key: "fileName",
                                        value: _this.state.fileInfo.fileName
                                    }
                                    ] 
                                }];
            let customServerOrderAttributes = "";
            customServerOrderAttributes += `material: ${_this.state.materialVal}\n`;
            customServerOrderAttributes += `withCoverPlateAssembled: ${wcpbVal}\n`;
            customServerOrderAttributes += `fileName: ${_this.state.fileInfo.fileName}\n`;
            const checkoutId = _this.state.shopifyClientCheckoutId;
            _this.props.shopifyClient.checkout.addLineItems(checkoutId, lineItemsToAdd)
            .then(res => {
                let lineItemId;
                for(let i = 0; i<res.lineItems.length; i++){
                    if(res.lineItems[i].variant.id === variantId){
                        lineItemId = res.lineItems[i].id;
                        break;
                    }
                }
                // create our own chip order here...
                let data = {
                    "orderInfoId": _this.state.orderInfoId,
                    "productIdShopify": ewodFabServiceId,
                    "variantIdShopify": variantId,
                    "lineItemIdShopify": lineItemId,
                    "name": _this.state.product.title,
                    "description": _this.state.product.description,
                    "quantity": quantity,
                    "price": parseFloat(_this.state.product.variants[0].price),
                    "otherDetails": customServerOrderAttributes,
                    "process": this.state.materialVal,
                    "coverPlate": wcpbVal,
                    "lastUpdated": Date.now(),
                    "fileInfoId": this.state.fileInfo.id,
                    "workerId": 0,
                }
                // console.log(res);
                let url = addOrderChipToCart.replace('id', _this.state.orderInfoId);
                API.Request(url, 'POST', data, true)
                .then(res => {
                    // console.log(res);
                })
                .catch(err =>{
                    console.error(err);
                });
            })
            .catch(err => {
                console.error(err);
            });
        }   
    }

    setCurrentIndex(event) {
        this.setState({
            cIndex: parseInt(event.currentTarget.getAttribute('index'), 10)
        });
        this.state.materialVal = this.state.material[event.currentTarget.getAttribute('index')]
    }

    render() {
        let tabShow = []
        let variantId = ewodFabServiceVariantId;
        for(let i = 0; i < this.state.material.length; i++) {
            tabShow.push(
                <li key={i} 
                    className={this.state.cIndex === i ? 'active':''} 
                    index={i} 
                    onClick={this.setCurrentIndex} > 
                    <a data-toggle="tab">
                        {this.state.material[i]}
                    </a>
                </li>
            );
        }
        
        return(
            <div className="order-container">
                <div className="shop-main-content">
                    <div className="shop-left-content">
                        {/* DY - replace temporary image above with a preview of the uploaded PDF */}
                        <div className="div-img">
                            <img src="../../../static/img/DXFComingSoon.PNG" style={{width : "600px"}}/>
                            {/* <object id="pdfdoc" data={url} type="application/pdf" /> */}
                        </div>
                        <div className="shop-material">
                            <h2>Process</h2>
                            <div className="col-sm-3 col-md-3 col-lg-3" id="shop-left-align">
                                <ul id="myTab" className="nav nav-pills nav-stacked">
                                    {tabShow}
                                </ul>
                            </div>
                            <div className="col-sm-9 col-md-9 col-lg-9">
                                <div className="tab-content">
                                    <div className={this.state.cIndex === 0 ? 'tab-pane fade in active':'tab-pane fade in'}>
                                        ITO glass is good substrate choice for optical applications. The ITO layer has 
                                        thickness of 200 nm. The glass is soda-lime glass with thickness of 0.7 nm. The 
                                        whole substrate is 4 inches in diameter.
                                    </div>
                                    <div className={this.state.cIndex === 1 ? 'tab-pane fade in active':'tab-pane fade in'}>
                                        Paper is good substrate choice for optical applications. The ITO layer has a 
                                        thickness of 200 nm. The glass is soda-lime glass with thickness of 0.7 nm. The 
                                        whole substrate is 4 inches in diameter.
                                    </div>
                                    <div className={this.state.cIndex === 2 ? 'tab-pane fade in active':'tab-pane fade in'}>
                                        PCB has thickness of 200 nm, which enables multiple layers of patterns. The 
                                        whole substrate is 4 inches in diameter.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="shop-right-content">
                        <div className="div-filename">{'File to be fabricated: '}</div>
                        <div>{this.state.fileInfo.fileName}</div>
                        <div className="shop-config">
                            <h2>Chip Configuration Options</h2>
                            <p className="config-items">
                                <input type="checkbox" onChange={v => this.handleChange('wcpb', v.target.checked)}/>
                                <span style={{paddingLeft:'10px'}}>With Cover Plate Assembled</span>
                            </p>
                        </div>
                        <div className="div-shop-quantity">
                            <label>Quantity:&nbsp;</label>
                            { this.state.product !== undefined 
                            ?
                            <div> 
                                <input type="number" className="input-quantity" 
                                    value={this.state.quantity} 
                                    onChange={v => this.handleChange('quantity', v.target.value)}/> X ${this.state.product.variants[0].price} = 
                                <span> ${(this.state.quantity * this.state.product.variants[0].price).toFixed(2)}</span>   
                            </div>
                            : null
                            }                                            
                            <p className="cart-btn">
                                <input type="button" className="btn btn-primary btn-lg btn-block" 
                                    value="Add to Cart" 
                                    onClick={e => this.addVariantToCart(variantId, this.state.quantity)}/>
                            </p>                          
                        </div>
                        <div className="tax-info">Note: Price excludes sales tax</div>                   
                    </div>
                </div>
                <div className="hr-div-login"></div>
            </div>
        )
    }
}

export default Shop;
