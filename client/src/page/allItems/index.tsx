import React, { Suspense, useEffect, useState } from 'react';
import ItemCard from './ItemCard';
import { returnAllItems } from '../../api';
import { request } from '../../api';
import SEO from '../../component/header/seo';
import { metadata } from './metadata';
import { Product } from 'shopify-buy';
import Loading from '../../component/ui/Loading';
import { Await } from 'react-router-dom';
import ItemLoad from './ItemLoad';

function AllItems() {
  // const [products, setProducts] = useState<Product[]>([]);

  const products = request(returnAllItems, 'GET', {}, false).then((res) => res.data)

  return (
    <div className="flex flex-col items-center space-y-10 mb-10">
      <SEO
        title="eDrops | Products"
        description=""
        metadata={metadata}
      />
      <h3 className="border-b-2 border-secondary text-secondary w-1/3 min-w-min text-4xl font-bold text-center py-8">Products</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 w-2/3">
        <Suspense fallback={<><ItemLoad /><ItemLoad /><ItemLoad /></>}>
          <Await
            resolve={products}
            errorElement={<ItemLoad />}
            children={(resolvedProducts) => resolvedProducts.map((p) =>
              <ItemCard product={p} key={p.id} />
            )}
          />
        </Suspense>
      </div>
    </div>
  );
}

export default AllItems;
