/*
    Some basic concepts here:
    product: a type of product created in the Shopify development store

    product variant: a product can have multiple product variant, the "EWOD chip manufacturing service"
    is a product variant set in the Shopify development store

    checkout: a "checkout" can be treated as bundled information used to create an order in the Shopify development store,
    it contains multiple lineItems

    lineItem: when a product variant is added to the cart (essentially added to the shopifyClient.checkout.lineItems),
    it becomes a lineItem in that "checkout"
*/

import React, { useState, useEffect, useContext, Suspense } from 'react';
import Cookies from 'js-cookie';
import {
  getCustomerCart, manipulateCustomerOrders, addOrderChipToCart,
  getChipOrders, getWorkerId, customerGetName
} from '../../api/lib/serverConfig';
import API from '../../api/lib/api';
import {
  ewodFabServiceId,
  ewodFabServiceVariantId,
} from '../../constants';
import { ShopifyContext } from '../../App';
const DXFPreview = React.lazy(() => import('./dxf_preview'));
import { CartContext } from '../../context/CartContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Product } from 'shopify-buy'; // TODO: waiting on @types/shopify-buy to be updated
import { FileInfo } from '../../types';
import Loading from '../../component/ui/Loading';

function ChipOrder() {
  const [cIndex, setCIndex] = useState(0);
  const [material, setMaterial] = useState(['ITO Glass', 'Paper', 'PCB']);
  const [materialVal, setMaterialVal] = useState('ITO Glass');
  const [quantity, setQuantity] = useState(1);
  const [wcpb, setWcpb] = useState(false);
  const [fileInfo, setFileInfo] = useState<FileInfo>({} as FileInfo);
  const [isLoading, setIsLoading] = useState(false);
  const [GLASSID, setGLASSID] = useState(0);
  const [PAPERID, setPAPERID] = useState(0);
  const [PCBID, setPCBID] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [product, setProduct] = useState<Product>({} as Product);
  const [orderInfoId, setOrderInfoId] = useState(0);
  const [shopifyClientCheckoutId, setShopifyClientCheckoutId] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  const shopify = useContext(ShopifyContext);
  const cart = useContext(CartContext);

  const [cookies] = useCookies(['userId']);

  useEffect(() => {
    if (location.state.fileInfo) {
      setFileInfo(location.state.fileInfo);
    }
    else {
      navigate('/manage/files');
    }
  }, [location]);

  useEffect(() => {
    shopify && shopify.product.fetch(ewodFabServiceId) // hard coded for chip order
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

  useEffect(() => {
    // usernames of default foundry workers
    const GLASSFW = 'glassfab';
    const PAPERFW = 'paperfab';
    const PCBFW = 'pcbfab';
    // const url = `${getWorkerId}?username=${}`
    // fetch IDs of default foundry workers
    Promise.all([
      API.Request(getWorkerId, 'GET', { username: GLASSFW }, true),
      API.Request(getWorkerId, 'GET', { username: PAPERFW }, true),
      API.Request(getWorkerId, 'GET', { username: PCBFW }, true),
    ]).then(([res1, res2, res3]) => {
      setGLASSID(res1.data);
      setPAPERID(res2.data);
      setPCBID(res3.data);
    }).catch((err) => {
      console.error(err);
    });
    API.Request(customerGetName.replace('id', cookies.userId), 'GET', {}, true)
      .then((res) => {
        // console.log(res);
        setCustomerName(`${res.data.firstName} ${res.data.lastName}`);
      })
      .catch((err) => {
        console.error(err)
      });

    API.Request(getCustomerCart.replace('id', cookies.userId), 'GET', {}, true)
      .then((res) => {
        if (res.data.id) {
          // console.log(`Have cart already with ID ${res.data.id}`);
          setOrderInfoId(res.data.id);
          setShopifyClientCheckoutId(res.data.checkoutIdClient);
        } else { // no cart, need to create one
          // create Shopify cart
          // console.log(`No cart currently exists, so need to create one`);
          shopify && shopify.checkout.create().then((res) => {
            console.log(res);
            setShopifyClientCheckoutId(res.id as string);
            const lastSlash = res.webUrl.lastIndexOf('/');
            const lastQuestionMark = res.webUrl.lastIndexOf('?');
            const shopifyCheckoutToken = res.webUrl.slice(lastSlash + 1, lastQuestionMark);
            const data = {
              checkoutIdClient: res.id,
              checkoutToken: shopifyCheckoutToken,
              checkoutLink: res.webUrl,
              // @ts-expect-error
              createdAt: res.createdAt,
              // @ts-expect-error
              lastModifiedAt: res.updatedAt,
              orderComplete: false,
              status: 'Order in progress',
              shippingAddressId: 0, // 0 to indicate no address selected yet (pk cannot be 0)
              billingAddressId: 0,
            };
            // and then create orderInfo in our backend
            return API.Request(manipulateCustomerOrders.replace('id', cookies.userId), 'POST', data, true)
          })
            .then((res) => {
              // console.log(res);
              setOrderInfoId(res.data.id);
            })
            .catch((err) => {
              console.error(err);
            });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);


  /*
        This function realize the functionality of adding the manufacture service to the cart
   
        We create a virtual product called "EWOD Chip Manufacturing Service" in Shopify development store
        and here we are actually add this product with some customized options
        set in the Shopify development store by the "customAttribute" (a feature provided by Shopify -> Product)
        to the "shopifyClient.checkout.lineItems", an API provided by js-buy-sdk.
   
        Then later in the jsx, when "shopifyClient.checkout.webUrl" is opened by a new "window" Object,
        all the items added to the "shopifyClient.checkout.lineItems" will be added to the created order(taken care of by js-buy-sdk)
        automatically when customers checkout in that page.
   
        @variantId: The variantId here is the variantId of the product set by the development
                    we hard code it in the "render()" function below and pass the value in
        @quantity: The quantity seleted by customer, put in from frontend page
    */
  function addVariantToCart(variantId: string, quantity: number) {
    setIsLoading(true);
    const lineItemsToAdd = [{
      variantId,
      quantity,
      customAttributes: [
        {
          key: 'material',
          value: materialVal,
        },
        {
          key: 'withCoverPlateAssembled',
          value: wcpb.toString(),
        },
        {
          key: 'fileName',
          value: fileInfo.fileName,
        },
      ],
    }];
    const customAttrs = {
      material: materialVal,
      withCoverPlateAssembled: wcpb.toString(),
      fileName: fileInfo.fileName,
    };
    const checkoutId = shopifyClientCheckoutId;
    shopify && shopify.checkout.addLineItems(checkoutId, lineItemsToAdd)
      .then((res) => {
        console.log('shopify addVariantToCart', res);
        let lineItemId: string;
        // find item from lineItems
        for (const lineItem of res.lineItems) {
          // @ts-expect-error NOTE: this is a bug in the shopify-buy typings
          const attrs: CustomAttribute[] = lineItem.customAttributes;
          if(attrs.every((attr) => attr.key in customAttrs && attr.value === customAttrs[attr.key])) {
            lineItemId = lineItem.id as string;
            break;
          }
        }
        // save lineItemId of the last item returned in checkout
        // const lineItemIdDecoded = checkout.lineItems[checkout.lineItems.length-1].id;
        // const lineItemId = Buffer.from(lineItemIdDecoded).toString('base64');

        // select default foundry worker based on material
        // select default foundry worker name
        let materialSpecificWorkerName = '';
        let materialSpecificWorkerId = 0;
        switch (materialVal) {
          case 'ITO Glass':
            materialSpecificWorkerId = GLASSID;
            materialSpecificWorkerName = 'edrop glassfab';
            break;
          case 'Paper':
            materialSpecificWorkerId = PAPERID;
            materialSpecificWorkerName = 'edrop paperfab';
            break;
          case 'PCB':
            materialSpecificWorkerId = PCBID;
            materialSpecificWorkerName = 'edrop pcbfab';
            break;
          default:
        }

        // create our own chip order here...
        const data = {
          orderInfoId: orderInfoId,
          productIdShopify: ewodFabServiceId,
          variantIdShopify: variantId,
          lineItemIdShopify: lineItemId,
          name: product.title,
          description: product.description,
          quantity,
          // @ts-expect-error
          price: parseFloat(product.variants[0].price.amount),
          otherDetails: JSON.stringify(customAttrs),
          process: materialVal,
          coverPlate: wcpb.toString(),
          lastUpdated: new Date().toISOString(),
          fileInfoId: fileInfo.id,
          workerId: materialSpecificWorkerId,
          workerName: materialSpecificWorkerName,
          customerName: customerName,
        };

        API.Request(addOrderChipToCart.replace('id', orderInfoId.toString()), 'POST', data, true)
          .then((res) => API.Request(getChipOrders.replace('id', orderInfoId.toString()), 'GET', {}, true))
          .then((res) => {
            const quantity = res.data.reduce((prev: number, curr: { quantity: number }) => prev + curr.quantity, 0);
            cart.setChipQuantity(quantity);
            navigate('/manage/cart');
          })
          .catch((err) => {
            console.error(err);
          });
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }

  function setCurrentIndex(index: number) {
    setCIndex(index);
    setMaterialVal(material[index]);
  }

  const variantId = ewodFabServiceVariantId;
  return (
    <div className="container flex justify-center py-10">
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
          <div>{fileInfo.fileName}</div>
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
              <input id="wcpb" type="checkbox" onChange={(e) => setWcpb(!wcpb)} checked={wcpb} />
              <label htmlFor="wcpb">With Cover Plate Assembled</label>
            </p>
          </div>
          <div className="flex space-x-2 items-center">
            <label htmlFor="quantity">Quantity:&nbsp;</label>
            {product && (
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
                <span className="flex items-center">X ${product.variants ? product.variants[0].price.amount : <Loading />} = ${product.variants ? (quantity * parseFloat(product.variants[0]?.price.amount)).toFixed(2) : <Loading />}</span>
              </>
            )}
          </div>
          <div className="flex justify-center items-center">
            {isLoading
              ? <Loading />
              : (
                <button
                  type="button"
                  className="bg-primary_light text-white px-4 py-2 rounded w-full"
                  onClick={(e) => addVariantToCart(variantId, quantity)}
                >
                  Add to Cart
                </button>
              )
            }
          </div>
          <div className="">Note: Price excludes sales tax</div>
        </div>
      </div>
    </div>
  );
}

export default ChipOrder;
