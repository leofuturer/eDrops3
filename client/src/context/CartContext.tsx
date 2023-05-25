import React, { useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { CustomAttribute, LineItem, LineItemToAdd, Product } from 'shopify-buy';
import { api } from '@/api';
import { Address, Customer, DTO, FileInfo, OrderChip, OrderInfo, OrderProduct } from '@/types';
import { PusherContext } from '@/context';
import { ROUTES } from '@/router/routes';
import { Material } from '@/types/chip';

const useCart = () => {
  const [cart, setCart] = useState<DTO<OrderInfo>>({} as DTO<OrderInfo>);
  const [productOrders, setProductOrders] = useState<DTO<OrderProduct>[]>([]);
  const [chipOrders, setChipOrders] = useState<DTO<OrderChip>[]>([]);
  const [numItems, setNumItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const enabled = true;

  const pusher = useContext(PusherContext);

  const [cookies] = useCookies(['userId']);
  const navigate = useNavigate();

  async function createCart() {
    api.customer.createCart(cookies.userId).then((cart) => {
      setCart(cart)
    }).catch((err) => {
      console.error(err);
    });
  }

  function fetchCart() {
    api.customer.getCart(cookies.userId).then((cart) => {
      cart ? setCart(cart) : createCart();
    }).catch((err) => console.error(err));
  }

  // create cart if it doesn't exist, otherwise get cart info
  useEffect(() => {
    if (cookies.userId && !cart.id) {
      fetchCart();
    }
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
  async function addProduct(product: Product, quantity: number): Promise<void> {
    if (!cart.checkoutIdClient) await createCart();
    // console.log(product)
    // console.log(cart)
    const data: Product & LineItemToAdd = {
      ...product,
      quantity,
      variantId: product.variants[0].id,
    }

    return api.order.addProductOrder(cart.id as number, data)
      .then((product) => api.order.getProductOrders(cart.id as number))
      .then((products) => {
        // console.log(res);
        setProductOrders(products);
        navigate(ROUTES.ManageCart);
      }).catch((err) => console.error(err));
  }

  async function addChip(chip: Product, quantity: number, customAttrs: { material: Material, wcpa: string, fileInfo: FileInfo }): Promise<void> {
    if (!cart.checkoutIdClient) await createCart();
    const data: Product & LineItemToAdd = {
      ...chip,
      quantity,
      variantId: chip.variants[0].id,
      customAttributes: [{
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
      }]
    }
    return api.order.addChipOrder(cart.id as number, data)
      .then((res) => api.order.getChipOrders(cart.id as number))
      .then((chips) => {
        setChipOrders(chips);
        navigate(ROUTES.ManageCart);
      }).catch((err) => console.error(err));
  }

  function editProductQuantity(product: DTO<OrderProduct>) {
    return api.order.updateProductOrder(cart.id as number, product.id, product)
      .then((res) => api.order.getProductOrders(cart.id as number))
      .then((products) => {
        // console.log(res);
        setProductOrders(products);
      })
  }

  function editChipQuantity(chip: DTO<OrderChip>) {
    return api.order.updateChipOrder(cart.id as number, chip.id, chip)
      .then((res) => api.order.getChipOrders(cart.id as number))
      .then((chips) => {
        // console.log(res);
        setChipOrders(chips);
      })
  }

  function removeProduct(product: DTO<OrderProduct>) {
    return api.order.deleteProductOrder(cart.id as number, product.id)
      .then((res) => api.order.getProductOrders(cart.id as number))
      .then((products) => {
        // console.log(res);
        setProductOrders(products);
      })
  }

  function removeChip(chip: DTO<OrderChip>) {
    return api.order.deleteChipOrder(cart.id as number, chip.id)
      .then((res) => api.order.getChipOrders(cart.id as number))
      .then((chips) => {
        // console.log(res);
        setChipOrders(chips);
      })
  }

  function checkout(address: DTO<Address>): Promise<any> {
    pusher.subscribe(`checkout-${cart.checkoutToken}`).bind('checkout-completed', (data: any) => {
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
