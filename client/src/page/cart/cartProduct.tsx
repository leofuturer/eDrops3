import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Loading from '../../component/ui/Loading';
import { ProductOrder } from '../../types';

function CartProduct({ product, onDelete, onChange }: { product: ProductOrder, onDelete: () => Promise<void>, onChange: (product: ProductOrder, quantity: number) => void }) {
  const [qty, setQty] = useState(product.quantity);
  const [deleting, setDeleting] = useState(false);

  // debounce quantity change useEffect
  const debouncedChange = useCallback(_.debounce((qty) => {
    onChange(product, qty);
  }, 500), []);

  useEffect(() => {
    debouncedChange(qty);
  }, [qty]);

  function handleDelete() {
    setDeleting(true);
    onDelete().then(() => setDeleting(false));
  }

  return (
    <div className="bg-white rounded-md shadow-box p-4 flex flex-row justify-between">
      <div className="flex flex-col">
        <NavLink to={`/product?id=${product.productIdShopify}`} className="text-primary_light hover:text-primary">
          <h3>{product.name}</h3>
        </NavLink>
        <div className="">
          Unit Price: ${product.price.toFixed(2)}
        </div>
        <div className="flex items-center">
          {deleting ? <Loading /> :
            <button type="button" className="bg-red-700 px-4 py-2 text-white rounded-lg" onClick={handleDelete}>Delete</button>
          }
        </div>
      </div>
      <div className="flex flex-col justify-between">
        <div className="flex flex-row items-center justify-end space-x-2">
          <label htmlFor="quantity" className="">Quantity</label>
          <input
            type="number"
            id="quantity"
            min={1}
            className="w-8 outline outline-1 rounded pl-1"
            value={qty}
            onChange={(e) => setQty(e.target.valueAsNumber)}
          />
        </div>
        <div className="">
          Subtotal: ${(product.quantity * product.price).toFixed(2)}
        </div>
      </div>
    </div>
  );
}

export default CartProduct;
