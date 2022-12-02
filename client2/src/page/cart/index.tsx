import React from 'react';
import { NavLink } from 'react-router-dom';
import CartItem from './cartItem.js';
import { Shopify } from '../../App';
import API from '../../api/api';
import {
  getCustomerCart, getProductOrders,
  getChipOrders, modifyProductOrders,
  modifyChipOrders, updateProductOrderLineItem,
  updateChipOrderLineItem,
} from '../../api/serverConfig';
import Cookies from 'js-cookie';

import { metadata } from './metadata.js';
import SEO from '../../component/header/seo.js';

import CartContext from '../../context/CartContext';

class Cart extends React.Component {
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
      deleteLoading: false,
      numModifiedItems: 0,
      totalModifiedItems: 0,
    };
    this.handleQtyChange = this.handleQtyChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCheckout = this.handleCheckout.bind(this);
  }

  componentDidMount() {
    const _this = this;
    let url = getCustomerCart.replace('id', Cookies.get('userId'));
    API.Request(url, 'GET', {}, true)
      .then((res) => {
        if (res.data.id) {
          // console.log(res);
          const orderInfoId = res.data.id;
          _this.setState({
            cartExists: true,
            cartId: res.data.id,
            shopifyCheckoutId: res.data.checkoutIdClient,
            shopifyCheckoutLink: res.data.checkoutLink,
          });

          url = getProductOrders.replace('id', orderInfoId);
          API.Request(url, 'GET', {}, true)
            .then((res) => {
              _this.setState({
                productOrders: res.data,
              });
              url = getChipOrders.replace('id', orderInfoId);
              API.Request(url, 'GET', {}, true)
                .then((res) => {
                  _this.setState({
                    chipOrders: res.data,
                    cartLoading: false,
                  });
                })
                .catch((err) => {
                  console.error(err);
                });
            })
            .catch((err) => {
              console.error(err);
            });
        } else {
          _this.setState({
            cartExists: false,
            cartLoading: false,
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  handleQtyChange(e, itemType, index) {
    if (e.target.value < 1) {
      alert('Error: quantity cannot be less than 1');
      e.target.value = 1;
    } else {
      // https://stackoverflow.com/questions/29537299/react-how-to-update-state-item1-in-state-using-setstate
      if (itemType === 'product') {
        const items = [...this.state.productOrders];
        const item = Object.assign({}, items[index]); // replacement for `let item = {...items[index]};`
        item.quantity = parseInt(e.target.value);
        items[index] = item;
        this.setState({
          productOrders: items,
          modifiedItems: new Set(this.state.modifiedItems).add(item.lineItemIdShopify),
        }, () => { this.updateTotalModified(); });
      } else if (itemType === 'chip') {
        const items = [...this.state.chipOrders];
        const item = Object.assign({}, items[index]); // replacement for `let item = {...items[index]};`
        item.quantity = parseInt(e.target.value);
        items[index] = item;
        this.setState({
          chipOrders: items,
          modifiedItems: new Set(this.state.modifiedItems).add(item.lineItemIdShopify),
        }, () => { this.updateTotalModified(); });
      }
    }
  }

  updateLineItemCartHelper(instance, itemsToUpdate) {
    const _this = this;
    return new Promise((resolve, reject) => {
      instance.checkout.updateLineItems(_this.state.shopifyCheckoutId, itemsToUpdate)
        .then((checkout) => {
          return resolve(checkout);
        })
        .catch((err) => {
          console.error(err);
          return reject();
        });
    });
  }

  updateLineItemDatabaseHelper(checkoutLineItem, orderInfoId) {
    if (checkoutLineItem.title === 'EWOD Chip Fabrication Service') {
      const url = updateChipOrderLineItem.replace('id', orderInfoId);
      let otherDetails = '';
      checkoutLineItem.customAttributes.forEach((entry) => {
        otherDetails += `${entry.key}: ${entry.value}\n`;
      });
      const lineItemIdShopify = Buffer.from(checkoutLineItem.id).toString('base64');
      const variantIdShopify = Buffer.from(checkoutLineItem.variant.id).toString('base64');
      const data = {
        lineItemIdShopify: lineItemIdShopify,
        variantIdShopify: variantIdShopify,
        otherDetails: otherDetails,
        updatedAt: new Date().toISOString(),
      };
      return new Promise((resolve, reject) => {
        API.Request(url, 'PATCH', data, true)
          .then((checkout) => {
            // return resolve();
            // https://stackoverflow.com/questions/29537299/how-can-i-update-state-item1-in-state-using-setstate
            let index;
            const array = this.state.chipOrders;
            for (let i = 0; i < array.length; i += 1) {
              if (array[i].otherDetails === otherDetails && array[i].variantIdShopify === variantIdShopify) {
                index = i;
                break;
              }
            }

            this.setState(({ chipOrders }) => ({
              chipOrders: [
                ...chipOrders.slice(0, index),
                {
                  ...chipOrders[index],
                  lineItemIdShopify: lineItemIdShopify,
                },
                ...chipOrders.slice(index + 1)
              ]
            }), () => resolve());
          })
          .catch((err) => {
            console.error(err);
            this.setState({
              deleteLoading: false,
            });
            return reject();
          });
      });
    } else {
      const url = updateProductOrderLineItem.replace('id', orderInfoId);
      let otherDetails = '';
      checkoutLineItem.customAttributes.forEach((entry) => {
        otherDetails += `${entry.key}: ${entry.value}\n`;
      });
      if (checkoutLineItem.variant.title === 'Without Cover Plate Assembled')
        otherDetails += 'withCoverPlateAssembled: false\n';
      if (checkoutLineItem.variant.title === 'With Cover Plate Assembled')
        otherDetails += 'withCoverPlateAssembled: true\n';
      const lineItemIdShopify = Buffer.from(checkoutLineItem.id).toString('base64');
      const variantIdShopify = Buffer.from(checkoutLineItem.variant.id).toString('base64');
      const data = {
        lineItemIdShopify: lineItemIdShopify,
        variantIdShopify: variantIdShopify,
        otherDetails: otherDetails,
      };
      return new Promise((resolve, reject) => {
        API.Request(url, 'PATCH', data, true)
          .then((checkout) => {
            // return resolve();
            // https://stackoverflow.com/questions/29537299/how-can-i-update-state-item1-in-state-using-setstate
            let index;
            const array = this.state.productOrders;
            for (let i = 0; i < array.length; i += 1) {
              if (array[i].otherDetails === otherDetails && array[i].variantIdShopify === variantIdShopify) {
                index = i;
                break;
              }
            }

            this.setState(({ productOrders }) => ({
              productOrders: [
                ...productOrders.slice(0, index),
                {
                  ...productOrders[index],
                  lineItemIdShopify: lineItemIdShopify,
                },
                ...productOrders.slice(index + 1)
              ]
            }), () => resolve());

          })
          .catch((err) => {
            console.error(err);
            this.setState({
              deleteLoading: false,
            });
            return reject();
          });
      });
    }
  }

  handleDelete(itemType, index) {
    this.setState({
      deleteLoading: true,
    });
    const _this = this;
    let url;
    if (itemType === 'product') {
      var array = _this.state.productOrders;
    } else if (itemType === 'chip') {
      var array = _this.state.chipOrders;
    }

    // Delete from Shopify, then our own DB
    const itemToDelete = [array[index].lineItemIdShopify];
    Shopify.getInstance().getPrivateValue()
      .then((instance) => {
        instance.checkout.removeLineItems(_this.state.shopifyCheckoutId, itemToDelete)
          .then((checkout) => {
            // console.log(checkout);
            if (itemType === 'product') {
              url = modifyProductOrders.replace('id', array[index].id);
            } else if (itemType === 'chip') {
              url = modifyChipOrders.replace('id', array[index].id);
            }
            API.Request(url, 'DELETE', {}, true)
              .then((res) => {
                let result = checkout.lineItems.reduce((p, nextItem) => {
                  return this.updateLineItemDatabaseHelper(nextItem, array[index].orderInfoId);
                }, Promise.resolve());

                result.then(e => {
                  if (itemType === 'product') {
                    const products = this.state.productOrders.filter((item) => item.id !== array[index].id);
                    this.setState({ productOrders: products });
                  } else if (itemType === 'chip') {
                    const chips = this.state.chipOrders.filter((item) => item.id !== array[index].id);
                    this.setState({ chipOrders: chips });
                  }

                  if (itemType === 'product') {
                    const quantity = this.state.productOrders.reduce((prev, curr) => prev + curr.quantity, 0);
                    this.context.setProductQuantity(quantity);
                  } else if (itemType === 'chip') {
                    const quantity = this.state.chipOrders.reduce((prev, curr) => prev + curr.quantity, 0);
                    this.context.setChipQuantity(quantity);
                  }

                  this.context.setCartQuantity();

                  this.setState({
                    deleteLoading: false,
                  });
                });
              })
              .catch((err) => {
                console.error(err);
                this.setState({
                  deleteLoading: false,
                });
              });
          })
          .catch((err) => {
            console.error(err);
            this.setState({
              deleteLoading: false,
            });
          });
      })
      .catch((err) => {
        console.error(err);
        this.setState({
          deleteLoading: false,
        });
      });
  }

  updateLineItemCartHelper(instance, type, item, itemsToUpdate) {
    const _this = this;
    return new Promise((resolve, reject) => {
      instance.checkout.updateLineItems(_this.state.shopifyCheckoutId, itemsToUpdate)
        .then((checkout) => {
          let url;
          // console.log(checkout.lineItems);
          if (type === 'product') {
            url = modifyProductOrders.replace('id', item.id);
          } else if (type === 'chip') {
            url = modifyChipOrders.replace('id', item.id);
          }
          const data = { quantity: parseInt(item.quantity) };
          API.Request(url, 'PATCH', data, true)
            .then((res) => {
              this.setState((state) => ({ numModifiedItems: state.numModifiedItems + 1 }));
              if (_this.state.numModifiedItems === _this.state.totalModifiedItems && _this.state.numModifiedItems > 0) {
                this.setCartItems();    // updates number on cart icon

                this.setState({
                  saveInProgress: false,
                });
              }

              return resolve();

            })
            .catch((err) => {
              console.error(err);
              this.setState({
                saveInProgress: false,
              });
            });
        })
        .catch((err) => {
          console.error(err);
          this.setState({
            saveInProgress: false,
          });
          return reject();
        });
    });
  }

  handleSaveForOrders(instance, array, type) {
    const _this = this;
    return array.filter(item => (_this.state.modifiedItems.has(item.lineItemIdShopify)))
      .reduce((p, nextItem) => {

        const itemsToUpdate = [{
          id: nextItem.lineItemIdShopify,
          quantity: parseInt(nextItem.quantity),
        }];

        return p.then(() => {
          return this.updateLineItemCartHelper(instance, type, nextItem, itemsToUpdate);
        });

      }, Promise.resolve());
  }

  handleSave() {
    const _this = this;
    if (_this.state.modifiedItems.size > 0) {
      this.setState({
        saveInProgress: true,
      });
      Shopify.getInstance().getPrivateValue()
        .then((instance) => {
          const result = _this.handleSaveForOrders(instance, _this.state.productOrders, 'product');
          result.then(e => {
            _this.handleSaveForOrders(instance, _this.state.chipOrders, 'chip');
          });
        })
        .catch((err) => {
          console.error(err);
          this.setState({
            saveInProgress: false,
          });
        });
    }
  }

  handleCheckout() {
    this.props.history.push('/beforeCheckout', {
      shopifyCheckoutLink: this.state.shopifyCheckoutLink,
      cartId: this.state.cartId,
      shopifyCheckoutId: this.state.shopifyCheckoutId,
    });
  }

  setCartItems() {
    const _this = this;
    const orderInfoId = _this.state.cartId;
    let url = getProductOrders.replace('id', orderInfoId);
    API.Request(url, 'GET', {}, true)
      .then((res) => {
        let quantity = res.data.reduce((prev, curr) => prev + curr.quantity, 0);
        this.context.setProductQuantity(quantity);

        url = getChipOrders.replace('id', orderInfoId);
        API.Request(url, 'GET', {}, true)
          .then((res) => {
            quantity = res.data.reduce((prev, curr) => prev + curr.quantity, 0);
            this.context.setChipQuantity(quantity);

            this.context.setCartQuantity();

            this.setState({
              numModifiedItems: 0,
              modifiedItems: new Set(),
              totalModifiedItems: 0,
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

  updateTotalModified() {
    this.setState({
      totalModifiedItems: this.state.modifiedItems.size,
    });
  }

  render() {
    let totalPrice = 0;
    this.state.productOrders.forEach((product) => {
      totalPrice += (product.quantity * product.price);
    });
    this.state.chipOrders.forEach((product) => {
      totalPrice += (product.quantity * product.price);
    });

    return (
      <div>
        <SEO
          title="eDrops | Cart"
          description=""
          metadata={metadata}
        />
        {Cookies.get('userType') === 'customer'
          ? (
            <div className="flex flex-col items-center justify-center">
              <div className="w-full border-b-2 border-primary_light flex justify-center py-8">
                <h2 className="text-4xl font-medium">Cart</h2>
              </div>
              {this.state.productOrders.length + this.state.chipOrders.length > 0
                ? (
                  <div className="flex flex-col py-8 w-full space-y-4">
                    <div className="flex flex-row justify-between items-center">
                      <p className="">
                        Use the "save" button to save any
                        changes to quantities. Deletions are saved immediately.
                      </p>
                      <div className="flex flex-row space-x-4 p-2 items-center">
                        {this.state.saveInProgress
                          ? <img className="" src="/img/loading80px.gif" alt="" />
                          : (
                            <button
                              type="button"
                              className="bg-green-600 rounded-lg text-white px-4 py-2"
                              onClick={() => this.handleSave()}
                            >
                              Save
                            </button>
                          )}
                        <button
                          type="button"
                          className="bg-primary rounded-lg text-white px-4 py-2"
                          onClick={() => this.handleCheckout()}
                        >
                          Checkout
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      {
                        this.state.productOrders.map((oneProduct, index) => (
                          <CartItem
                            key={index}
                            info={oneProduct}
                            onChange={(e) => this.handleQtyChange(e, 'product', index)}
                            onDelete={() => this.handleDelete('product', index)}
                            deleteLoading={this.state.deleteLoading}
                          />
                        ))
                      }
                      {
                        this.state.chipOrders && this.state.chipOrders.map((oneProduct, index) => (
                          <CartItem
                            key={index}
                            info={oneProduct}
                            onChange={(e) => this.handleQtyChange(e, 'chip', index)}
                            onDelete={() => this.handleDelete('chip', index)}
                            deleteLoading={this.state.deleteLoading}
                          />
                        ))
                      }
                    </div>
                    <div className="flex flex-col items-end px-4">
                      <p className="">
                        Total Price: $
                        {totalPrice.toFixed(2)}
                      </p>
                      <p className="text-base">
                        Excludes tax and shipping and handling
                      </p>
                    </div>
                  </div>
                )
                : (
                  <div>
                    {this.state.cartLoading
                      ? <img className="loading-GIF" src="/img/loading80px.gif" alt="" />
                      : (
                        <div className="empty-cart">
                          {`Your cart is currently empty. You can either upload a
                                file for a custom chip order or view our products `}
                          <NavLink to="/allItems">here</NavLink>
                          .
                        </div>
                      )}
                  </div>
                )}
            </div>
          )
          : null}
      </div>
    );
  }
}

export default Cart;
