import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Loading from '../../component/ui/Loading';
import { ChipOrder } from '../../types';

function CartChip({ chip, onDelete, onChange }: { chip: ChipOrder, onDelete: () => Promise<void>, onChange: (chip: ChipOrder, quantity: number) => void }) {
  const chipFabState = {
    fileInfo: {
      id: chip.fileInfoId,
      fileName: chip.otherDetails ? JSON.parse(chip.otherDetails).fileName : '',
    },
  };

  const [qty, setQty] = useState(chip.quantity);
  const [deleting, setDeleting] = useState(false);

  // debounce quantity change useEffect
  const debouncedChange = useCallback(_.debounce((qty) => {
    onChange(chip, qty);
  }, 500), []);

  useEffect(() => {
    debouncedChange(qty);
  }, [qty]);

  function handleDelete() {
    setDeleting(true);
    onDelete().then(() => setDeleting(false));
  }

  function parseOtherDetails(otherDetails: string) {
    const details = JSON.parse(otherDetails);
    return <>
      <p>Material: {details?.material}</p>
      <p>With Cover Plate Assembled: {details?.wcpa}</p>
      <p>File Name: {details?.fileInfo.fileName}</p>
    </>
  }

  return (
    <div className="bg-white rounded-md shadow-box p-4 flex flex-row justify-between">
      <div className="flex flex-col">
        <NavLink to="/chipfab" state={chipFabState} className="text-primary_light hover:text-primary">
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
