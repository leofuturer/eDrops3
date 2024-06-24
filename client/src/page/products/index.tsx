import React, { Suspense } from 'react';
import { Await } from 'react-router-dom';
import { Product } from 'shopify-buy';
import SEO from '@/component/header/seo';
import ItemCard from './ItemCard';
import ItemLoad from './ItemLoad';
import { metadata } from './metadata';
import { useProducts } from './ProductsContext';

export function Products() {
  const { products, loading, error } = useProducts();

  return (
    <div className="flex flex-col items-center space-y-10 mb-10">
      <SEO
        title="eDroplets | Products"
        description=""
        metadata={metadata}
      />
      <h3 className="border-b-2 border-secondary text-secondary w-1/3 min-w-min text-4xl font-bold text-center py-8">Products</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 w-full px-8 lg:px-0 lg:w-3/4">
        {loading && <ItemLoad />}
        {products && products.map((product: Product) => (
            <ItemCard product={product} key={product.id} />
          ))}
      </div>
    </div>
  );
}

export default Products;
