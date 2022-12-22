import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
import SEO from '../../component/header/SEO.js';

import { CartContext } from '../../context/CartContext';
import { useCookies } from 'react-cookie';

function Cart({ shopifyClient }: { shopifyClient: ShopifyBuy.Client }) {
  const [cartExists, setCartExists] = useState(false);
  const [cartId, setCartId] = useState(undefined);
  const [shopifyCheckoutId, setShopifyCheckoutId] = useState(undefined);
  const [shopifyCheckoutLink, setShopifyCheckoutLink] = useState(undefined);
  const [productOrders, setProductOrders] = useState<any[]>([]);
  const [chipOrders, setChipOrders] = useState<any[]>([]);
  const [modifiedItems, setModifiedItems] = useState(new Set());
  const [saveInProgress, setSaveInProgress] = useState(false);
  const [cartLoading, setCartLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [numModifiedItems, setNumModifiedItems] = useState(0);
  const [totalModifiedItems, setTotalModifiedItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const [cookies] = useCookies(['userId'])

  const context = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    let url = getCustomerCart.replace('id', cookies.userId);
    API.Request(url, 'GET', {}, true)
      .then((res) => {
        if (res.data.id) {
          // console.log(res);
          const orderInfoId = res.data.id;
          setCartExists(true);
          setCartId(res.data.id);
          setShopifyCheckoutId(res.data.checkoutIdClient);
          setShopifyCheckoutLink(res.data.checkoutLink);
          url = getProductOrders.replace('id', orderInfoId);
          API.Request(url, 'GET', {}, true)
            .then((res) => {
              setProductOrders(res.data);
              url = getChipOrders.replace('id', orderInfoId);
              API.Request(url, 'GET', {}, true)
                .then((res) => {
                  setChipOrders(res.data);
                  setCartLoading(false);
                })
                .catch((err) => {
                  console.error(err);
                });
            })
            .catch((err) => {
              console.error(err);
            });
        } else {
          setCartExists(false);
          setCartLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [cookies.userId]);

  function handleQtyChange(e, itemType, index) {
    if (e.target.value < 1) {
      alert('Error: quantity cannot be less than 1');
      e.target.value = 1;
    } else {
      // https://stackoverflow.com/questions/29537299/react-how-to-update-state-item1-in-state-using-setstate
      if (itemType === 'product') {
        const items = [...productOrders];
        const item = Object.assign({}, items[index]); // replacement for `let item = {...items[index]};`
        item.quantity = parseInt(e.target.value);
        items[index] = item;
        setProductOrders(items);
        setModifiedItems(new Set(modifiedItems).add(item.lineItemIdShopify));
      } else if (itemType === 'chip') {
        const items = [...chipOrders];
        const item = Object.assign({}, items[index]); // replacement for `let item = {...items[index]};`
        item.quantity = parseInt(e.target.value);
        items[index] = item;
        setChipOrders(items);
        setModifiedItems(new Set(modifiedItems).add(item.lineItemIdShopify));
      }
    }
  }

  useEffect(() => {
    setTotalModifiedItems(modifiedItems.size);
  }, [modifiedItems]);

  function updateLineItemCartHelper(instance, itemsToUpdate) {
    return new Promise((resolve, reject) => {
      instance.checkout.updateLineItems(shopifyCheckoutId, itemsToUpdate)
        .then((checkout) => {
          return resolve(checkout);
        })
        .catch((err) => {
          console.error(err);
          return reject();
        });
    });
  }

  function updateLineItemDatabaseHelper(checkoutLineItem, orderInfoId) {
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
      return API.Request(url, 'PATCH', data, true)
        .then((checkout) => {
          // return resolve();
          // https://stackoverflow.com/questions/29537299/how-can-i-update-state-item1-in-state-using-setstate
          let index;
          const array = chipOrders;
          for (let i = 0; i < array.length; i += 1) {
            if (array[i].otherDetails === otherDetails && array[i].variantIdShopify === variantIdShopify) {
              index = i;
              break;
            }
          }
          setChipOrders(chipOrders => [
            ...chipOrders.slice(0, index),
            {
              ...chipOrders[index],
              lineItemIdShopify: lineItemIdShopify,
            },
            ...chipOrders.slice(index + 1)
          ])
        })
        .catch((err) => {
          console.error(err);
          setDeleteLoading(false);
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
      return API.Request(url, 'PATCH', data, true)
        .then((checkout) => {
          // return resolve();
          // https://stackoverflow.com/questions/29537299/how-can-i-update-state-item1-in-state-using-setstate
          let index;
          const array = productOrders;
          for (let i = 0; i < array.length; i += 1) {
            if (array[i].otherDetails === otherDetails && array[i].variantIdShopify === variantIdShopify) {
              index = i;
              break;
            }
          }

          setProductOrders(productOrders => [
            ...productOrders.slice(0, index),
            {
              ...productOrders[index],
              lineItemIdShopify: lineItemIdShopify,
            },
            ...productOrders.slice(index + 1)
          ])

        })
        .catch((err) => {
          console.error(err);
          setDeleteLoading(false);
        });
    }
  }

  function handleDelete(itemType, index) {
    setDeleteLoading(true);
    let url;
    if (itemType === 'product') {
      var array = productOrders;
    } else if (itemType === 'chip') {
      var array = chipOrders;
    }

    // Delete from Shopify, then our own DB
    const itemToDelete = [array[index].lineItemIdShopify];
    Shopify.getInstance().getPrivateValue()
      .then((instance) => {
        instance.checkout.removeLineItems(shopifyCheckoutId, itemToDelete)
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
                  return updateLineItemDatabaseHelper(nextItem, array[index].orderInfoId);
                }, Promise.resolve());

                result.then(e => {
                  if (itemType === 'product') {
                    const products = productOrders.filter((item) => item.id !== array[index].id);
                    setProductOrders(products);
                  } else if (itemType === 'chip') {
                    const chips = chipOrders.filter((item) => item.id !== array[index].id);
                    setChipOrders(chips);
                  }

                  if (itemType === 'product') {
                    const quantity = productOrders.reduce((prev, curr) => prev + curr.quantity, 0);
                    context.setProductQuantity(quantity);
                  } else if (itemType === 'chip') {
                    const quantity = chipOrders.reduce((prev, curr) => prev + curr.quantity, 0);
                    context.setChipQuantity(quantity);
                  }

                  context.setCartQuantity();

                  setDeleteLoading(false);
                });
              })
              .catch((err) => {
                console.error(err);
                setDeleteLoading(false);
              });
          })
          .catch((err) => {
            console.error(err);
            setDeleteLoading(false);
          });
      })
      .catch((err) => {
        console.error(err);
        setDeleteLoading(false);
      });
  }

  function updateLineItemCartHelper(instance, type, item, itemsToUpdate) {
    return instance.checkout.updateLineItems(shopifyCheckoutId, itemsToUpdate)
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
            setNumModifiedItems(numModifiedItems => numModifiedItems + 1);
            if (numModifiedItems === totalModifiedItems && numModifiedItems > 0) {
              setCartItems();    // updates number on cart icon

              setSaveInProgress(false);
            }
          })
          .catch((err) => {
            console.error(err);
            setSaveInProgress(false);
          });
      })
      .catch((err) => {
        console.error(err);
        setSaveInProgress(false);
      });
  }

  function handleSaveForOrders(instance, array, type) {
    return array.filter(item => (modifiedItems.has(item.lineItemIdShopify)))
      .reduce((p, nextItem) => {

        const itemsToUpdate = [{
          id: nextItem.lineItemIdShopify,
          quantity: parseInt(nextItem.quantity),
        }];

        return p.then(() => {
          return updateLineItemCartHelper(instance, type, nextItem, itemsToUpdate);
        });

      }, Promise.resolve());
  }

  function handleSave() {
    if (modifiedItems.size > 0) {
      setSaveInProgress(true);
      Shopify.getInstance().getPrivateValue()
        .then((instance) => {
          const result = handleSaveForOrders(instance, _productOrders, 'product');
          result.then(e => {
            handleSaveForOrders(instance, _chipOrders, 'chip');
          });
        })
        .catch((err) => {
          console.error(err);
          setSaveInProgress(false);
        });
    }
  }

  function handleCheckout() {
    navigate('/beforeCheckout', {
      state: {
        shopifyCheckoutLink: shopifyCheckoutLink,
        cartId: cartId,
        shopifyCheckoutId: shopifyCheckoutId,
      }
    });
  }

  function setCartItems() {
    const orderInfoId = cartId;
    let url = getProductOrders.replace('id', orderInfoId);
    API.Request(url, 'GET', {}, true)
      .then((res) => {
        let quantity = res.data.reduce((prev, curr) => prev + curr.quantity, 0);
        context.setProductQuantity(quantity);

        url = getChipOrders.replace('id', orderInfoId);
        API.Request(url, 'GET', {}, true)
          .then((res) => {
            quantity = res.data.reduce((prev, curr) => prev + curr.quantity, 0);
            context.setChipQuantity(quantity);

            context.setCartQuantity();

            setNumModifiedItems(0);
            setModifiedItems(new Set());
            setTotalModifiedItems(0);
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
      });
  }


  useEffect(() => {
    const productTotal = productOrders.reduce((prev, curr) => {
      return prev + (curr.quantity * curr.price);
    }, 0);
    const chipTotal = chipOrders.reduce((prev, curr) => {
      return prev + (curr.quantity * curr.price);
    }, 0);
    setTotalPrice(productTotal + chipTotal);
  }, [productOrders, chipOrders]);


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
              <h2 className="text-2xl">Cart</h2>
            </div>
            {productOrders.length + chipOrders.length > 0
              ? (
                <div className="flex flex-col py-8 w-full space-y-4">
                  <div className="flex flex-row justify-between items-center">
                    <p className="">
                      Use the "save" button to save any changes to quantities.<br/> Deletions are saved immediately.
                    </p>
                    <div className="flex flex-row space-x-4 p-2 items-center">
                      {saveInProgress
                        ? <img className="" src="/img/loading80px.gif" alt="" />
                        : (
                          <button
                            type="button"
                            className="bg-green-600 rounded-lg text-white px-4 py-2"
                            onClick={() => handleSave()}
                          >
                            Save
                          </button>
                        )}
                      <button
                        type="button"
                        className="bg-primary rounded-lg text-white px-4 py-2"
                        onClick={() => handleCheckout()}
                      >
                        Checkout
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    {
                      productOrders.map((oneProduct, index) => (
                        <CartItem
                          key={index}
                          info={oneProduct}
                          onChange={(e) => handleQtyChange(e, 'product', index)}
                          onDelete={() => handleDelete('product', index)}
                          deleteLoading={deleteLoading}
                        />
                      ))
                    }
                    {
                      chipOrders && chipOrders.map((oneProduct, index) => (
                        <CartItem
                          key={index}
                          info={oneProduct}
                          onChange={(e) => handleQtyChange(e, 'chip', index)}
                          onDelete={() => handleDelete('chip', index)}
                          deleteLoading={deleteLoading}
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
                  {cartLoading
                    ? <img className="loading-GIF" src="/img/loading80px.gif" alt="" />
                    : (
                      <div className="w-full py-8">
                        <p>
                          Your cart is currently empty. You can either <NavLink to="/upload" className="text-primary_light hover:text-primary">upload a file</NavLink> for a custom chip order or <NavLink to="/allItems" className="text-primary_light hover:text-primary">view our products</NavLink>.</p>
                      </div>
                    )}
                </div>
              )}
          </div>
        )
        : null
      }
    </div >
  );
}

export default Cart;
