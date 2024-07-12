import { Suspense, useContext, useEffect } from 'react';
import { Await, NavLink, useNavigate } from 'react-router-dom';
import SEO from '@/component/header/seo';
import ManageRightLayout from '@/component/layout/ManageRightLayout';
import { CartContext } from '@/context/CartContext';
import CartChip from './CartChip';
import CartProduct from './CartProduct';
import { metadata } from './metadata';
import { ROUTES } from '@/router/routes';

export function Cart() {
  useEffect(() => {
    cart.fetchCart();
  }, [])

  const cart = useContext(CartContext);

  const navigate = useNavigate();

  return (
    <ManageRightLayout title="Cart">
      <SEO
        title="eDroplets | Cart"
        description=""
        metadata={metadata}
      />
      {cart.cart?.orderProducts && cart.cart?.orderProducts?.length !== 0 || cart.cart?.orderChips && cart.cart?.orderChips?.length !== 0 ?
        (<div className="flex flex-col w-full space-y-4 -mt-4">
          <div className="flex flex-row justify-end items-center">
            <button id="checkout" type="button" className="bg-primary rounded-lg text-white px-4 py-2" onClick={() => navigate(ROUTES.BeforeCheckout)}>Checkout</button>
          </div>
          <div className="flex flex-col space-y-4">
            {cart.cart?.orderProducts?.length && cart.cart.orderProducts.map((product, index) =>
              <CartProduct
                key={product.id}
                product={product}
              />)}
            {cart.cart?.orderChips?.length && cart.cart.orderChips.map((chip, index) =>
              <CartChip
                key={chip.id}
                chip={chip}
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
        </div>)
        : (<p className="text-center">Your cart is currently empty. You can either <NavLink to={ROUTES.Upload} className="text-primary_light hover:text-primary">upload a file</NavLink> for a custom chip order or <NavLink to={ROUTES.Products} className="text-primary_light hover:text-primary">view our products</NavLink>.</p>)}
    </ManageRightLayout>
  );
}