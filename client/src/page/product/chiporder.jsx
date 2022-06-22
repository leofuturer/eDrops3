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
import './chiporder.css';
import Cookies from 'js-cookie';
import {
  getCustomerCart, manipulateCustomerOrders, addOrderChipToCart,
  getChipOrders, getWorkerId
} from '../../api/serverConfig';
import API from '../../api/api';
import {
  ewodFabServiceId,
  ewodFabServiceVariantId,
} from '../../constants';
import Shopify from '../../app.jsx';
import loadingGif from '../../../static/img/loading80px.gif';
import DXFPreview from './dxf_preview.jsx';
import CartContext from '../../context/CartContext'


class ChipOrder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cIndex: 0,
      material: ['ITO Glass', 'Paper', 'PCB'],
      materialVal: 'ITO Glass',
      quantity: 1,
      wcpb: false,
      fileInfo: this.props.location.state.fileInfo,
      isLoading: false,
      GLASSID: 0,
      PAPERID: 0,
      PCBID: 0,
    };
    this.shopifyClient = null;
    this.setCurrentIndex = this.setCurrentIndex.bind(this);
    this.addVariantToCart = this.addVariantToCart.bind(this);
  }

  componentDidMount() {
    // usernames of default foundry workers
    const GLASSFW = "glassfab";
    const PAPERFW = "paperfab";
    const PCBFW = "pcbfab";
    // fetch IDs of default foundry workers
    API.Request(getWorkerId, 'POST', { username: GLASSFW }, true)
      .then((res) => {
        this.setState({
          GLASSID: res.data.workerId,
        });
      })
      .catch((err) => {
        console.log(err);
      });
    API.Request(getWorkerId, 'POST', { username: PAPERFW }, true)
      .then((res) => {
        this.setState({
          PAPERID: res.data.workerId,
        });
      })
      .catch((err) => {
        console.log(err);
      });
    API.Request(getWorkerId, 'POST', { username: PCBFW }, true)
      .then((res) => {
        this.setState({
          PCBID: res.data.workerId,
        });
      })
      .catch((err) => {
        console.log(err);
      });

    if (Cookies.get('access_token') === undefined) {
      alert('Login required for this page');
      this.props.history.push('/login');
    } else if (this.props.location.state === undefined) {
      alert('Please pick a file for fabrication');
      this.props.history.push('/manage/files');
    } else {
      const _this = this;
      // TODO: instead of building client, use Shopify.getInstance().getPrivateValue()
      let url = getCustomerCart.replace('id', Cookies.get('userId'));
      _this.setState({
        fileInfo: this.props.location.state.fileInfo,
      });
      Shopify.getInstance().getPrivateValue()
        .then((instance) => {
          instance.product.fetch(ewodFabServiceId) // hard coded for chip order
            .then((product) => {
              _this.setState({
                // eslint-disable-next-line object-shorthand
                product: product,
              });
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((err) => {
          console.error(err);
          // redirect to all items page if product ID is invalid
          this.props.history.push('/allItems');
        });
      API.Request(url, 'GET', {}, true)
        .then((res) => {
          if (res.data.id) {
            // console.log(`Have cart already with ID ${res.data.id}`);
            _this.setState({
              orderInfoId: res.data.id,
              shopifyClientCheckoutId: res.data.checkoutIdClient,
            });
          } else { // no cart, need to create one
            // create Shopify cart
            // console.log(`No cart currently exists, so need to create one`);
            Shopify.getInstance().getPrivateValue()
              .then((instance) => {
                instance.checkout.create()
                  .then((res) => {
                    // console.log(res);
                    _this.setState({
                      shopifyClientCheckoutId: res.id,
                    });
                    const lastSlash = res.webUrl.lastIndexOf('/');
                    const lastQuestionMark = res.webUrl.lastIndexOf('?');
                    const shopifyCheckoutToken = res.webUrl.slice(lastSlash + 1, lastQuestionMark);
                    const data = {
                      checkoutIdClient: res.id,
                      checkoutToken: shopifyCheckoutToken,
                      checkoutLink: res.webUrl,
                      createdAt: res.createdAt,
                      lastModifiedAt: res.updatedAt,
                      orderComplete: false,
                      status: 'Order in progress',
                      shippingAddressId: 0, // 0 to indicate no address selected yet (pk cannot be 0)
                      billingAddressId: 0,
                    };
                    // and then create orderInfo in our backend
                    url = manipulateCustomerOrders.replace('id', Cookies.get('userId'));
                    API.Request(url, 'POST', data, true)
                      .then((res) => {
                        // console.log(res);
                        _this.setState({
                          orderInfoId: res.data.id,
                        });
                      })
                      .catch((err) => {
                        console.error(err);
                      });
                  })
                  .catch((err) => {
                    console.error(err);
                  });
              })
              .catch((err) => {
                console.error(err);
              });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  handleChange(key, value) {
    this.setState(
      {
        [key]: value,
      },
    );
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
  addVariantToCart(variantId, quantity) {
    this.setState({
      isLoading: true,
    });
    if (quantity < 1) {
      alert('Quantity must be at least 1');
      this.setState({
        isLoading: false,
      });
    } else {
      const _this = this;
      const wcpbVal = _this.state.wcpb.toString();
      const lineItemsToAdd = [{
        variantId,
        quantity: parseInt(quantity, 10),
        customAttributes: [
          {
            key: 'material',
            value: _this.state.materialVal,
          },
          {
            key: 'withCoverPlateAssembled',
            value: wcpbVal,
          },
          {
            key: 'fileName',
            value: _this.state.fileInfo.fileName,
          },
        ],
      }];
      let customServerOrderAttributes = '';
      customServerOrderAttributes += `material: ${_this.state.materialVal}\n`;
      customServerOrderAttributes += `withCoverPlateAssembled: ${wcpbVal}\n`;
      customServerOrderAttributes += `fileName: ${_this.state.fileInfo.fileName}\n`;
      const checkoutId = _this.state.shopifyClientCheckoutId;
      Shopify.getInstance().getPrivateValue()
        .then((instance) => {
          instance.checkout.addLineItems(checkoutId, lineItemsToAdd)
            .then((res) => {
              let lineItemId;
              for (let i = 0; i < res.lineItems.length; i++) {
                if (res.lineItems[i].variant.id === variantId) {
                  lineItemId = res.lineItems[i].id;
                  break;
                }
              }
              // select default foundry worker based on material
              let materialSpecificWorkerId = 0;
              switch(this.state.materialVal) {
                case "ITO Glass":
                  materialSpecificWorkerId = this.state.GLASSID;
                  break;
                case "Paper":
                  materialSpecificWorkerId = this.state.PAPERID;
                  break;
                case "PCB":
                  materialSpecificWorkerId = this.state.PCBID;
                  break;
                default:
              }

              // create our own chip order here...
              const data = {
                orderInfoId: _this.state.orderInfoId,
                productIdShopify: ewodFabServiceId,
                variantIdShopify: variantId,
                lineItemIdShopify: lineItemId,
                name: _this.state.product.title,
                description: _this.state.product.description,
                quantity,
                price: parseFloat(_this.state.product.variants[0].price),
                otherDetails: customServerOrderAttributes,
                process: this.state.materialVal,
                coverPlate: wcpbVal,
                lastUpdated: Date.now(),
                fileInfoId: this.state.fileInfo.id,
                workerId: materialSpecificWorkerId,
              };
              // console.log(res);
              let url = addOrderChipToCart.replace('id', _this.state.orderInfoId);
              API.Request(url, 'POST', data, true)
                .then((res) => {
                  url = getChipOrders.replace('id', _this.state.orderInfoId);
                  API.Request(url, 'GET', {}, true)
                    .then((res) => {
                      const quantity = res.data.reduce((prev, curr) => prev + curr.quantity, 0);
                      this.context.setChipQuantity(quantity);
                      this.context.setCartQuantity();
                      this.props.history.push('/manage/cart');
                    })
                    .catch((err) => {
                      console.error(err);
                    });
                  this.setState({
                    isLoading: false,
                  });
                })
                .catch((err) => {
                  console.error(err);
                  this.setState({
                    isLoading: false,
                  });
                });
            })
            .catch((err) => {
              console.error(err);
              this.setState({
                isLoading: false,
              });
            });
        })
        .catch((err) => {
          console.error(err);
          this.setState({
            isLoading: false,
          });
        });
    }
  }

  setCurrentIndex(event) {
    this.setState({
      cIndex: parseInt(event.currentTarget.getAttribute('index'), 10),
    });
    this.state.materialVal = this.state.material[event.currentTarget.getAttribute('index')];
  }

  render() {
    const tabShow = [];
    const variantId = ewodFabServiceVariantId;
    for (let i = 0; i < this.state.material.length; i++) {
      tabShow.push(
        <li
          key={i}
          className={this.state.cIndex === i ? 'active' : ''}
          index={i}
          onClick={this.setCurrentIndex}
        >
          <a data-toggle="tab">
            {this.state.material[i]}
          </a>
        </li>,
      );
    }

    return (
      <div className="order-container">
        <div className="shop-main-content">
          <div className="shop-left-content">
            {/* DY - replace temporary image above with a preview of the uploaded PDF */}
            <div className="div-img">
              <DXFPreview fileInfo={this.props.location.state.fileInfo} />
            </div>
            <div className="preview-disclaimer">
              Disclaimer: The image above is only intended as a preview and is not guaranteed to be entirely accurate.
              The original DXF file will be transmitted to the foundry.
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
                  <div className={this.state.cIndex === 0 ? 'tab-pane fade in active' : 'tab-pane fade in'}>
                    ITO glass is good substrate choice for optical applications. The ITO layer has
                    thickness of 200 nm. The glass is soda-lime glass with thickness of 0.7 nm. The
                    whole substrate is 4 inches in diameter.
                  </div>
                  <div className={this.state.cIndex === 1 ? 'tab-pane fade in active' : 'tab-pane fade in'}>
                    Paper is good substrate choice for optical applications. The ITO layer has a
                    thickness of 200 nm. The glass is soda-lime glass with thickness of 0.7 nm. The
                    whole substrate is 4 inches in diameter.
                  </div>
                  <div className={this.state.cIndex === 2 ? 'tab-pane fade in active' : 'tab-pane fade in'}>
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
                <input type="checkbox" onChange={(v) => this.handleChange('wcpb', v.target.checked)} />
                <span style={{ paddingLeft: '10px' }}>With Cover Plate Assembled</span>
              </p>
            </div>
            <div className="div-shop-quantity">
              <label>Quantity:&nbsp;</label>
              { this.state.product !== undefined
                ? (
                  <div>
                    <input
                      type="number"
                      className="input-quantity"
                      value={this.state.quantity}
                      onChange={(v) => this.handleChange('quantity', parseInt(v.target.value))}
                    />
                    {' '}
                    X $
                    {this.state.product.variants[0].price}
                    {' '}
                    =
                    <span>
                      {' '}
                      $
                      {(this.state.quantity * this.state.product.variants[0].price).toFixed(2)}
                    </span>
                  </div>
                )
                : null}
              <p className="cart-btn">
                {
                                    this.state.isLoading
                                      ? <img src={loadingGif} alt="" className="loading-icon" />
                                      : (
                                        <input
                                          type="button"
                                          className="btn btn-primary btn-lg btn-block"
                                          value="Add to Cart"
                                          onClick={(e) => this.addVariantToCart(variantId, this.state.quantity)}
                                        />
                                      )
                                }
              </p>
            </div>
            <div className="tax-info">Note: Price excludes sales tax</div>
          </div>
        </div>
        <div className="hr-div-login" />
      </div>
    );
  }
}

ChipOrder.contextType = CartContext;
export default ChipOrder;
