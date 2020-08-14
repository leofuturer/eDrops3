import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import './product.css'
import { chipFabId } from "../../productId";
import Cookies from 'js-cookie';
import {getCustomerCart, 
        manipulateCustomerOrders} from "../../api/serverConfig";
import API from "../../api/api";

class Product extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            fetchedProduct: false,
            product: undefined,
            orderInfoId: undefined,
            checkoutId: undefined,
        };
        this.handleAddToCart = this.handleAddToCart.bind(this);
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

    handleAddToCart(){
        console.log("Attempting add to cart");
        if(Cookies.get('access_token')===undefined){
            alert("Login required to add item to cart");
            return;
        }
        else{
            console.log(this.props);
            let shopifyClient = this.props.shopifyClient;
            let url = getCustomerCart.replace('id', Cookies.get('userId'));
            API.Request(url, 'GET', {}, true)
            .then(res => {
                if(res.data.orderInfoId){
                    console.log(`Have cart already with ID ${res.data.orderInfoId}`);
                }
                else{ //no cart, need to create one
                    shopifyClient.checkout.create()
                    .then(res => {
                        console.log(res);
                        this.setState({
                            checkoutId: res.id
                        });
                        let data = {
                            "checkoutIdClient": res.id,
                            "checkoutIdServer": "Awaiting checkout creation webhook",
                            "createdAt": res.createdAt,
                            "lastModifiedAt": res.updatedAt,
                            "orderComplete": false,
                            "totalCost": 0,
                            "status": "Order in progress",
                            "customerId": Cookies.get('userId'),
                            "shippingAddressId": 0, //0 to indicate no address selected yet (pk cannot be 0)
                            "billingAddressId": 0
                        };
                        url = manipulateCustomerOrders.replace('id', Cookies.get('userId'));
                        API.Request(url, 'POST', data, true)
                        .then(res => {
                            console.log(res);
                        })
                        .catch(err => {
                            console.log(err);
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
                                    <input type="number" className="input-quantity"/>
                                </div> 
                            </div>
                            <div className="cart-btn">
                                <input type="button" value="Add to Cart" 
                                    className="btn btn-primary btn-lg btn-block"
                                    onClick={e => this.handleAddToCart()}>            
                                </input>
                            </div>
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
