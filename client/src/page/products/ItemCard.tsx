import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Product } from 'shopify-buy';
import { CartContext } from '../../context/CartContext';
import { ROUTES, idRoute } from '@/router/routes';

function ItemCard({ product }: { product: Product }) {
  const cart = useContext(CartContext);
  const productLink = idRoute(ROUTES.Product, product.id as string);

  return (
    <div className="border-md shadow-box p-4 flex flex-col items-center space-y-2">
      <NavLink to={productLink} className="text-center w-2/3">
        <h4 className="text-lg text-primary_light hover:text-primary">{product?.title}</h4>
      </NavLink>
      <NavLink to={productLink}>
        <img
          alt={product?.title}
          className="w-full aspect-square pointer-events-none max-h-full h-80"
          src={product?.variants && product?.variants[0].image.src}
        />
      </NavLink>
      <p className="line-clamp-4 text-sm">
        {product?.description}
      </p>
      {cart.enabled &&
        <p className="product-price">
          ${product?.variants && product?.variants[0].price}
        </p>
      }
      <NavLink to={productLink}>
        <button type="button" className="bg-primary_light text-white px-4 py-2 rounded-md hover:bg-primary">Details</button>
      </NavLink>
    </div>
  );
}

export default ItemCard;
