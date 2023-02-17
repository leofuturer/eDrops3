import React, { Suspense, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Product } from 'shopify-buy'; // TODO: waiting on @types/shopify-buy to be updated
import Loading from '../../component/ui/Loading';
import { CartContext } from '../../context/CartContext';
import { ShopifyContext } from '../../context/ShopifyContext';
import { FileInfo } from '../../types';
import {
  ewodFabServiceId
} from '../../lib/constants/products';
const DXFPreview = React.lazy(() => import('./dxf_preview'));

function ChipOrder() {
  type Material = 'ITO Glass' | 'Paper' | 'PCB';
  const material: Material[] = ['ITO Glass', 'Paper', 'PCB'];
  const [cIndex, setCIndex] = useState(0);
  const [customAttrs, setCustomAttrs] = useState<{
    material: Material
    wcpa: boolean;
    fileInfo: FileInfo;
  }>({
    material: 'ITO Glass',
    wcpa: false,
    fileInfo: {} as FileInfo
  });
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [product, setProduct] = useState<Product>({} as Product);

  const location = useLocation();
  const navigate = useNavigate();

  const shopify = useContext(ShopifyContext);
  const cart = useContext(CartContext);

  // make sure file information is passed from all files or file upload page
  useEffect(() => location.state.fileInfo ? setCustomAttrs(attrs => ({ ...attrs, fileInfo: location.state.fileInfo })) : navigate('/manage/files'), [location]);

  useEffect(() => {
    shopify.product.fetch(ewodFabServiceId) // hard coded for chip order
      .then((product) => {
        // console.log(product);
        setProduct(product);
      })
      .catch((err) => {
        console.error(err);
        // redirect to all items page if product ID is invalid
        navigate('/allItems');
      });
  }, [shopify]);

  function setCurrentIndex(index: number) {
    setCIndex(index);
    setCustomAttrs(attrs => ({ ...attrs, material: material[index] }));
  }

  function handleAddToCart() {
    setAddingToCart(true);
    cart.addChip(product, quantity, { ...customAttrs, wcpa: customAttrs.wcpa.toString() }).then(() => {
      setAddingToCart(false);
    });
  }

  return (
    <div className="container flex justify-center py-10" >
      <div className="grid grid-cols-2 md:w-2/3 gap-4">
        <div className="flex flex-col space-y-2">
          {/* DY - replace temporary image above with a preview of the uploaded PDF */}
          <div className="h-[500px]">
            <Suspense fallback={<Loading />}>
              <DXFPreview fileInfo={location.state.fileInfo} />
            </Suspense>
          </div>
          <p className="text-xs text-center">
            Disclaimer: The image above is only intended as a preview and is not guaranteed to be entirely accurate.
            The original DXF file will be transmitted to the foundry.
          </p>
        </div>
        <div className="flex flex-col space-y-4">
          <div className="">File to be fabricated:</div>
          <div>{customAttrs.fileInfo.fileName}</div>
          <div className="flex flex-col space-y-4">
            <h2 className="text-2xl">Chip Configuration Options</h2>
            <div className="grid grid-cols-3 gap-4">
              <h2 className="col-span-3 text-2xl">Process</h2>
              <div className="col-span-1 flex flex-col">
                {material.map((material, i) => (
                  <button
                    type="button"
                    key={i}
                    className={`${cIndex === i ? 'bg-primary_light text-white' : 'hover:bg-gray-200 text-primary_light hover:text-primary'} rounded-md px-4 py-2 `}
                    onClick={() => setCurrentIndex(i)}
                  >
                    <a>
                      {material}
                    </a>
                  </button>
                ))}
              </div>
              <div className="col-span-2">
                <p className={`${cIndex === 0 ? '' : 'hidden'} text-justify`}>
                  ITO glass is good substrate choice for optical applications. The ITO layer has
                  thickness of 200 nm. The glass is soda-lime glass with thickness of 0.7 nm. The
                  whole substrate is 4 inches in diameter.
                </p>
                <p className={`${cIndex === 1 ? '' : 'hidden'} text-justify`}>
                  Paper is good substrate choice for optical applications. The ITO layer has a
                  thickness of 200 nm. The glass is soda-lime glass with thickness of 0.7 nm. The
                  whole substrate is 4 inches in diameter.
                </p>
                <p className={`${cIndex === 2 ? '' : 'hidden'} text-justify`}>
                  PCB has thickness of 200 nm, which enables multiple layers of patterns. The
                  whole substrate is 4 inches in diameter.
                </p>
              </div>
            </div>
            <p className="flex items-center space-x-2">
              <input id="wcpa" type="checkbox" onChange={() => setCustomAttrs(attrs => ({ ...attrs, wcpa: !customAttrs.wcpa }))} checked={customAttrs.wcpa} />
              <label htmlFor="wcpa">With Cover Plate Assembled</label>
            </p>
          </div>
          <div className="flex space-x-2 items-center">
            <label htmlFor="quantity">Quantity:&nbsp;</label>
            <>
              <input
                id="quantity"
                type="number"
                min={1}
                className="w-8"
                value={quantity}
                onChange={(e) => setQuantity(e.target.valueAsNumber)}
              />
              { /* @ts-expect-error */}
              <span className="flex items-center">X ${product.variants && product.variants[0].price.amount} = ${product.variants && (quantity * parseFloat(product.variants[0]?.price.amount)).toFixed(2)}</span>
            </>
          </div>
          <div className="flex justify-center items-center">
            {addingToCart ? <Loading /> :
              <button
                type="button"
                className="bg-primary_light text-white px-4 py-2 rounded w-full"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            }
          </div>
          <div className="">Note: Price excludes sales tax</div>
        </div>
      </div>
    </div >
  );
}

export default ChipOrder;
