import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import './product.css'
import { chipFabId } from "../../productId";
import Cookies from 'js-cookie';
import {getCustomerCart, 
        manipulateCustomerOrders,
        addOrderProductToCart} from "../../api/serverConfig";
import API from "../../api/api";

class Product extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            fetchedProduct: false,
            product: undefined,
            orderInfoId: undefined,
            shopifyClientCheckoutId: undefined,
            quantity: 0,
        };
        this.handleGetCart = this.handleGetCart.bind(this);
        this.addItemToCart = this.addItemToCart.bind(this);
    }

    componentDidMount(){
        console.log(chipFabId);
        if(this.props.location.search === ""){
            this.props.history.push('/allItems'); //redirect if no ID provided
            return;
        }
        let _this = this;
        let productId = this.props.location.search.slice(4); // ?id=<id>
        this.props.shopifyClient.product.fetch(productId)
        .then((product) => {
            // console.log(product);
            _this.setState({
                product: product,
                fetchedProduct: true,
                addedToCart: true,
                fileName: undefined,
                fileId: undefined
            });
        })
        .catch((err) => {
            console.log(err);
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
        if(Cookies.get('access_token')===undefined){
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
            let shopifyClient = _this.props.shopifyClient;
            let url = getCustomerCart.replace('id', Cookies.get('userId'));
            API.Request(url, 'GET', {}, true)
            .then(res => {
                if(res.data.id){
                    console.log(`Have cart already with ID ${res.data.id}`);
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
                    console.log(`No cart currently exists, so need to create one`);
                    shopifyClient.checkout.create()
                    .then(res => {
                        // console.log(res);
                        _this.setState({
                            shopifyClientCheckoutId: res.id
                        });
                        let data = {
                            "checkoutIdClient": res.id,
                            "checkoutIdServer": "Awaiting checkout creation webhook",
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
     * Function to update Shopify and our own cart
     * @param {number} orderInfoId - id of orderInfo model in our DB
     * @param {string} shopifyClientCheckoutId - id of Shopify client checkout
     * @param {number} quantity - number of items to add
     */
    addItemToCart(orderInfoId, shopifyClientCheckoutId, quantity) {
        // add to shopify cart, and then add to our own cart       
        let _this = this;
        const lineItemsToAdd = [{
            variantId: _this.state.product.variants[0].id,
            quantity: quantity,
        }];
        _this.props.shopifyClient.checkout.addLineItems(shopifyClientCheckoutId, lineItemsToAdd)
        .then(res => {
            // console.log(res);
            let data = {
                "orderInfoId": orderInfoId,
                "productIdShopify": _this.state.product.id,
                "variantIdShopify": _this.state.product.variants[0].id,
                "description": _this.state.product.description,
                "quantity": quantity,
                "price": parseFloat(_this.state.product.variants[0].price),
                "otherDetails": "",
            };
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
                            { desiredProductId === chipFabId
                                ? <div className="shop-material">
                                    <h2>Process</h2>
                                    <div className="col-sm-3 col-md-3 col-lg-3" id="shop-left-align">
                                        <ul id="myTab" className="nav nav-pills nav-stacked">
                                            abcdefg
                                        </ul>
                                    </div>
                                    <div className="col-sm-9 col-md-9 col-lg-9">
                                        <div className="tab-content">
                                            <div>
                                                ITO glass is good substrate choice for optical applications. The ITO layer has 
                                                thickness of 200 nm. The glass is soda-lime glass with thickness of 0.7 nm. The 
                                                whole substrate is 4 inches in diameter.
                                            </div>
                                            <div >
                                                Paper is good substrate choice for optical applications. The ITO layer has a 
                                                thickness of 200 nm. The glass is soda-lime glass with thickness of 0.7 nm. The 
                                                whole substrate is 4 inches in diameter.
                                            </div>
                                            <div>
                                                PCB has thickness of 200 nm, which enables multiple layers of patterns. The 
                                                whole substrate is 4 inches in diameter.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                : null
                            } 
                        </div>
                        <div className="shop-right-content">
                            <NavLink to="/allItems">{'<< Return to all products'}</NavLink>
                            <div><h2>{product.title}</h2></div>
                            <div className="product-description" 
                                dangerouslySetInnerHTML={{__html: product.descriptionHtml}}>
                            </div>                       
                            { desiredProductId === chipFabId
                                ? <div className="chip-config">
                                    <h3>Item Options</h3>
                                    <div className="div-filename">File to be fabricated:&nbsp;
                                    { this.state.fileName !== undefined
                                    ? this.state.fileName
                                    : <input type="button" value="Choose Fabrication File" className="btn btn-primary btn-med"></input>
                                    }
                                    </div>
                                    <div className="config-process">
                                        Process: hello
                                    </div>
                                    <div className="config-items">
                                        <input type="checkbox" />
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
