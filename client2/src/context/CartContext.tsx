import React, { useEffect, useState } from 'react';

interface Cart {
  items: number;
  setProductQuantity: (quantity: number) => void;
  setChipQuantity: (quantity: number) => void;
}

const useCart = () => {
  const [cartItems, setCartItems] = useState(0);
  const [productItems, setProductItems] = useState(0);
  const [chipItems, setChipItems] = useState(0);

  useEffect(() => {
    setCartItems(productItems + chipItems);
  }, [productItems, chipItems]);

  return {
    items: cartItems,
    setProductQuantity: (quantity: number) => {
      setProductItems(quantity);
    },
    setChipQuantity: (quantity: number) => {
      setChipItems(quantity);
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
