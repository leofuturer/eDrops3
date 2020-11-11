import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import './product.css'
import { univEwodChipId, 
    univEwodChipWithCoverPlate, 
    univEwodChipWithoutCoverPlate } from "../../constants";
import Cookies from 'js-cookie';
import {getCustomerCart, customerGetProfile,
        manipulateCustomerOrders,
        addOrderProductToCart, returnOneItem} from "../../api/serverConfig";
import API from "../../api/api";
import Shopify from '../../app.jsx';

class Product extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            fetchedProduct: false,
            product: undefined,
            orderInfoId: undefined,
            shopifyClientCheckoutId: undefined,
            quantity: 1,
            otherDetails: {},
        };
        this.handleGetCart = this.handleGetCart.bind(this);
        this.addItemToCart = this.addItemToCart.bind(this);
        this.handleOptionsChange = this.handleOptionsChange.bind(this);
    }

    componentDidMount(){
        // console.log(univEwodChipId);
        if(this.props.location.search === ""){
            this.props.history.push('/allItems'); //redirect if no ID provided
            return;
        }
        
        let _this = this;
        let productId = this.props.location.search.slice(4); // ?id=<id>
        if(productId === univEwodChipId){
            this.setState({
                otherDetails: {
                    withCoverPlateAssembled: false,
                },
            });
        }
        //console.log(productId);
        let url = returnOneItem + `?productId=${productId}`;
        API.Request(url, 'GET', {}, false)
        .then( res => {
            _this.setState({
                product: res.data.product,
                fetchedProduct: true,
                addedToCart: true,
            });
        }).catch((err) => {
            console.error(err);
            //redirect to all items page if product ID is invalid
            this.props.history.push('/allItems'); 
        });
    }

    handleChange(key, value) {
        this.setState(
            {
                [key]: value
            }
        )
    }

    handleOptionsChange(key, value){
        let newData = {
            [key]: value
        };
        this.setState({
            otherDetails: Object.assign({}, this.state.otherDetails, newData),
        });
    }

    handleGetCart(){
        /**
         * Do not allow if not logged in or nonpositive quantity to add.
         * 
         * Retrieve customer's cart, or create one if not already present
         * Then, create Shopify checkout 
         * Then, call addItemToCart() with orderInfo ID (our own cart id) and
         *      Shopify checkout ID
         */
        let _this = this;
        if(Cookies.get('access_token') === undefined){
            alert("Login required to add item to cart");
            return;
        }
        if(parseInt(this.state.quantity) <= 0){
            alert("Error: Quantity must be a positive number");
            return;
        }
        else{
            _this.setState({
                addedToCart: false,
            });
            // console.log(_this.props);
            let shopifyClient = Shopify.getInstance("","");
            let url = getCustomerCart.replace('id', Cookies.get('userId'));
            API.Request(url, 'GET', {}, true)
            .then(res => {
                if(res.data.id){
                    // console.log(`Have cart already with ID ${res.data.id}`);
                    _this.setState({
                        orderInfoId: res.data.id,
                        shopifyClientCheckoutId: res.data.checkoutIdClient,
                    });
                    _this.addItemToCart(res.data.id, 
                        res.data.checkoutIdClient, 
                        parseInt(this.state.quantity)
                    );
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
                        // console.log(shopifyCheckoutToken);
                        let data = {
                            "checkoutIdClient": res.id,
                            "checkoutToken": shopifyCheckoutToken,
                            "checkoutLink": res.webUrl,
                            "createdAt": res.createdAt,
                            "lastModifiedAt": res.updatedAt,
                            "orderComplete": false,
                            "status": "Order in progress",
                            // "customerId": Cookies.get('userId'),
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
                            _this.addItemToCart(res.data.id, 
                                                res.data.checkoutIdClient, 
                                                parseInt(this.state.quantity)
                            );
                        })
                        .catch(err => {
                            _this.setState({
                                addedToCart: true,
                            });
                            console.error(err);
                        });
                    })
                    .catch(err => {
                        _this.setState({
                            addedToCart: true,
                        });
                        console.error(err);
                    });
                }
            })
            .catch(err => {
                _this.setState({
                    addedToCart: true,
                });
                console.error(err);
            });
        }
    }

    /**
     * Function to update Shopify checkout and our own cart
     * @param {number} orderInfoId - id of orderInfo model in our DB
     * @param {string} shopifyClientCheckoutId - id of Shopify client checkout
     * @param {number} quantity - number of items to add
     */
    addItemToCart(orderInfoId, shopifyClientCheckoutId, quantity) {
        // add to shopify cart, and then add to our own cart       
        let _this = this;
        let customShopifyAttributes = [];
        let customServerOrderAttributes = "";
        for (let [k, v] of Object.entries(_this.state.otherDetails).sort((a, b) => a[0].localeCompare(b[0]))) {
            if(v !== undefined){
                customShopifyAttributes.push({key: k, value: v});
                customServerOrderAttributes += `${k}: ${v}\n`;
            }           
        }
        let variantId = _this.state.product.id !== univEwodChipId 
            ? _this.state.product.variants[0].id
            : _this.state.otherDetails.withCoverPlateAssembled 
                ? univEwodChipWithCoverPlate
                : univEwodChipWithoutCoverPlate;
        // console.log(variantId);
        const lineItemsToAdd = [{
            variantId: variantId,
            quantity: quantity,
        }];
        Shopify.getInstance("","").checkout.addLineItems(shopifyClientCheckoutId, lineItemsToAdd)
        .then(res => {
            let lineItemId;
            // console.log(res);
            for(let i = 0; i<res.lineItems.length; i++){
                if(res.lineItems[i].variant.id === variantId){
                    lineItemId = res.lineItems[i].id;
                    // console.log(lineItemId);
                    break;
                }
            }
            let data = {
                "orderInfoId": orderInfoId,
                "productIdShopify": _this.state.product.id,
                "variantIdShopify": variantId,
                "lineItemIdShopify": lineItemId,
                "description": _this.state.product.description,
                "quantity": quantity,
                "price": parseFloat(_this.state.product.variants[0].price),
                "name": _this.state.product.title,
                "otherDetails": customServerOrderAttributes,
            };
            // console.log(data);
            let url = addOrderProductToCart.replace('id', orderInfoId);
            API.Request(url, 'POST', data, true)
            .then(res => {
                // console.log(res);
                _this.setState({
                    addedToCart: true,
                });
            })
            .catch(err =>{
                console.error(err);
                _this.setState({
                    addedToCart: true,
                });
            });
        })
        .catch(err => {
            console.error(err);
            _this.setState({
                addedToCart: true,
            });
        });
    }

    render(){
        // if(this.state.fetchedProduct){
        //     var description = this.state.product.descriptionHtml;
        // }
        const product = this.state.product;
        const desiredProductId = this.props.location.search.slice(4); //get id after id?=
        return (
            <div className="order-container">
                <div className="shop-main-content">
                    { this.state.fetchedProduct
                    ? <div>
                        <div className="shop-left-content">
                            <div className="div-img">
                                <img src={this.state.product.variants[0].image.src}/>
                            </div>
                        </div>
                        <div className="shop-right-content">
                            <NavLink to="/allItems">{'<< Return to all products'}</NavLink>
                            <div><h2>{product.title}</h2></div>
                            <div className="product-description" 
                                dangerouslySetInnerHTML={{__html: product.descriptionHtml}}>
                            </div>                       
                            { desiredProductId === univEwodChipId
                                ? <div className="chip-config">
                                    <h3>Item Options</h3>
                                    <div className="config-items">
                                        <input type="checkbox" onChange = {v => this.handleOptionsChange('withCoverPlateAssembled', v.target.checked)}/>
                                        <span className="option-detail">With Cover Plate Assembled</span>
                                    </div>
                                </div>
                                : null
                            }
                            
                            <div className="div-price-quantity">
                                <div className="div-product-price">
                                    Price: ${product.variants[0].price}
                                </div>
                                <div className="div-product-quantity">
                                    Quantity:&nbsp; 
                                    <input type="number" className="input-quantity"
                                    value = {this.state.quantity}
                                    onChange = {v => this.handleChange('quantity', v.target.value)}/>
                                </div> 
                            </div>
                            { this.state.addedToCart
                            ? <div className="cart-btn">
                                <input type="button" value="Add to Cart" 
                                    className="btn btn-primary btn-lg btn-block"
                                    onClick={e => this.handleGetCart()}>            
                                </input>
                            </div>
                            : <img className="loading-GIF" src="../../../static/img/loading80px.gif" alt=""/>
                                
                            }
                            
                            <div className="tax-info">Note: Price excludes sales tax</div>                           

                        </div>
                    </div>
                    : <img className="loading-GIF" src="../../../static/img/loading80px.gif" alt=""/>
                }           
                </div>
            </div>
        );
    }
};

Product = withRouter(Product);
export default Product;
