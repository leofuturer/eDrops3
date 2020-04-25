import React from 'react';
import { withRouter } from 'react-router-dom';

import $ from 'jquery';
import './shop.css';
import Cookies from "js-cookie";
import { downloadFileById } from '../../api/serverConfig'; //for previewing PDF file
import Cart from "./cart.jsx";

class Shop extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            cIndex: 0,
            material: ['ITO glass','paper','PCB'],
            materialVal: 'ITO glass',
            quantity: 1,
            wcpb: false,
            fileName: this.props.location.state.fileName,
            isCartOpen: false,
            checkout: {lineItems: []}
        }
        
        this.setCurrentIndex = this.setCurrentIndex.bind(this);
        this.addVariantToCart = this.addVariantToCart.bind(this);
        this.handleCartClose = this.handleCartClose.bind(this);
        this.updateQuantityInCart = this.updateQuantityInCart.bind(this);
        this.removeLineItemInCart = this.removeLineItemInCart.bind(this);
        //this.handleCart = this.handleCart.bind(this);
    }

    componentDidMount() {
        this.props.shopifyClient.checkout.create().then((res) => {
            this.setState({
              checkout: res,
            });
        });

        this.props.shopifyClient.shop.fetchInfo().then((res) => {
            this.setState({
              shop: res,
            });
        });
    }
    
    handleChange(key, value) {
        this.setState(
            {
                [key]: value
            }
        )
    }

    addVariantToCart(variantId, quantity){
        this.setState({
            isCartOpen: true
        });

        const wcpbVal = this.state.wcpb.toString();
        const lineItemsToAdd = [{variantId, 
                                quantity: parseInt(quantity, 10), 
                                customAttributes: [
                                  {
                                    key: "material",
                                    value: this.state.materialVal
                                  },
                                  {
                                    key: "withCoverPlateAssembled",
                                    value: wcpbVal
                                  },
                                  {
                                    key: "fileName",
                                    value: this.state.fileName
                                  }
                                ] 
                               }];
    
        const checkoutId = this.state.checkout.id;
    
        return this.props.shopifyClient.checkout.addLineItems(checkoutId, lineItemsToAdd)
        .then(res => {
          this.setState({
            checkout: res
          });
        })
        .catch(err => {
            console.log(err);
        });
    }

    updateQuantityInCart(lineItemId, quantity) {
        const checkoutId = this.state.checkout.id
        const lineItemsToUpdate = [{
          id: lineItemId, 
          quantity: parseInt(quantity, 10),                             
          customAttributes: [{
                key: "material",
                value: this.state.materialVal
            },
            {
                key: "withCoverPlateAssembled",
                value: this.state.wcpb.toString()
            },
            {
                key: "fileName",
                value: this.state.fileName
            }
          ]
        }];
    
        return this.props.shopifyClient.checkout.updateLineItems(checkoutId, lineItemsToUpdate).then(res => {
          this.setState({
            checkout: res,
          });
        });
      }
    
    removeLineItemInCart(lineItemId) {
        const checkoutId = this.state.checkout.id
        return this.props.shopifyClient.checkout.removeLineItems(checkoutId, [lineItemId]).then(res => {
          this.setState({
            checkout: res,
          });
        });
    }

    handleCartClose() {
        this.setState({
          isCartOpen: false,
        });
    }

    setCurrentIndex(event) {
        this.setState({
            cIndex: parseInt(event.currentTarget.getAttribute('index'), 10)
        });
        this.state.materialVal = this.state.material[event.currentTarget.getAttribute('index')]
    }

    render() {
        let tabShow = []
        let variantId = "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8yOTE4MDQxMzQ3Njg5OA==";
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

        // console.log(this.state.fileName);

        // Download the referenced file via the backend API
        let url = downloadFileById.replace('filename', this.state.fileName);
        
        return(
            <div className="order-container">
                {!this.state.isCartOpen &&
                    <div className="shop-cart-wrapper">
                        <button className="shop-cart" onClick={()=> this.setState({isCartOpen: true})}>Cart</button>
                    </div>
                }
                <div className="shop-main-content">
                    <div className="shop-left-content">
                        {/* Most likely take out these buttons b/c pdf viewer will take care of it.
                        <div className="operation-icon">
                            <i className="fa fa-cloud-download"></i>
                            <i className="fa fa-link"></i>
                            <i className="fa fa-plus-circle"></i>
                            <i className="fa fa-minus-circle"></i>
                        </div>
                        <div className="div-img">
                            <img src="../../../static/img/EWOD-chip-compressed-small.png" alt=""/>
                        </div> */}

                        {/* DY - replace temporary image above with a preview of the uploaded PDF */}
                        <div className="div-img">
                            <object id="pdfdoc" data={url} type="application/pdf" />

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
                                        ITO glass is good substrate choice for optical applications. The ITO layer has thickness of 200nm. The glass is soda-lime glass with thickness of 0.7nm. The whole substrate is 4" in diameter.
                                    </div>
                                    <div className={this.state.cIndex === 1 ? 'tab-pane fade in active':'tab-pane fade in'}>
                                        Paper is good substrate choice for optical applicatiosn. The ITO layer has thickness of 200nm. The glass is soda-lime glass with thickness of 0.7nm. The whole substrate is 4" in diameter.
                                    </div>
                                    <div className={this.state.cIndex === 2 ? 'tab-pane fade in active':'tab-pane fade in'}>
                                        PCB has thickness of 200 nm, which enables multiple layers of patterns. The whole substrate is 4" in diameter.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="shop-right-content">
                        <div className="div-filename">{'File to be fabricated: '}<b>{this.state.fileName}</b></div>
                        <div className="div-quantity">
                            <label>Quantity:</label>
                            <input type="text" className="input-quantity" value={this.state.quantity} onChange={v => this.handleChange('quantity', v.target.value)}/> X $1000 = <span>${this.state.quantity * 1000}</span>
                            <p className="tax-info">Excludes sales taxes</p>
                            <p className="cart-btn">
                                <input type="button" className="btn btn-primary btn-lg btn-block" value="Add to cart" onClick={e => this.addVariantToCart(variantId, this.state.quantity)}/>
                            </p>
                        </div>
                        <div className="shop-config">
                            <h2>EWOD chip configuration</h2>
                            <p className="config-items">
                                <input type="checkbox" onChange={v => this.handleChange('wcpb', v.target.value)}/>
                                <span style={{paddingLeft:'10px'}}>With Cover plate assembled</span>
                            </p>
                        </div>
                    </div>
                </div>

                <Cart history={this.props.history} 
                    checkout={this.state.checkout}
                    isCartOpen={this.state.isCartOpen}
                    handleCartClose={this.handleCartClose}
                    updateQuantityInCart={this.updateQuantityInCart}
                    removeLineItemInCart={this.removeLineItemInCart}
                />
                <div className="hr-div-login"></div>
            </div>
        )
    }
}

export default Shop;