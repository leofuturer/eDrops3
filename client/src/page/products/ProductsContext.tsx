import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from 'shopify-buy';
import { api } from '@edroplets/api';

interface ProductsContextProps {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const ProductsContext = createContext<ProductsContextProps | undefined>(undefined);

export const useProducts = (): ProductsContextProps => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

interface ProductsProviderProps {
  children: ReactNode;
}

export const ProductsProvider: React.FC<ProductsProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.product.getAll()
      .then((fetchedProducts: Product[]) => {
        setProducts(fetchedProducts);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <ProductsContext.Provider value={{ products, loading, error }}>
      {children}
    </ProductsContext.Provider>
  );
};