import React, { useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { request, getChipOrders, getCustomerCart, getProductOrders, manipulateCustomerOrders, addOrderProductToCart } from '../api';
import { ShopifyContext } from '../context/ShopifyContext';
import { ChipOrder, OrderInfo, ProductOrder } from '../types';

// interface Cart {
//   items: number;
//   setProductQuantity: (quantity: number) => void;
//   setChipQuantity: (quantity: number) => void;
// }

export enum OrderItem {
  Product = 'orderProducts',
  Chip = 'orderChips'
}

const useCart = () => {
  const [cart, setCart] = useState<OrderInfo>({} as OrderInfo);
  const [activeCart, setActiveCart] = useState(true);
  const [numItems, setNumItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const shopify = useContext(ShopifyContext);

  const [cookies] = useCookies(['userId']);

  async function createCart() {
    shopify && shopify.checkout.create().then((res) => {
      console.log(res);
      const lastSlash = res.webUrl.lastIndexOf('/');
      const lastQuestionMark = res.webUrl.lastIndexOf('?');
      const data: OrderInfo = {
        checkoutIdClient: res.id as string,
        checkoutToken: res.webUrl.slice(lastSlash + 1, lastQuestionMark),
        checkoutLink: res.webUrl,
        // @ts-expect-error
        createdAt: res.createdAt,
        // @ts-expect-error
        lastModifiedAt: res.updatedAt,
        orderComplete: false,
        status: 'Order in progress',
        customerId: cookies.userId,
        shippingAddressId: 0, // 0 to indicate no address selected yet (pk cannot be 0)
        billingAddressId: 0,
      };
      // and then create orderInfo in our backend
      return request(manipulateCustomerOrders.replace('id', cookies.userId), 'POST', data, true)
    }).then((res) => {
      setCart(res.data)
    }).catch((err) => {
      console.error(err);
    });
  }

  // create cart if it doesn't exist, otherwise get cart info
  useEffect(() => {
    cookies.userId && request(getCustomerCart.replace('id', cookies.userId), 'GET', {}, true).then((res) => {
      setActiveCart(!!res.data)
    }).catch((err) => console.error(err));
  }, [cookies.userId]);
  useEffect(() => {
    if (!activeCart) createCart();
  }, [activeCart])

  // count number of items in cart
  useEffect(() => {
    setNumItems(Object.values(cart).reduce((acc, item) => acc + item.quantity, 0));
  }, [cart]);

  // calculate total price of cart
  useEffect(() => {
    setTotalPrice(Object.values(cart).reduce((acc, item) => acc + item.quantity * item.price, 0));
  }, [cart]);

  function addProductBackend(item: ProductOrder | ChipOrder, itemType: OrderItem) {
    // add to shopify cart, and then add to our own cart
    const customShopifyAttributes = [];
    let customServerOrderAttributes = '';
    for (const [k, v] of Object.entries(otherDetails).sort((a, b) => a[0].localeCompare(b[0]))) {
      if (v !== undefined) {
        customShopifyAttributes.push({ key: k, value: v });
        customServerOrderAttributes += `${k}: ${v}\n`;
      }
    }

    const variantId = product.id !== productIdsJson['UNIVEWODCHIPID'][bundleSize]
      ? product.variants[0].id
      // @ts-expect-error
      : (otherDetails.withCoverPlateAssembled
        ? productIdsJson['UNIVEWODCHIPWITHCOVERPLATE'][bundleSize]
        : productIdsJson['UNIVEWODCHIPWITHOUTCOVERPLATE'][bundleSize]);
    // console.log(variantId);
    const lineItemsToAdd = [{
      variantId,
      quantity,
    }];
    shopify && shopify.checkout.addLineItems(shopifyClientCheckoutId, lineItemsToAdd)
      .then((res) => {
        let lineItemId;
        console.log(res);
        for (let i = 0; i < res.lineItems.length; i++) {
          // @ts-expect-error
          if (Buffer.from(res.lineItems[i].variant.id).toString('base64') === variantId) {
            // @ts-expect-error
            lineItemId = Buffer.from(res.lineItems[i].id).toString('base64');
            break;
          }
        }

        const data = {
          orderInfoId,
          productIdShopify: product.id,
          variantIdShopify: variantId,
          lineItemIdShopify: lineItemId,
          description: product.description,
          quantity,
          price: parseFloat(product.variants[0].price),
          name: product.title,
          otherDetails: customServerOrderAttributes,
        };
        // console.log(data);
        return request(addOrderProductToCart.replace('id', orderInfoId.toString()), 'POST', data, true)
      })
    request(manipulateCustomerOrders.replace('id', cookies.userId), 'PUT', {
      [itemType]: [item]
    }, true).then((res) => {
      setCart(res.data);
    }).catch((err) => console.error(err));
  }

  function addItem(item: ProductOrder | ChipOrder, itemType: OrderItem) {
    itemType === OrderItem.Product ?
      setCart(cart => ({
        ...cart,
        orderProducts: [
          ...cart.orderProducts,
          item as ProductOrder
        ]
      })) :
      setCart(cart => ({
        ...cart,
        orderChips: [
          ...cart.orderChips,
          item as ChipOrder
        ]
      }))
  }

  function editItem(item: ProductOrder | ChipOrder, newQuantity: number, itemType: OrderItem) {
    itemType === OrderItem.Product ?
      setCart(cart => ({
        ...cart,
        orderProducts: cart.orderProducts.map((product) => {
          if (product.lineItemIdShopify === item.lineItemIdShopify) {
            return { ...product, quantity: newQuantity }
          }
          return product;
        })
      })) :
      setCart(cart => ({
        ...cart,
        orderChips: cart.orderChips.map((chip) => {
          if (chip.lineItemIdShopify === item.lineItemIdShopify) {
            return { ...chip, quantity: newQuantity }
          }
          return chip;
        })
      }))
  }

  return {
    numItems,
    totalPrice,
    cart,
    addItem(item: ProductOrder | ChipOrder, itemType: OrderItem) {
      addItem(item, itemType);
    },
    editItem(item: ProductOrder | ChipOrder, newQuantity: number, itemType: OrderItem) {
      editItem(item, newQuantity, itemType);
    }
  }
}

export const CartContext = React.createContext({} as ReturnType<typeof useCart>);

function CartContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <CartContext.Provider value={useCart()}>
      {children}
    </CartContext.Provider>
  )
}
export default CartContextProvider;
