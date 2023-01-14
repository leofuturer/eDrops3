import React, { useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { Product } from 'shopify-buy';
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
  const [numItems, setNumItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const shopify = useContext(ShopifyContext);

  const [cookies] = useCookies(['userId']);
  const navigate = useNavigate();

  async function createCart() {
    shopify && shopify.checkout.create().then((res) => {
      // console.log(res);
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
    const numProducts = cart.orderProducts?.length > 0 ? cart.orderProducts.reduce((acc, item) => acc + item.quantity, 0) : 0;
    const numChips = cart.orderChips ? cart.orderChips.reduce((acc, item) => acc + item.quantity, 0) : 0;
    setNumItems(numProducts + numChips);
  }, [cart]);

  // calculate total price of cart
  useEffect(() => {
    const productPrice = cart.orderProducts?.length > 0 ? cart.orderProducts.reduce((acc, item) => acc + item.quantity * item.price, 0) : 0;
    const chipPrice = cart.orderChips ? cart.orderChips.reduce((acc, item) => acc + item.quantity * item.price, 0) : 0;
    setTotalPrice(productPrice + chipPrice);
  }, [cart]);


  // add to shopify cart, and then add to our own cart
  function addProduct(product: Product, quantity: number): Promise<void>{
    const variantId = product.variants[0].id;
    // console.log(product)
    // console.log(cart)
    return shopify && shopify.checkout.addLineItems(cart.checkoutIdClient, [{ variantId, quantity }]).then((res) => {
      const lineItemId = res.lineItems.find((item) => item.variant.id === product.variants[0].id).id;
      // console.log(lineItemId);
      const data = {
        orderInfoId: cart.id,
        productIdShopify: product.id,
        variantIdShopify: product.variants[0].id,
        lineItemIdShopify: lineItemId,
        description: product.description,
        quantity,
        price: parseFloat(product.variants[0].price.amount),
        name: product.title,
      };
      // console.log(data);
      return request(addOrderProductToCart.replace('id', cart.id.toString()), 'POST', data, true)
    }).then((res) => request(getProductOrders.replace('id', cart.id.toString()), 'GET', {}, true))
      .then((res) => {
        // console.log(res);
        setCart(cart => ({
          ...cart,
          orderProducts: res.data
        }))
        navigate('/manage/cart');
      })
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
    addProduct,
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
