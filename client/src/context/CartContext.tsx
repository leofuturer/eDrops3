import { api } from '@/api';
import { PusherContext } from '@/context';
import { ROUTES } from '@/router/routes';
import { Address, DTO, FileInfo, OrderChip, OrderInfo, OrderProduct } from '@/types';
import { Material } from '@/types/chip';
import React, { useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { CheckoutLineItemInput, Product } from 'shopify-buy';


const useCart = () => {
  const [cart, setCart] = useState<DTO<OrderInfo>>({} as DTO<OrderInfo>);
  const [fetchingCart, setFetchingCart] = useState(false);
  const [productOrders, setProductOrders] = useState<DTO<OrderProduct>[]>([]);
  const [chipOrders, setChipOrders] = useState<DTO<OrderChip>[]>([]);
  const [numItems, setNumItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const enabled = true;

  const pusher = useContext(PusherContext);

  const [cookies] = useCookies(['userId']);
  const navigate = useNavigate();

  // async function createCart() {
  //   api.customer.createCart(cookies.userId).then((cart) => {
  //     setCart(cart)
  //   }).catch((err) => {
  //     console.error(err);
  //   });
  // }

  function fetchCart() {
    setFetchingCart(true);
    api.customer.getCart(cookies.userId).then((cart) => {
      setCart(cart);
    }).catch((err) => console.error(err))
      .finally(() => setFetchingCart(false));
  }

  // create cart if it doesn't exist, otherwise get cart info
  useEffect(() => {
    if (cookies.userId && !fetchingCart) {
      fetchCart();
    }
  }, [cookies.userId]);

  useEffect(() => {
    if (cart && 'orderProducts' in cart && 'orderChips' in cart) {
      setProductOrders(cart?.orderProducts);
      setChipOrders(cart?.orderChips);
    }
  }, [cart]);

  // count number of items in cart
  useEffect(() => {
    if (cart) {
      const numProducts = ('orderProducts' in cart) ? cart.orderProducts.reduce((acc, item) => acc + item.quantity, 0) : 0;
      const numChips = ('orderChips' in cart) ? cart.orderChips.reduce((acc, item) => acc + item.quantity, 0) : 0;
      setNumItems(numProducts + numChips);
    }
  }, [cart]);

  // calculate total price of cart
  useEffect(() => {
    if (cart) {
      const productPrice = ('orderProducts' in cart) ? cart.orderProducts.reduce((acc, item) => acc + item.quantity * item.price, 0) : 0;
      const chipPrice = ('orderChips' in cart) ? cart.orderChips.reduce((acc, item) => acc + item.quantity * item.price, 0) : 0;
      setTotalPrice(productPrice + chipPrice);
    }
  }, [cart]);

  // useEffect(() => {
  //   console.log(cart);
  // }, [cart]);

  // add to shopify cart, and then add to our own cart
  async function addProduct(product: Product, quantity: number): Promise<void> {
    if (!cart.id) fetchCart();
    // console.log(product)
    // console.log(cart)
    const data: Product & CheckoutLineItemInput = {
      ...product,
      quantity,
      variantId: product.variants[0].id,
    }

    // return api.order.addProductOrder(cart.id as number, data)
    //   .then((product) => api.order.getProductOrders(cart.id as number))
    //   .then((products) => {
    //     // console.log(res);
    //     setProductOrders(products);
    //     navigate(ROUTES.ManageCart);
    //   }).catch((err) => console.error(err));
    return api.order.addProductOrder(cart.id as number, data).then(() => {
      fetchCart();
      navigate(ROUTES.ManageCart);
    }).catch((err) => console.error(err));
  }

  async function addChip(chip: Product, quantity: number, customAttrs: { material: Material, wcpa: string, fileInfo: DTO<FileInfo> }): Promise<void> {
    if (!cart.id) fetchCart();
    const data: Product & CheckoutLineItemInput = {
      ...chip,
      quantity,
      variantId: chip.variants[0].id,
      customAttributes: [{
        key: 'material',
        value: customAttrs.material,
      },
      {
        key: 'wcpa',
        value: customAttrs.wcpa,
      },
      {
        key: 'fileName',
        value: customAttrs.fileInfo.fileName,
      }]
    }
    // return api.order.addChipOrder(cart.id as number, data)
    //   .then((res) => api.order.getChipOrders(cart.id as number))
    //   .then((chips) => {
    //     setChipOrders(chips);
    //     navigate(ROUTES.ManageCart);
    //   }).catch((err) => console.error(err));
    return api.order.addChipOrder(cart.id as number, data).then(() => {
      fetchCart();
      navigate(ROUTES.ManageCart);
    }).catch((err) => console.error(err));
  }

  function editProductQuantity(product: DTO<OrderProduct>) {
    // return api.order.updateProductOrder(cart.id as number, product.id, product)
    //   .then((res) => api.order.getProductOrders(cart.id as number))
    //   .then((products) => {
    //     // console.log(res);
    //     setProductOrders(products);
    //   })
    return api.order.updateProductOrder(cart.id as number, product.id, product).then(() => {
      fetchCart();
    }).catch((err) => console.error(err));
  }

  function editChipQuantity(chip: DTO<OrderChip>) {
    // return api.order.updateChipOrder(cart.id as number, chip.id, chip)
    //   .then((res) => api.order.getChipOrders(cart.id as number))
    //   .then((chips) => {
    //     // console.log(res);
    //     setChipOrders(chips);
    //   })
    return api.order.updateChipOrder(cart.id as number, chip.id, chip).then(() => {
      fetchCart();
    }).catch((err) => console.error(err));
  }

  function removeProduct(product: DTO<OrderProduct>) {
    // return api.order.deleteProductOrder(cart.id as number, product.id)
    //   .then((res) => api.order.getProductOrders(cart.id as number))
    //   .then((products) => {
    //     // console.log(res);
    //     setProductOrders(products);
    //   })
    return api.order.deleteProductOrder(cart.id as number, product.id).then(() => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          fetchCart();
          resolve();
        }, 1000); // this is a sort of interim solution (not very elegant)
      });
      // setCart(cart => {
      //   cart.orderProducts = cart.orderProducts.filter(item => item.id !== product.id);
      //   return cart;
      // })
    }).catch((err) => console.error(err));
  }

  function removeChip(chip: DTO<OrderChip>) {
    // return api.order.deleteChipOrder(cart.id as number, chip.id)
    //   .then((res) => api.order.getChipOrders(cart.id as number))
    //   .then((chips) => {
    //     // console.log(res);
    //     setChipOrders(chips);
    //   })
    return api.order.deleteChipOrder(cart.id as number, chip.id).then(() => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          fetchCart();
          resolve();
        }, 1000);
      });
    }).catch((err) => console.error(err));
  }

  function checkout(address?: DTO<Address>): Promise<any> {
    pusher.subscribe(`checkout-${cart.checkoutToken}`).bind('checkout-completed', (data: any) => {
      // console.log('checkout completed', data);
      fetchCart();
      pusher.unsubscribe(`checkout-${cart.checkoutToken}`);
    })
    return api.customer.checkoutCart(cookies.userId, cart.id as number, address)
      .then((cart) => {
        const newWindow = window.open(`${cart.checkoutLink}`, '_blank');
      })
      .catch((err: Error) => {
        console.error(err);
      })
  }

  return {
    enabled,
    numItems,
    totalPrice,
    cart,
    productOrders,
    chipOrders,
    fetchCart,
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

export function CartContextProvider({ children }: { children?: React.ReactNode }) {
  return (
    <CartContext.Provider value={useCart()}>
      {children}
    </CartContext.Provider>
  )
}
