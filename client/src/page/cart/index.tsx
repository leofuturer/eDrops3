import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import SEO from '../../component/header/seo';
import ManageRightLayout from '../../component/layout/ManageRightLayout';
import { CartContext } from '../../context/CartContext';
import CartChip from './cartChip';
import CartProduct from './cartProduct';
import { metadata } from './metadata.js';

function Cart() {
  const cart = useContext(CartContext);

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
            <button type="button" className="bg-primary rounded-lg text-white px-4 py-2" onClick={() => cart.checkout()}>Checkout</button>
          </div>
          <div className="flex flex-col space-y-4">
            {cart.cart?.orderProducts?.length && cart.cart.orderProducts.map((product, index) => <CartProduct
              key={product.id}
              product={product}
              onChange={cart.editProductQuantity}
              onDelete={() => cart.removeProduct(product)}
            />)}
            {cart.cart?.orderChips?.length && cart.cart.orderChips.map((chip, index) => <CartChip
              key={chip.id}
              chip={chip}
              onChange={cart.editChipQuantity}
              onDelete={() => cart.removeChip(chip)}
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
