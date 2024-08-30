import React, { Suspense, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Product } from 'shopify-buy'; // TODO: waiting on @types/shopify-buy to be updated
import Loading from '@/component/ui/Loading';
import { CartContext } from '@/context/CartContext';
import { ewodFabServiceId } from '@/lib/constants/products';
import { ROUTES } from '@/router/routes';
import { api, DTO, FileInfo } from '@edroplets/api';
import { Material } from '@/types/chip';
import { useCookies } from 'react-cookie';
const DXFPreview = React.lazy(() => import('./DXFPreview'));

export function ChipOrder() {
  const material: Material[] = [Material.Glass, Material.PCB, Material.Paper];
  const [customAttrs, setCustomAttrs] = useState<{
    material: Material
    wcpa: boolean;
    fileInfo: DTO<FileInfo>;
  }>({
    material: Material.Glass,
    wcpa: false,
    fileInfo: {} as DTO<FileInfo>
  });
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [product, setProduct] = useState<Product>({} as Product);

  const [cookies] = useCookies(['userId']);
  const navigate = useNavigate();

  const cart = useContext(CartContext);

  const { id } = useParams();

  // make sure file information is passed from all files or file upload page
  useEffect(() => {
    if (!id) {
      navigate(ROUTES.ManageFiles);
      return;
    }
    if (!cookies.userId) {
      api.customer.guestGetFile(parseInt(id)).then((fileInfo) => {
        setCustomAttrs(attrs => ({ ...attrs, fileInfo }));
      });
      return;
    }
    api.customer.getFile(cookies.userId, parseInt(id)).then((fileInfo) => {
      setCustomAttrs(attrs => ({ ...attrs, fileInfo }));
    });
  }, [id]);

  useEffect(() => {
    api.product.get(ewodFabServiceId) // hard coded for chip order
      .then((product) => {
        // console.log(product);
        setProduct(product);
      })
      .catch((err) => {
        console.error(err);
        // redirect to all items page if product ID is invalid
        navigate(ROUTES.Products);
      });
  }, []);

  function setMaterial(material: Material) {
    setCustomAttrs(attrs => ({ ...attrs, material }));
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
          <div className="">
            <Suspense fallback={<Loading />}>
              <DXFPreview fileInfo={customAttrs.fileInfo} />
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
            <h2 className="text-2xl">Chip Substrate Options</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1 flex flex-col">
                {material.map((material, i) => (
                  <button
                    type="button"
                    key={i}
                    className={`${material == customAttrs.material ? 'bg-primary_light text-white' : 'hover:bg-gray-200 text-primary_light hover:text-primary'} rounded-md px-4 py-2 `}
                    onClick={() => setMaterial(material)}
                  >
                    <a>
                      {material}
                    </a>
                  </button>
                ))}
              </div>
              <div className="col-span-2">
                <p className={`${customAttrs.material === Material.Glass ? '' : 'hidden'} text-justify`}>
                  ITO glass-based chip is suitable for applications that require optical sensors.
                  It features a transparent substrate and highly smooth surface.
                  Currently, a 4-inch circular substrate is supported.
                </p>
                <p className={`${customAttrs.material === Material.PCB ? '' : 'hidden'} text-justify`}>
                  PCB-based chip is suitable for applications that require high throughput or complex protocols.
                  It features up to 1000 electrodes.
                  Currently, a 103mm x 68mm rectangular substrate is supported.
                </p>
                <p className={`${customAttrs.material === Material.Paper ? '' : 'hidden'} text-justify`}>
                  Paper-based chip is suitable for low-cost applications or  proof-of-concept experiments.
                  It features fast turn around time and affordability.
                  Currently, a 103mm x 68mm rectangular substrate is supported.
                </p>
              </div>
            </div>
            <p className="flex items-center space-x-2">
              <input id="wcpa" type="checkbox" onChange={() => setCustomAttrs(attrs => ({ ...attrs, wcpa: !customAttrs.wcpa }))} checked={customAttrs.wcpa} />
              <label htmlFor="wcpa">With Cover Plate Assembled</label>
            </p>
          </div>
          <div className="flex">
            Price: {cart.enabled ? `${product.variants && product.variants[0].price.amount}` : 'Coming soon'}
          </div>
          <div className="flex space-x-2 items-center">
            <label htmlFor="quantity">Quantity:&nbsp;</label>
            <>
              <input
                id="quantity"
                type="number"
                min={1}
                className="w-8 outline outline-1 rounded-md pl-1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.valueAsNumber)}
              />
              {cart.enabled &&
                <span className="flex items-center">X ${product.variants && product.variants[0].price.amount} = ${product.variants && (quantity * product.variants[0]?.price.amount).toFixed(2)}</span>
              }
            </>
          </div>
          <div className="flex justify-center items-center">
            {addingToCart ? <Loading /> :
              <button
                type="button"
                className="bg-primary_light text-white px-4 py-2 rounded w-full"
                onClick={() => cart.enabled && handleAddToCart()}
              >
                {cart.enabled ? 'Add to Cart' : 'Coming soon'}
              </button>
            }
          </div>
          <div className="text-sm">Note: Price excludes sales tax</div>
        </div>
      </div>
    </div >
  );
}