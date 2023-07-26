import _ from 'lodash';
import { useCallback, useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Loading from '@/component/ui/Loading';
import { DTO, OrderChip } from '@/types';
import { ROUTES, idRoute } from '@/router/routes';
import { CartContext } from '@/context';

export function CartChip({ chip }: { chip: DTO<OrderChip> }) {
  const [qty, setQty] = useState(chip.quantity);
  const [deleting, setDeleting] = useState(false);

  const cart = useContext(CartContext);

  // debounce quantity change useEffect
  const debouncedChange = _.debounce((qty) => {
    cart.editChipQuantity({...chip, quantity: qty});
  }, 250);

  useEffect(() => {
    debouncedChange(qty);
  }, [qty]);

  function handleDelete() {
    setDeleting(true);
    cart.removeChip(chip).then(() => setDeleting(false));
  }

  function parseOtherDetails(otherDetails: string) {
    const details = JSON.parse(otherDetails);
    return <>
      <p>Material: {details?.material}</p>
      <p>With Cover Plate Assembled: {details?.wcpa}</p>
      <p>File Name: {details?.fileName}</p>
    </>
  }

  return (
    <div className="bg-white rounded-md shadow-box p-4 flex flex-row justify-between">
      <div className="flex flex-col">
        <NavLink to={idRoute(ROUTES.ChipFab, chip.fileInfoId)} className="text-primary_light hover:text-primary">
          <h3>{chip.name}</h3>
        </NavLink>
        <div className="">
          Unit Price: ${chip.price.toFixed(2)}
        </div>
        {chip.otherDetails &&
          <>
            <div className="">Additional information:</div>
            {parseOtherDetails(chip.otherDetails)}
          </>
        }
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
          Subtotal: ${(chip.quantity * chip.price).toFixed(2)}
        </div>
      </div>
    </div>
  );
}

export default CartChip;
