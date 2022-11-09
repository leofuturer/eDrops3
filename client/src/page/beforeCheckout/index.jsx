import React from 'react';
import Cookies from 'js-cookie';
import { withRouter } from 'react-router-dom';
import { customerGetProfile, customerAddresses, modifyChipOrders } from '../../api/serverConfig';
import API from '../../api/api';
import SingleAddress from './singleAddress.jsx';
import './beforeCheckout.css';
import AddNewAddress from '../address/addNewAddress.jsx';
import Shopify from '../../app.jsx';
import loading_sm from '../../../static/img/loading-sm.gif';
import loadingGif from '../../../static/img/loading80px.gif';

class BeforeCheckout extends React.Component {
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

  componentDidMount() {
    const _this = this;
    if (Cookies.get('access_token') === undefined) {
      _this.props.history.push('/login');
    } else if (_this.props.location.state.shopifyCheckoutLink === undefined
                || _this.props.location.state.cartId === undefined) {
      // console.log("check..");
      _this.props.history.push('/manage/cart');
    } else {
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

  handleReturnToCart() {
    this.props.history.push('/manage/cart');
  }

  handlePayment() {
    const _this = this;
    _this.setState({
      preparingForCheckout: true,
    });
    Shopify.getInstance().getPrivateValue()
      .then((instance) => {
        instance.checkout.updateEmail(this.state.shopifyCheckoutId, this.state.customer.email)
          .then((res) => {
            const address = _this.state.addressList[_this.state.selectedAddrIndex];
            const shippingAddr = {
              address1: address.street,
              address2: address.streetLine2,
              city: address.city,
              province: address.state,
              country: address.country,
              zip: address.zipCode,
              firstName: _this.state.customer.firstName,
              lastName: _this.state.customer.lastName,
              phone: _this.state.customer.phoneNumber,
            };
            Shopify.getInstance().getPrivateValue()
              .then((instance) => {
                instance.checkout.updateShippingAddress(this.state.shopifyCheckoutId, shippingAddr)
                  .then((res) => {
                    console.log(res);

                    window.location.replace(`/`);
                    window.open(`${this.state.shopifyCheckoutLink}`, '_blank');
                  })
                  .catch((err) => {
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
          })
          .catch((err) => {
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
    // this.state.isModalOpen;
    // console.log(this.props.location)
    return (
      <div>
        <div className="before-checkout-background">
          <h3 className="title">Select Shipping Address</h3>
          <div className="border-h3" />
          <div className="help-text">
            {/* Please select the shipping address to ship your order to. */}
          </div>
          { this.state.doneLoading
            ? (
              <div>
                <div id="address-list">
                  {
                            this.state.addressList !== undefined && this.state.addressList.map((oneAddress, index) => (
                              <SingleAddress
                                key={index}
                                selected={index === this.state.selectedAddrIndex ? 'selected-address' : ''}
                                addressTem={oneAddress}
                                addressNum={index + 1}
                                onClick={() => this.handleSelectAddress(index)}
                              />
                            ))
                        }
                  <div>
                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                      <div className="card-view" style={{ minHeight: '200px' }}>
                        <div className="row" style={{ paddingTop: '70px', paddingLeft: '165px' }}>
                          <div className="col-md-4 col-sm-4 col-xs-4">
                            <button id="addnew" className="btn btn-success" data-toggle="modal" data-target="#formModal">
                              <i>+</i>
                              <span className="btn-txt-padding">Add New</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal fade" id="formModal" tabIndex="-1" role="dialog" aria-labelledby="formModalLabel">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          <AddNewAddress />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                { this.state.preparingForCheckout
                  ? <img className="loading-GIF-checkout-button" src={loading_sm} alt="" />
                  : (
                    <div className="checkout-button">
                      <input
                        type="button"
                        className="btn btn-primary btn-padding"
                        value="Return to Cart"
                        onClick={() => this.handleReturnToCart()}
                      />

                      <input
                        type="button"
                        className="btn btn-primary btn-padding"
                        value="Proceed to Payment"
                        onClick={() => this.handlePayment()}
                      />
                    </div>
                  )}
              </div>
            )
            : <img className="loading-GIF" src={loadingGif} alt="" />}
        </div>
      </div>
    );
  }
}

BeforeCheckout = withRouter(BeforeCheckout);
export default BeforeCheckout;
