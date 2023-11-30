import { Suspense } from 'react';
import { Await } from 'react-router-dom';
import { Product } from 'shopify-buy';
import SEO from '@/component/header/seo';
import ItemCard from './ItemCard';
import ItemLoad from './ItemLoad';
import { metadata } from './metadata';
import { api } from '@edroplets/api';

export function Products() {
  const products = api.product.getAll();

  return (
    <div className="flex flex-col items-center space-y-10 mb-10">
      <SEO
        title="eDroplets | Products"
        description=""
        metadata={metadata}
      />
      <h3 className="border-b-2 border-secondary text-secondary w-1/3 min-w-min text-4xl font-bold text-center py-8">Products</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 w-full px-8 lg:px-0 lg:w-3/4">
        <Suspense fallback={<><ItemLoad /><ItemLoad /><ItemLoad /></>}>
          <Await
            resolve={products}
            errorElement={<><ItemLoad /><ItemLoad /><ItemLoad /></>}
            children={(resolvedProducts) => resolvedProducts.map((p: Product) =>
              <ItemCard product={p} key={p.id} />
            )}
          />
        </Suspense>
      </div>
    </div>
  );
}
