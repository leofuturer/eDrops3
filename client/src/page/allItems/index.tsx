import React, { useEffect, useState } from 'react';
import ItemCard from './itemCard';
import { returnAllItems } from '../../api/lib/serverConfig';
import API from '../../api/lib/api';
import SEO from '../../component/header/SEO';
import { metadata } from './metadata';
import { Product } from 'shopify-buy';
import Loading from '../../component/ui/Loading';

function AllItems() {

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    API.Request(returnAllItems, 'GET', {}, false)
      .then((res) => {
        if (res.data) {
          setProducts(res.data);
        }
      }).catch((err) => console.log(err));
  }, []);

  return (
    <div className="flex flex-col items-center space-y-10 mb-10">
      <SEO
        title="eDrops | Products"
        description=""
        metadata={metadata}
      />
      <h3 className="border-b-2 border-secondary text-secondary w-1/3 min-w-min text-4xl font-bold text-center py-8">Products</h3>
      <div className="grid grid-cols-3 gap-10 w-2/3">
        {products
          ? products.map((product, index) => <ItemCard product={product} key={product.id} />)
          : <Loading />}
      </div>
    </div>
  );
}

export default AllItems;
