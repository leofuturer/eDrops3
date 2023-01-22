import React, { useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { LineItem, Product } from 'shopify-buy';
import { addOrderChipToCart, addOrderProductToCart, customerGetName, getChipOrders, getCustomerCart, getProductOrders, getWorkerId, manipulateCustomerOrders, modifyChipOrders, modifyProductOrders, request } from '../api';
import { ShopifyContext } from '../context/ShopifyContext';
import { ChipOrder, OrderInfo, ProductOrder } from '../types';

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
      const data: Omit<OrderInfo, 'id'> = {
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
    const numProducts = cart.orderProducts?.length ? cart.orderProducts.reduce((acc, item) => acc + item.quantity, 0) : 0;
    const numChips = cart.orderChips ? cart.orderChips.reduce((acc, item) => acc + item.quantity, 0) : 0;
    setNumItems(numProducts + numChips);
  }, [cart]);

  // calculate total price of cart
  useEffect(() => {
    const productPrice = cart.orderProducts?.length ? cart.orderProducts.reduce((acc, item) => acc + item.quantity * item.price, 0) : 0;
    const chipPrice = cart.orderChips ? cart.orderChips.reduce((acc, item) => acc + item.quantity * item.price, 0) : 0;
    setTotalPrice(productPrice + chipPrice);
  }, [cart]);


  // add to shopify cart, and then add to our own cart
  function addProduct(product: Product, quantity: number): Promise<void> {
    const variantId = product.variants[0].id;
    // console.log(product)
    // console.log(cart)
    if (!shopify || !cart.checkoutIdClient) return Promise.reject('Shopify or cart not initialized')
    return shopify.checkout.addLineItems(cart.checkoutIdClient, [{ variantId, quantity }]).then((res) => {
      // @ts-expect-error NOTE: Shopify types not updated
      const lineItemId = res.lineItems.find((item) => item.variant.id === product.variants[0].id).id;
      // console.log(lineItemId);
      const data = {
        orderInfoId: cart.id,
        productIdShopify: product.id,
        variantIdShopify: product.variants[0].id,
        lineItemIdShopify: lineItemId,
        description: product.description,
        quantity,
        // @ts-expect-error NOTE: Shopify types not updated
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

  function addChip(chip: Product, quantity: number, customAttrs: { material: string, wcpa: string, fileInfo: { fileName: string; id: number } }): Promise<void> {
    const variantId = chip.variants[0].id;
    const customAttributes = [
      {
        key: 'material',
        value: customAttrs.material,
      },
      {
        key: 'withCoverPlateAssembled',
        value: customAttrs.wcpa,
      },
      {
        key: 'fileName',
        value: customAttrs.fileInfo.fileName,
      },
    ]
    const checkAttrs = customAttributes.reduce((acc, attr) => ({...acc, [attr.key]: attr.value }), {})
    const lineItemsToAdd = [{
      variantId,
      quantity,
      customAttributes,
    }];
    if (!shopify || !cart.checkoutIdClient) return Promise.reject('Shopify or cart not initialized');
    return shopify.checkout.addLineItems(cart.checkoutIdClient, lineItemsToAdd)
      .then(async (res) => {
        console.log(res)
        const matchingAttrs = (item: LineItem) => {
          // @ts-expect-error NOTE: Shopify types not updated
          return item.customAttributes.every((attr: { key: string; value: string; }) => attr.key in checkAttrs && attr.value === checkAttrs[attr.key]);
        }
        const lineItemId = res.lineItems.find((item) => matchingAttrs(item))?.id;

        let workerUsername = '';
        switch (customAttrs.material) {
          case 'ITO Glass':
            workerUsername = 'glassfab';
            break;
          case 'Paper':
            workerUsername = 'paperfab';
            break;
          case 'PCB':
            workerUsername = 'pcbfab';
            break;
        }
        const workerId = await request(getWorkerId, 'GET', { username: workerUsername }, true).then((res) => res.data);
        const customerName = await request(customerGetName.replace('id', cookies.userId), 'GET', {}, true).then((res) => `${res.data.firstName} ${res.data.lastName}`);

        // create our own chip order here...
        const data = {
          orderInfoId: cart.id,
          productIdShopify: chip.id,
          variantIdShopify: chip.variants[0].id,
          lineItemIdShopify: lineItemId,
          name: chip.title,
          description: chip.description,
          quantity,
          // @ts-expect-error NOTE: Shopify types not updated
          price: parseFloat(chip.variants[0].price.amount),
          otherDetails: JSON.stringify(customAttrs),
          process: customAttrs.material,
          coverPlate: customAttrs.wcpa,
          lastUpdated: new Date().toISOString(),
          fileInfoId: customAttrs.fileInfo.id,
          workerId,
          workerName: `edrop ${workerUsername}`,
          customerName: customerName,
        };
        return request(addOrderChipToCart.replace('id', cart.id.toString()), 'POST', data, true)
      }).then((res) => request(getChipOrders.replace('id', cart.id.toString()), 'GET', {}, true))
      .then((res) => {
        setCart(cart => ({
          ...cart,
          orderChips: res.data
        }))
        navigate('/manage/cart');
      })
  }

  function editProductQuantity(product: ProductOrder, newQuantity: number) {
    const lineItemsToUpdate = [{ id: product.lineItemIdShopify, quantity: newQuantity }];
    if (!shopify || !cart.checkoutIdClient) return Promise.reject('Shopify or cart not initialized');
    return shopify.checkout.updateLineItems(cart.checkoutIdClient, lineItemsToUpdate).then((res) => {
      return request(modifyProductOrders.replace('id', product.id.toString()), 'PATCH', { quantity: newQuantity }, true)
    }).then((res) => request(getProductOrders.replace('id', cart.id.toString()), 'GET', {}, true))
      .then((res) => {
        // console.log(res);
        setCart(cart => ({
          ...cart,
          orderProducts: res.data
        }))
      })
  }

  function editChipQuantity(chip: ChipOrder, newQuantity: number) {
    const lineItemsToUpdate = [{ id: chip.lineItemIdShopify, quantity: newQuantity }];
    if (!shopify || !cart.checkoutIdClient) return Promise.reject('Shopify or cart not initialized');
    return shopify.checkout.updateLineItems(cart.checkoutIdClient, lineItemsToUpdate).then((res) => {
      return request(modifyChipOrders.replace('id', chip.id.toString()), 'PATCH', { quantity: newQuantity }, true)
    }).then((res) => request(getChipOrders.replace('id', cart.id.toString()), 'GET', {}, true))
      .then((res) => {
        // console.log(res);
        setCart(cart => ({
          ...cart,
          orderChips: res.data
        }))
      })
  }

  function removeProduct(product: ProductOrder) {
    if (!shopify || !cart.checkoutIdClient) return Promise.reject('Shopify or cart not initialized');
    return shopify.checkout.removeLineItems(cart.checkoutIdClient, [product.lineItemIdShopify]).then((checkout) => {
      return request(modifyProductOrders.replace('id', product.id.toString()), 'DELETE', {}, true)
    }).then((res) => request(getProductOrders.replace('id', cart.id.toString()), 'GET', {}, true))
      .then((res) => {
        // console.log(res);
        setCart(cart => ({
          ...cart,
          orderProducts: res.data
        }))
      })
  }

  function removeChip(chip: ChipOrder) {
    if (!shopify || !cart.checkoutIdClient) return Promise.reject('Shopify or cart not initialized');
    return shopify.checkout.removeLineItems(cart.checkoutIdClient, [chip.lineItemIdShopify]).then((checkout) => {
      return request(modifyChipOrders.replace('id', chip.id.toString()), 'DELETE', {}, true)
    }).then((res) => request(getChipOrders.replace('id', cart.id.toString()), 'GET', {}, true))
      .then((res) => {
        // console.log(res);
        setCart(cart => ({
          ...cart,
          orderChips: res.data
        }))
      })
  }

  function checkout() {
    navigate('/beforeCheckout', {
      state: {
        shopifyCheckoutLink: cart.checkoutLink,
        cartId: cart.id,
        shopifyCheckoutId: cart.checkoutIdClient,
      }
    });
  }

  return {
    numItems,
    totalPrice,
    cart,
    addProduct,
    addChip,
    editProductQuantity,
    editChipQuantity,
    removeProduct,
    removeChip,
    checkout,
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
