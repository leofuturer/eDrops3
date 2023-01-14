import { useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { NavLink, useNavigate } from 'react-router-dom';
import { modifyChipOrders, modifyProductOrders, request, updateChipOrderLineItem, updateProductOrderLineItem } from '../../api';
import SEO from '../../component/header/seo';
import ManageRightLayout from '../../component/layout/ManageRightLayout';
import { CartContext } from '../../context/CartContext';
import { ShopifyContext } from '../../context/ShopifyContext';
import { ChipOrder, ProductOrder } from '../../types';
import CartItem from './cartItem.js';
import { metadata } from './metadata.js';

type ItemType = 'product' | 'chip';

interface CartItem {

}

function Cart() {
  const [cartExists, setCartExists] = useState(false);
  const [cartId, setCartId] = useState<number | undefined>(undefined);
  const [shopifyCheckoutId, setShopifyCheckoutId] = useState(undefined);
  const [shopifyCheckoutLink, setShopifyCheckoutLink] = useState(undefined);
  const [productOrders, setProductOrders] = useState<ProductOrder[]>([]);
  const [chipOrders, setChipOrders] = useState<ChipOrder[]>([]);
  const [modifiedItems, setModifiedItems] = useState(new Set());
  const [saveInProgress, setSaveInProgress] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [numModifiedItems, setNumModifiedItems] = useState(0);
  const [totalModifiedItems, setTotalModifiedItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const [cookies] = useCookies(['userId', 'userType'])

  const cart = useContext(CartContext);
  const shopify = useContext(ShopifyContext);

  const navigate = useNavigate();

  function handleQtyChange(e, itemType, index) {
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

  useEffect(() => {
    setTotalModifiedItems(modifiedItems.size);
  }, [modifiedItems]);

  // function updateLineItemCartHelper(instance, itemsToUpdate) {
  //   return new Promise((resolve, reject) => {
  //     instance.checkout.updateLineItems(shopifyCheckoutId, itemsToUpdate)
  //       .then((checkout) => {
  //         return resolve(checkout);
  //       })
  //       .catch((err) => {
  //         console.error(err);
  //         return reject();
  //       });
  //   });
  // }

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
      return request(url, 'PATCH', data, true)
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
      return request(url, 'PATCH', data, true)
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

  function handleDelete(itemType: string, index: number) {
    setDeleteLoading(true);
    const array = itemType === 'product' ? productOrders : chipOrders;

    // Delete from Shopify, then our own DB
    const itemToDelete = [array[index].lineItemIdShopify];
    if (shopify) {
      shopify.checkout.removeLineItems(shopifyCheckoutId, itemToDelete)
        .then((checkout) => {
          // console.log(checkout);
          const url = (itemType === 'product' ? modifyProductOrders : modifyChipOrders).replace('id', array[index].id.toString());
          return request(url, 'DELETE', {}, true)
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
                  cart.setProductQuantity(quantity);
                } else if (itemType === 'chip') {
                  const quantity = chipOrders.reduce((prev, curr) => prev + curr.quantity, 0);
                  cart.setChipQuantity(quantity);
                }
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
  }

  // function updateLineItemCartHelper(type, item, itemsToUpdate) {
  //   if (shopify) {
  //     return shopify.checkout.updateLineItems(shopifyCheckoutId, itemsToUpdate)
  //       .then((checkout) => {
  //         let url;
  //         // console.log(checkout.lineItems);
  //         if (type === 'product') {
  //           url = modifyProductOrders.replace('id', item.id);
  //         } else if (type === 'chip') {
  //           url = modifyChipOrders.replace('id', item.id);
  //         }
  //         const data = { quantity: parseInt(item.quantity) };
  //         request(url, 'PATCH', data, true)
  //           .then((res) => {
  //             setNumModifiedItems(numModifiedItems => numModifiedItems + 1);
  //             if (numModifiedItems === totalModifiedItems && numModifiedItems > 0) {
  //               setCartItems();    // updates number on cart icon

  //               setSaveInProgress(false);
  //             }
  //           })
  //           .catch((err) => {
  //             console.error(err);
  //             setSaveInProgress(false);
  //           });
  //       })
  //       .catch((err) => {
  //         console.error(err);
  //         setSaveInProgress(false);
  //       });
  //   }
  // }

  // function handleSaveForOrders(array: (ProductOrder | ChipOrder)[], type: string) {
  //   return array.filter(item => (modifiedItems.has(item.lineItemIdShopify)))
  //     .reduce((p, nextItem) => {
  //       const itemsToUpdate = [{
  //         id: nextItem.lineItemIdShopify,
  //         quantity: nextItem.quantity,
  //       }];
  //       return p.then(() => {
  //         return updateLineItemCartHelper(type, nextItem, itemsToUpdate);
  //       });
  //     }, Promise.resolve());
  // }

  // function handleSave() {
  //   if (modifiedItems.size > 0) {
  //     setSaveInProgress(true);
  //     handleSaveForOrders(productOrders, 'product')
  //       .then(e => {
  //         return handleSaveForOrders(chipOrders, 'chip');
  //       }).catch((err) => {
  //         console.error(err);
  //       }).finally(() => {
  //         setSaveInProgress(false);
  //       });
  //   }
  // }

  function handleCheckout() {
    navigate('/beforeCheckout', {
      state: {
        shopifyCheckoutLink: shopifyCheckoutLink,
        cartId: cartId,
        shopifyCheckoutId: shopifyCheckoutId,
      }
    });
  }

  return (
    <ManageRightLayout title="Cart">
      <SEO
        title="eDrops | Cart"
        description=""
        metadata={metadata}
      />
      {cart.numItems > 0
        ? (<div className="flex flex-col w-full space-y-4 -mt-4">
          <div className="flex flex-row justify-end items-center">
            <button type="button" className="bg-primary rounded-lg text-white px-4 py-2" onClick={handleCheckout}>Checkout</button>
          </div>
          <div className="flex flex-col space-y-4">
            {cart.cart?.orderProducts?.length > 0 && cart.cart.orderProducts.map((oneProduct, index) => <CartItem
              key={index}
              info={oneProduct}
              onChange={(e) => handleQtyChange(e, 'product', index)}
              onDelete={() => handleDelete('product', index)}
              deleteLoading={deleteLoading}
            />)}
            {cart.cart?.orderChips?.length > 0 && cart.cart.orderChips.map((oneProduct, index) => <CartItem
              key={index}
              info={oneProduct}
              onChange={(e) => handleQtyChange(e, 'chip', index)}
              onDelete={() => handleDelete('chip', index)}
              deleteLoading={deleteLoading}
            />)}
          </div>
          <div className="flex flex-col items-end px-4">
            <p className="">
              Total Price: ${cart.totalPrice.toFixed(2)}
            </p>
            <p className="text-base">
              Excludes tax and shipping and handling
            </p>
          </div>
        </div>
        )
        : <p className="text-center">Your cart is currently empty. You can either <NavLink to="/upload" className="text-primary_light hover:text-primary">upload a file</NavLink> for a custom chip order or <NavLink to="/allItems" className="text-primary_light hover:text-primary">view our products</NavLink>.</p>}
    </ManageRightLayout>
  );
}

export default Cart;
