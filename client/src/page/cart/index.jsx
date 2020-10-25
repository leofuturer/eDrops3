import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import '@babel/polyfill'
import  CartItem  from './cartItem.jsx';
import { ewodFabServiceId } from '../../constants';
import './cart.css';
import API from "../../api/api";
import { getCustomerCart, getProductOrders, 
        getChipOrders, modifyProductOrders, 
        modifyChipOrders 
    } from '../../api/serverConfig';
import Cookies from "js-cookie";
import ShopifyClient from 'shopify-buy';
const shopifyClient = ShopifyClient.buildClient({
    storefrontAccessToken: 'c098a4c1f8d45e55b35caf24ca9c97bb',
    domain: 'wqntest.myshopify.com'
});

class Cart extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            cartExists: undefined,
            cartId: undefined,
            shopifyCheckoutId: undefined,
            productOrders: [],
            chipOrders: [],
            modifiedItems: new Set(),
            saveInProgress: false,
            cartLoading: true,
        }
        this.handleQtyChange = this.handleQtyChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleCheckout = this.handleCheckout.bind(this);
    }

    componentDidMount() {
        let _this = this;
        let url = getCustomerCart.replace('id', Cookies.get('userId'));
        API.Request(url, 'GET', {}, true)
        .then(res => {
            if(res.data.id){
                // console.log(res);
                let orderInfoId = res.data.id;
                _this.setState({
                    cartExists: true,
                    cartId: res.data.id,
                    shopifyCheckoutId: res.data.checkoutIdClient,
                    shopifyCheckoutLink: res.data.checkoutLink,
                });

                url = getProductOrders.replace('id', orderInfoId);
                API.Request(url, 'GET', {}, true)
                .then(res => {
                    _this.setState({
                        productOrders: res.data,
                    });
                    url = getChipOrders.replace('id', orderInfoId);
                    API.Request(url, 'GET', {}, true)
                    .then(res => {
                        _this.setState({
                            chipOrders: res.data,
                            cartLoading: false,
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
            else{
                _this.setState({
                    cartExists: false,
                    cartLoading: false,
                });
            }
        })
        .catch(err => {
            console.error(err);
        });
    }

    handleQtyChange(e, itemType, index){
        if(e.target.value < 1){
            alert("Error: quantity cannot be less than 1");
            e.target.value = 1;
            return;
        }
        else{
            // https://stackoverflow.com/questions/29537299/react-how-to-update-state-item1-in-state-using-setstate
            if(itemType === 'product'){
                let items = [...this.state.productOrders];
                let item = Object.assign({}, items[index]); // replacement for let item = {...items[index]};
                item.quantity = parseInt(e.target.value);
                items[index] = item;
                this.setState({
                    productOrders: items,
                    modifiedItems: new Set(this.state.modifiedItems).add(item.variantIdShopify),
                });
            }
            else if(itemType === 'chip'){
                let items = [...this.state.chipOrders];
                let item = Object.assign({}, items[index]); // replacement for let item = {...items[index]};
                item.quantity = e.target.value;
                items[index] = item;
                this.setState({
                    chipOrders: items,
                    modifiedItems: new Set(this.state.modifiedItems).add(item.variantIdShopify),
                });
            }
        }  
    }

    handleDelete(itemType, index){
        let _this = this;
        let url;
        if(itemType === 'product'){
            var array = _this.state.productOrders;
        }
        else if(itemType === 'chip'){
            var array = _this.state.chipOrders;
        }
        // Delete from Shopify, then our own DB
        const itemToDelete = [array[index].lineItemIdShopify];
        shopifyClient.checkout.removeLineItems(_this.state.shopifyCheckoutId, itemToDelete)
        .then(checkout => {
            // console.log(checkout.lineItems);
            if(itemType === 'product'){
                url = modifyProductOrders.replace('id', array[index].id);
            }
            else if(itemType === 'chip'){
                url = modifyChipOrders.replace('id', array[index].id);
            }
            API.Request(url, 'DELETE', {}, true)
            .then(res => {
                if(itemType === 'product'){
                    const products = this.state.productOrders.filter(function(item){
                        return item.id !== array[index].id
                    });
                    this.setState({productOrders: products});
                    // console.log(products);
                }
                else if(itemType === 'chip'){
                    const chips = this.state.chipOrders.filter(item => item.id !== array[index].id);
                    this.setState({chipOrders: chips});
                }
            })
            .catch(err => {
                console.error(err)
            });
        })
        .catch(err => {
            console.error(err);
        });
    }

    handleSaveForOrders(array, type){
        // console.log("Updating DB");       
        let url;
        let _this = this;     
        if(_this.state.modifiedItems.size > 0){
            this.setState({
                saveInProgress: true,
            });
        }
        for(let i = 0; i < array.length; i++){
            if(_this.state.modifiedItems.has(array[i].variantIdShopify)){
                let itemsToUpdate = [{
                    id: array[i].lineItemIdShopify,
                    quantity: parseInt(array[i].quantity),
                }];
                shopifyClient.checkout.updateLineItems(_this.state.shopifyCheckoutId, itemsToUpdate)
                .then(checkout => {
                    // console.log(checkout.lineItems);
                    if(type === 'product'){
                        url = modifyProductOrders.replace('id', array[i].id);
                    }
                    else if(type === 'chip'){
                        url = modifyChipOrders.replace('id', array[i].id);
                    }
                    let data = {quantity: parseInt(array[i].quantity)};
                    API.Request(url, 'PATCH', data, true)
                    .then(res => {
                        this.setState({
                            saveInProgress: false,
                        });
                    })
                    .catch(err => {
                        console.error(err)
                        this.setState({
                            saveInProgress: false,
                        });
                    });
                })
                .catch(err => {
                    console.error(err);
                    this.setState({
                        saveInProgress: false,
                    });
                });    
            }
        }      
    }

    handleSave(){
        let _this = this;
        _this.handleSaveForOrders(_this.state.productOrders, 'product')
        _this.handleSaveForOrders(_this.state.chipOrders, 'chip')
    }

    handleCheckout(){
        this.props.history.push('/beforeCheckout', {
            shopifyCheckoutLink: this.state.shopifyCheckoutLink,
            cartId: this.state.cartId,
            shopifyCheckoutId: this.state.shopifyCheckoutId,
        });
    }

    render() {
        let totalPrice = 0;
        this.state.productOrders.forEach(product => {
            totalPrice += (product.quantity * product.price);
        });
        this.state.chipOrders.forEach(product => {
            totalPrice += (product.quantity * product.price);
        });
        return (
            <div> 
                { Cookies.get('userType') === 'customer'
                ? <div className="right-route-content"> 
                    <div className="profile-content">
                        <h2>Cart</h2>
                    </div>
                    { this.state.productOrders.length + this.state.chipOrders.length > 0 
                    ? <div>
                        <div className="left-right-wrapper">
                            <div className="cart-info-text">
                                Use the "save" button to save any 
                                changes to quantities. Deletions are saved immediately.
                            </div>
                            <div>
                                { this.state.saveInProgress
                                ? <img className="cart-loading-GIF" src="../../../static/img/loading80px.gif" alt=""/>
                                : <span className="cart-save-btn">
                                    <input type="button" value="Save" 
                                        className="btn btn-success"
                                        onClick = {() => this.handleSave()}>            
                                    </input>
                                </span>
                                }
                                <span className="btn-txt-padding">
                                    <input type="button" value="Checkout" 
                                        className="btn btn-primary btn-padding"
                                        onClick = {() => this.handleCheckout()}>            
                                    </input>
                                </span>     
                            </div>                                
                        </div>
                        {
                            this.state.productOrders.map((oneProduct, index) => 
                                <CartItem key={index} info={oneProduct}
                                    onChange={(e) => this.handleQtyChange(e, 'product', index)} 
                                    onDelete={() => this.handleDelete('product', index)}
                                />
                            )
                        }
                        {
                            this.state.chipOrders.map((oneProduct, index) => 
                                <CartItem key={index} info={oneProduct}
                                    onChange={(e) => this.handleQtyChange(e, 'chip', index)} 
                                    onDelete={() => this.handleDelete('chip', index)}
                                />
                            )
                        }
                        <div className="cart-total-price">
                            {'Total Price: $'}{totalPrice.toFixed(2)}
                        </div>
                        <div className="cart-total-price-info">
                            Excludes tax and shipping and handling
                        </div>             
                    </div>
                    : <div>
                        { this.state.cartLoading
                        ? <img className="loading-GIF" src="../../../static/img/loading80px.gif" alt=""/>
                        : <div className = "empty-cart">
                            {`Your cart is currently empty. You can either upload a 
                                file for a custom chip order or view our products `} 
                                <NavLink to="/allItems">here</NavLink>.
                        </div>
                    }
                    </div>
                    } 
                </div>
                : null

                }
                
            </div>
        );   
    }
}

export default Cart;