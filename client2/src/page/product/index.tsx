import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import './product.css';
import Cookies from 'js-cookie';
import {
  univEwodChipId,
  univEwodChipId5,
  univEwodChipId10,
  univEwodChipWithCoverPlate,
  univEwodChipWithoutCoverPlate,
  controlSysId5,
  testBoardId5,
  pcbChipId5,
  controlSysId10,
  testBoardId10,
  pcbChipId10,
  productIdsJson,
  getProductType
} from '../../constants';
import {
  getCustomerCart,
  manipulateCustomerOrders,
  addOrderProductToCart, returnOneItem,
  getProductOrders
} from '../../api/serverConfig';
import API from '../../api/api';
import { Shopify } from '../../App';
import CartContext from '../../context/CartContext';
import hoistNonReactpublics from 'hoist-non-react-statics';

class Product extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchedProduct: false,
      product: undefined,
      orderInfoId: undefined,
      shopifyClientCheckoutId: undefined,
      quantity: 1,
      bundleSize: '1',
      otherDetails: {},
    };
    this.handleGetCart = this.handleGetCart.bind(this);
    this.addItemToCart = this.addItemToCart.bind(this);
    this.handleOptionsChange = this.handleOptionsChange.bind(this);
  }

  fetchProductData(shopifyProductId) {
    const url = `${returnOneItem}?productId=${shopifyProductId}`;
    API.Request(url, 'GET', {}, false)
      .then((res) => {
        // console.log(res);
        this.setState({
          product: res.data,
          fetchedProduct: true,
          addedToCart: true,
        });
        if (shopifyProductId === univEwodChipId) {
          this.setState({
            otherDetails: {
              withCoverPlateAssembled: false,
            },
          });
        }
        if (shopifyProductId === univEwodChipId5) {
          this.setState({
            otherDetails: {
              withCoverPlateAssembled: false,
            },
            bundleSize: "5",
          });
        }
        if (shopifyProductId === univEwodChipId10) {
          this.setState({
            otherDetails: {
              withCoverPlateAssembled: false,
            },
            bundleSize: "10",
          });
        }

        if (shopifyProductId === controlSysId5 || shopifyProductId === testBoardId5 || shopifyProductId === pcbChipId5) {
          this.setState({
            bundleSize: "5",
          });
        }

        if (shopifyProductId === controlSysId10 || shopifyProductId === testBoardId10 || shopifyProductId === pcbChipId10) {
          this.setState({
            bundleSize: "10",
          });
        }
      }).catch((err) => {
        console.error(err);
        // redirect to all items page if product ID is invalid
        this.props.history.push('/allItems');
      });
  }

  componentDidUpdate(oldProps) {
    if (this.props.location.search !== oldProps.location.search) {
      this.fetchProductData(this.props.location.search.slice(4));
    }
  }

  componentDidMount() {
    if (this.props.location.search === '') {
      this.props.history.push('/allItems'); // redirect if no ID provided
      return;
    } else {
      this.fetchProductData(this.props.location.search.slice(4));
    }
  }

  handleChange(key, value) {
    this.setState(
      {
        [key]: value,
      },
    );
    if (key === 'bundleSize') {
      let productType = getProductType(this.state.product.id);
      this.fetchProductData(productIdsJson[productType][value]);
    }
    // console.log(this.state)
  }


  handleOptionsChange(key, value) {
    const newData = {
      [key]: value,
    };
    this.setState({
      otherDetails: Object.assign({}, this.state.otherDetails, newData),
    });
  }

  handleGetCart() {
    /**
         * Do not allow if not logged in or nonpositive quantity to add.
         *
         * Retrieve customer's cart, or create one if not already present
         * Then, create Shopify checkout
         * Then, call addItemToCart() with orderInfo ID (our own cart id) and
         *      Shopify checkout ID
         */
    const _this = this;
    if (Cookies.get('access_token') === undefined) {
      alert('Login required to add item to cart');
      return;
    }
    if (parseInt(this.state.quantity) <= 0) {
      alert('Error: Quantity must be a positive number');
    } else {
      _this.setState({
        addedToCart: false,
      });
      let url = getCustomerCart.replace('id', Cookies.get('userId'));
      API.Request(url, 'GET', {}, true)
        .then((res) => {
          if (res.data.id) {
            // console.log(`Have cart already with ID ${res.data.id}`); console.log(res);
            _this.setState({
              orderInfoId: res.data.id,
              shopifyClientCheckoutId: res.data.checkoutIdClient,
            });
            _this.addItemToCart(res.data.id,
              res.data.checkoutIdClient,
              parseInt(this.state.quantity));
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
                    // console.log(shopifyCheckoutToken);
                    const data = {
                      checkoutIdClient: res.id,
                      checkoutToken: shopifyCheckoutToken,
                      checkoutLink: res.webUrl,
                      createdAt: res.createdAt,
                      lastModifiedAt: res.updatedAt,
                      orderComplete: false,
                      status: 'Order in progress',
                      // "customerId": Cookies.get('userId'),
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
                        _this.addItemToCart(res.data.id,
                          res.data.checkoutIdClient,
                          parseInt(this.state.quantity));
                      })
                      .catch((err) => {
                        _this.setState({
                          addedToCart: true,
                        });
                        console.error(err);
                      });
                  })
                  .catch((err) => {
                    _this.setState({
                      addedToCart: true,
                    });
                    console.error(err);
                  });
              })
              .catch((err) => {
                _this.setState({
                  addedToCart: true,
                });
                console.error(err);
              });
          }
        })
        .catch((err) => {
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
    const _this = this;
    const customShopifyAttributes = [];
    let customServerOrderAttributes = '';
    for (const [k, v] of Object.entries(_this.state.otherDetails).sort((a, b) => a[0].localeCompare(b[0]))) {
      if (v !== undefined) {
        customShopifyAttributes.push({ key: k, value: v });
        customServerOrderAttributes += `${k}: ${v}\n`;
      }
    }

    const variantId = _this.state.product.id !== productIdsJson['UNIVEWODCHIPID'][_this.state.bundleSize]
      ? _this.state.product.variants[0].id
      : (_this.state.otherDetails.withCoverPlateAssembled
        ? productIdsJson['UNIVEWODCHIPWITHCOVERPLATE'][_this.state.bundleSize]
        : productIdsJson['UNIVEWODCHIPWITHOUTCOVERPLATE'][_this.state.bundleSize]);
    // console.log(variantId);
    const lineItemsToAdd = [{
      variantId,
      quantity,
    }];
    Shopify.getInstance().getPrivateValue()
      .then((instance) => {
        instance.checkout.addLineItems(shopifyClientCheckoutId, lineItemsToAdd)
          .then((res) => {
            let lineItemId;
            // console.log(res);
            for (let i = 0; i < res.lineItems.length; i++) {
              if (Buffer.from(res.lineItems[i].variant.id).toString('base64') === variantId) {
                lineItemId = Buffer.from(res.lineItems[i].id).toString('base64');
                break;
              }
            }

            const data = {
              orderInfoId,
              productIdShopify: _this.state.product.id,
              variantIdShopify: variantId,
              lineItemIdShopify: lineItemId,
              description: _this.state.product.description,
              quantity,
              price: parseFloat(_this.state.product.variants[0].price),
              name: _this.state.product.title,
              otherDetails: customServerOrderAttributes,
            };
            // console.log(data);
            let url = addOrderProductToCart.replace('id', orderInfoId);
            API.Request(url, 'POST', data, true)
              .then((res) => {
                url = getProductOrders.replace('id', orderInfoId);
                API.Request(url, 'GET', {}, true)
                  .then((res) => {
                    // console.log(res);
                    const quantity = res.data.reduce((prev, curr) => prev + curr.quantity, 0);
                    this.context.setProductQuantity(quantity);
                    this.context.setCartQuantity();
                    this.props.history.push('/manage/cart');
                  })
                  .catch((err) => {
                    console.error(err);
                  });
                _this.setState({
                  addedToCart: true,
                });
              })
              .catch((err) => {
                console.error(err);
                _this.setState({
                  addedToCart: true,
                });
              });
          })
          .catch((err) => {
            console.error(err);
            _this.setState({
              addedToCart: true,
            });
          });
      })
      .catch((err) => {
        console.error(err);
        _this.setState({
          addedToCart: true,
        });
      });
  }

  render() {
    const { product } = this.state;
    const desiredProductId = this.props.location.search.slice(4); // get id after id?=
    return (
      <div className="order-container">
        <div className="shop-main-content">
          {this.state.fetchedProduct
            ? (
              <div>
                <div className="shop-left-content">
                  <div className="div-img">
                    <img src={product.variants[0].image.src} />
                  </div>
                </div>
                <div className="shop-right-content">
                  <div className="shop-right-top-content">
                    <NavLink to="/allItems">{'<< Return to all products'}</NavLink>
                    <div><h2>{product.title}</h2></div>
                    <div
                      className="product-description"
                      dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                    />
                  </div>
                  <div className="shop-right-bottom-content">
                    <div>
                      {(desiredProductId === univEwodChipId || desiredProductId === univEwodChipId5 || desiredProductId === univEwodChipId10)
                        ? (
                          <div className="chip-config">
                            <h3>Item Options</h3>
                            <div className="config-items">
                              <input type="checkbox" checked={JSON.stringify(this.state.otherDetails) === '{"withCoverPlateAssembled":true}'} onChange={(v) => this.handleOptionsChange('withCoverPlateAssembled', v.target.checked)} />
                              <span className="option-detail">With Cover Plate Assembled</span>
                            </div>
                          </div>
                        )
                        : null}

                      <div className="div-price-quantity">
                        <div className="div-product-price">
                          Price: $
                          {product.variants[0].price}
                        </div>
                        <div className="div-product-selection">
                          <div className="div-product-quantity">
                            Quantity:&nbsp;
                            <input
                              type="number"
                              className="input-quantity"
                              value={this.state.quantity}
                              onChange={(v) => this.handleChange('quantity', v.target.value)}
                            />
                          </div>
                          <div className="div-product-bundlesize">
                            Bundle Size:&nbsp;
                            <select id="bundlesize" name="bundlesize" value={this.state.bundleSize} onChange={(v) => this.handleChange('bundleSize', v.target.value)}>
                              <option value="1">1</option>
                              <option value="5">5</option>
                              <option value="10">10</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div>
                        {this.state.addedToCart
                          ? (
                            <div className="cart-btn">
                              <input
                                type="button"
                                value="Add to Cart"
                                className="btn btn-primary btn-lg btn-block"
                                onClick={(e) => this.handleGetCart()}
                              />
                            </div>
                          )
                          : <img className="loading-GIF" src="/img/loading80px.gif" alt="" />}
                        <div className="tax-info">Note: Price excludes sales tax</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
            : <img className="loading-GIF" src="/img/loading80px.gif" alt="" />}
        </div>
      </div>
    );
  }
}

// Product = withRouter(Product);
Product.contextType = CartContext;
export default hoistNonReactpublics(Product, withRouter(Product));