import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Product } from 'shopify-buy';

function ItemCard({ product }: { product: Product }) {
  return (
    <div className="border-md shadow-box p-4 flex flex-col items-center space-y-2">
      <NavLink to={`/product?id=${product.id}`} className="text-center w-2/3">
        <h4 className="text-lg text-primary_light hover:text-primary">{product.title}</h4>
      </NavLink>
      <NavLink to={`/product?id=${product.id}`}>
        <img
          alt={product.title}
          className="w-full aspect-square pointer-events-none"
          src={product.variants[0].image.src}
        />
      </NavLink>
      <p className="line-clamp-4 text-sm">
        {product.description}
      </p>
      <p className="product-price">
        ${product.variants[0].price}
      </p>
      <NavLink to={`/product?id=${product.id}`}>
        <button type="button" className="bg-primary_light text-white px-4 py-2 rounded-md hover:bg-primary">Details</button>
      </NavLink>
    </div>
  );
}

export default ItemCard;
