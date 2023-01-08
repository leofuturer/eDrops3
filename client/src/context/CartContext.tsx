import React, { useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { request } from '../api/lib/api';
import { getChipOrders, getCustomerCart, getProductOrders, manipulateCustomerOrders } from '../api/lib/serverConfig';
import { ShopifyContext } from '../App';
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
    cookies.userId && request(getCustomerCart.replace('id', cookies.userId), 'GET', {}, true).then((res) =>
      res.data ? setCart(res.data) : createCart()
    ).catch((err) => console.error(err));
  }, [cookies.userId]);

  // count number of items in cart
  useEffect(() => {
    setNumItems(Object.values(cart).reduce((acc, item) => acc + item.quantity, 0));
  }, [cart]);

  // calculate total price of cart
  useEffect(() => {
    setTotalPrice(Object.values(cart).reduce((acc, item) => acc + item.quantity * item.price, 0));
  }, [cart]);

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
