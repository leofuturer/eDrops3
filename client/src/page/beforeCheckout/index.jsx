import React from 'react';
import { customerGetProfile, customerAddresses  } from "../../api/serverConfig";
import API from "../../api/api";
import Cookies from 'js-cookie';
import SingleAddress from './singleAddress.jsx';
import { withRouter } from 'react-router';
import "./beforeCheckout.css";
import Shopify from '../../app.jsx';

class BeforeCheckout extends React.Component  {
    constructor(props) {
        super(props);
        this.state = {
            shopifyCheckoutLink: undefined,
            cartId: undefined,
            shopifyCheckoutId: undefined,
            addressList: [],
            selectedAddrIndex: 0,
            doneLoading: false,
        };
        this.handleReturnToCart = this.handleReturnToCart.bind(this);
        this.handleSelectAddress = this.handleSelectAddress.bind(this);
        this.handlePayment = this.handlePayment.bind(this);
    }

    componentDidMount(){
        let _this = this;
        if(Cookies.get('access_token') === undefined){
            _this.props.history.push('/login');
            return;
        }
        else if(_this.props.location.state.shopifyCheckoutLink === undefined
                || _this.props.location.state.cartId === undefined){
            console.log("check..");
            _this.props.history.push('/manage/cart');
            return;
        }
        else{
            _this.setState({
                shopifyCheckoutLink: _this.props.location.state.shopifyCheckoutLink,
                cartId: _this.props.location.state.cartId,
                shopifyCheckoutId: _this.props.location.state.shopifyCheckoutId,
            });
            let url = customerGetProfile.replace('id', Cookies.get('userId'));
            API.Request(url, 'GET', {}, true)
            .then((res) => {
                // console.log(res.data);
                this.setState({
                    customer: res.data,
                });
                url = customerAddresses.replace('id', Cookies.get('userId'));
                API.Request(url, 'GET', {}, true)
                .then((res) => {
                    // console.log(res.data);
                    _this.setState({
                        addressList: res.data,
                        selectedAddrIndex: 0,
                        doneLoading: true,
                    });
                })
                .catch((err) => {
                    console.error(err);
                    _this.setState({
                        doneLoading: true,
                    });
                });
            })
            .catch((err) => {
                console.error(err);
                _this.setState({
                    doneLoading: true,
                });
            });
        }
    }

    handleSelectAddress(index) {
        this.setState({
            selectedAddrIndex: index,
        });
    }

    handleReturnToCart(){
        this.props.history.push('/manage/cart');
    }

    handlePayment(){
        let _this = this;
        const shopifyClient = Shopify.getInstance("","");
        _this.setState({
            preparingForCheckout: true,
        });
        shopifyClient.checkout.updateEmail(this.state.shopifyCheckoutId, this.state.customer.email)
        .then((res) => {
            let address = _this.state.addressList[_this.state.selectedAddrIndex];
            let shippingAddr = {
                address1: address.street,
                address2: address.streetLine2,
                city: address.city,
                province: address.state,
                country: address.country,
                zip: address.zipCode,
                firstName: _this.state.customer.firstName,
                lastName: _this.state.customer.lastName,
                phone: _this.state.customer.phoneNumber,
            }
            shopifyClient.checkout.updateShippingAddress(this.state.shopifyCheckoutId, shippingAddr)
            .then((res) => {
                // console.log(res);
                
                window.location.replace(`${this.state.shopifyCheckoutLink}`);
            })
            .catch((err) =>{
                _this.setState({
                    preparingForCheckout: false,
                });
                console.error(err);
            });
        })
        .catch((err) => {
            _this.setState({
                preparingForCheckout: false,
            });
            console.error(err);
        });
    }

    render() {
        // console.log(this.props.location)
        return(     
            <div>
                <div className="before-checkout-background">
                    <h3 className="title">Select Shipping Address</h3>
                    <div className="border-h3"></div>
                    <div className="help-text">
                        {/* Please select the shipping address to ship your order to. */}
                    </div>
                    { this.state.doneLoading
                    ? <div>
                        <div id="address-list">
                        {
                            this.state.addressList !== undefined && this.state.addressList.map((oneAddress, index) => 
                                <SingleAddress key={index} 
                                    selected={index===this.state.selectedAddrIndex ? "selected-address" : ""}
                                    addressTem={oneAddress} 
                                    addressNum={index+1} 
                                    onClick={() => this.handleSelectAddress(index)}
                                />
                            )
                        }
                        </div>
                        { this.state.preparingForCheckout
                        ? <img className="loading-GIF-checkout-button" src="../../../static/img/loading-sm.gif" alt=""/>
                        : <div className="checkout-button">
                            <input type="button" className="btn btn-primary btn-padding"
                                value="Return to Cart" onClick={() => this.handleReturnToCart()}>
                            </input>

                            <input type="button" className="btn btn-primary btn-padding"
                                value="Proceed to Payment" onClick={() => this.handlePayment()}>
                            </input>                  
                        </div>   
                        }
                    </div>
                    : <img className="loading-GIF" src="../../../static/img/loading80px.gif" alt=""/>
                    }    
                </div>
            </div>
        );
    }
};


BeforeCheckout = withRouter(BeforeCheckout);
export default BeforeCheckout;
