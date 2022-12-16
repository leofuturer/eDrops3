import React, { useContext, useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  univEwodChipId,
  univEwodChipId5,
  univEwodChipId10,
  univEwodChipWithCoverPlate,
  univEwodChipWithoutCoverPlate,
  controlSysId5,
  testBoardId5,
  pcbChipId5,
  controlSysId10,
  testBoardId10,
  pcbChipId10,
  productIdsJson,
  getProductType
} from '../../constants';
import {
  getCustomerCart,
  manipulateCustomerOrders,
  addOrderProductToCart, returnOneItem,
  getProductOrders
} from '../../api/serverConfig';
import API from '../../api/api';
import { Shopify } from '../../App';
import { CartContext } from '../../context/CartContext';
import { Product as ProductType } from 'shopify-buy';
import { useCookies } from 'react-cookie';
import { Buffer } from 'buffer';

function Product() {
  const context = useContext(CartContext);

  const [fetchedProduct, setFetchedProduct] = useState(false);
  const [product, setProduct] = useState<ProductType>({} as ProductType);
  const [orderInfoId, setOrderInfoId] = useState("");
  const [shopifyClientCheckoutId, setShopifyClientCheckoutId] = useState(undefined);
  const [quantity, setQuantity] = useState(1);
  const [bundleSize, setBundleSize] = useState(1);
  const [otherDetails, setOtherDetails] = useState({});
  const [addedToCart, setAddedToCart] = useState(false);
  const [withCoverPlateAssembled, setWithCoverPlateAssembled] = useState(false);

  const navigate = useNavigate();

  const [cookies] = useCookies(['userId', 'access_token'])

  useEffect(() => {
    setOtherDetails(otherDetails => ({
      ...otherDetails,
      withCoverPlateAssembled: withCoverPlateAssembled
    }))
  }, [withCoverPlateAssembled])

  function fetchProductData(shopifyProductId: string) {
    const url = `${returnOneItem}?productId=${shopifyProductId}`;
    API.Request(url, 'GET', {}, false)
      .then((res) => {
        // console.log(res);
        setProduct(res.data);
        setFetchedProduct(true);
        setAddedToCart(true);
        if ([univEwodChipId, univEwodChipId5, univEwodChipId10].includes(shopifyProductId)) {
          setOtherDetails({
            withCoverPlateAssembled: false,
          });
        }
        if ([controlSysId5, testBoardId5, pcbChipId5, univEwodChipId5].includes(shopifyProductId)) {
          setBundleSize(5);
        }
        if ([controlSysId10, testBoardId10, pcbChipId10, univEwodChipId10].includes(shopifyProductId)) {
          setBundleSize(10);
        }
      }).catch((err) => {
        console.error(err);
        // redirect to all items page if product ID is invalid
        navigate('/allItems');
      });
  }

  const location = useLocation();
  const ref = useRef(location);

  useEffect(() => {
    if (location.search !== ref.current.search) {
      fetchProductData(location.search.slice(4));
    }
    ref.current.search = location.search;
  }, []);

  useEffect(() => {
    if (location.search === '') {
      navigate('/allItems'); // redirect if no ID provided
      return;
    } else {
      fetchProductData(location.search.slice(4));
    }
  }, []);

  function handleBundleChange(bsize: number) {
    setBundleSize(bsize)
    const productType = getProductType(product.id);
    fetchProductData(productIdsJson[productType][bsize]);
  }

  function handleOptionsChange(key: string, value: any) {
    const newData = {
      [key]: value,
    };
    setOtherDetails(otherDetails => Object.assign({}, otherDetails, newData));
  }

  function handleGetCart() {
    /**
         * Do not allow if not logged in or nonpositive quantity to add.
         *
         * Retrieve customer's cart, or create one if not already present
         * Then, create Shopify checkout
         * Then, call addItemToCart() with orderInfo ID (our own cart id) and
         *      Shopify checkout ID
         */
    if (!cookies.access_token) {
      alert('Login required to add item to cart');
      return;
    }
    setAddedToCart(false);
    API.Request(getCustomerCart.replace('id', cookies.userId), 'GET', {}, true)
      .then((res) => {
        console.log(res);
        if (res.data.id) {
          // console.log(`Have cart already with ID ${res.data.id}`); console.log(res);
          setOrderInfoId(res.data.id);
          setShopifyClientCheckoutId(res.data.checkoutIdClient);
          addItemToCart(res.data.id,
            res.data.checkoutIdClient,
            quantity);
        } else {
          // no cart, need to create one
          // create Shopify cart
          // console.log(`No cart currently exists, so need to create one`);
          Shopify.getInstance().getPrivateValue()
            .then((instance) => {
              instance.checkout.create()
                .then((res) => {
                  console.log(res);
                  setShopifyClientCheckoutId(res.id);
                  const lastSlash = res.webUrl.lastIndexOf('/');
                  const lastQuestionMark = res.webUrl.lastIndexOf('?');

                  const shopifyCheckoutToken = res.webUrl.slice(lastSlash + 1, lastQuestionMark);
                  // console.log(shopifyCheckoutToken);
                  const data = {
                    checkoutIdClient: res.id,
                    checkoutToken: shopifyCheckoutToken,
                    checkoutLink: res.webUrl,
                    createdAt: res.createdAt,
                    lastModifiedAt: res.updatedAt,
                    orderComplete: false,
                    status: 'Order in progress',
                    // "customerId": cookies.userId,
                    shippingAddressId: 0, // 0 to indicate no address selected yet (pk cannot be 0)
                    billingAddressId: 0,
                  };
                  // and then create orderInfo in our backend
                  API.Request(manipulateCustomerOrders.replace('id', cookies.userId), 'POST', data, true)
                    .then((res) => {
                      // console.log(res);
                      setOrderInfoId(res.data.id);
                      addItemToCart(res.data.id,
                        res.data.checkoutIdClient,
                        quantity);
                    })
                    .catch((err) => {
                      setAddedToCart(true);
                      console.error(err);
                    });
                })
                .catch((err) => {
                  setAddedToCart(true);
                  console.error(err);
                });
            })
            .catch((err) => {
              setAddedToCart(true);
              console.error(err);
            });
        }
      })
      .catch((err) => {
        setAddedToCart(true);
        console.error(err);
      });
  }

  /**
     * Function to update Shopify checkout and our own cart
     * @param {number} orderInfoId - id of orderInfo model in our DB
     * @param {string} shopifyClientCheckoutId - id of Shopify client checkout
     * @param {number} quantity - number of items to add
     */
  function addItemToCart(orderInfoId: number, shopifyClientCheckoutId: string, quantity: number) {
    // add to shopify cart, and then add to our own cart
    const customShopifyAttributes = [];
    let customServerOrderAttributes = '';
    for (const [k, v] of Object.entries(otherDetails).sort((a, b) => a[0].localeCompare(b[0]))) {
      if (v !== undefined) {
        customShopifyAttributes.push({ key: k, value: v });
        customServerOrderAttributes += `${k}: ${v}\n`;
      }
    }

    const variantId = product.id !== productIdsJson['UNIVEWODCHIPID'][bundleSize]
      ? product.variants[0].id
      : (otherDetails.withCoverPlateAssembled
        ? productIdsJson['UNIVEWODCHIPWITHCOVERPLATE'][bundleSize]
        : productIdsJson['UNIVEWODCHIPWITHOUTCOVERPLATE'][bundleSize]);
    // console.log(variantId);
    const lineItemsToAdd = [{
      variantId,
      quantity,
    }];
    Shopify.getInstance().getPrivateValue()
      .then((instance) => {
        instance.checkout.addLineItems(shopifyClientCheckoutId, lineItemsToAdd)
          .then((res) => {
            let lineItemId;
            console.log(res);
            for (let i = 0; i < res.lineItems.length; i++) {
              if (Buffer.from(res.lineItems[i].variant.id).toString('base64') === variantId) {
                lineItemId = Buffer.from(res.lineItems[i].id).toString('base64');
                break;
              }
            }

            const data = {
              orderInfoId,
              productIdShopify: product.id,
              variantIdShopify: variantId,
              lineItemIdShopify: lineItemId,
              description: product.description,
              quantity,
              price: parseFloat(product.variants[0].price),
              name: product.title,
              otherDetails: customServerOrderAttributes,
            };
            // console.log(data);
            let url = addOrderProductToCart.replace('id', orderInfoId);
            API.Request(url, 'POST', data, true)
              .then((res) => {
                url = getProductOrders.replace('id', orderInfoId);
                API.Request(url, 'GET', {}, true)
                  .then((res) => {
                    // console.log(res);
                    const quantity = res.data.reduce((prev, curr) => prev + curr.quantity, 0);
                    context.setProductQuantity(quantity);
                    context.setCartQuantity();
                    navigate('/manage/cart');
                  })
                  .catch((err) => {
                    console.error(err);
                  });
                setAddedToCart(true);
              })
              .catch((err) => {
                console.error(err);
                setAddedToCart(true);
              });
          })
          .catch((err) => {
            console.error(err);
            setAddedToCart(true);
          });
      })
      .catch((err) => {
        console.error(err);
        setAddedToCart(true);
      });
  }

  const desiredProductId = location.search.slice(4); // get id after id?=
  return (
    <div className="flex items-center justify-center p-10">
      {fetchedProduct
        ? (
          <div className="grid grid-cols-2 w-2/3 gap-4">
            <div className="col-span-1 flex flex-col">
              <img alt={product.title} src={product.variants[0].image.src} className="w-full aspect-square" />
            </div>
            <div className="col-span-1 flex flex-col justify-between">
              <div className="flex flex-col space-y-2">
                <NavLink to="/allItems" className="text-primary_light hover:text-primary mb-4"><i className="fa fa-arrow-left" /> Return to all products</NavLink>
                <h2 className="text-2xl">{product.title}</h2>
                <p className="text-justify">
                  {product.description}
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                {[univEwodChipId, univEwodChipId5, univEwodChipId10].includes(desiredProductId)
                  ? (
                    <div className="chip-config">
                      <h3>Item Options</h3>
                      <div className="config-items">
                        <input type="checkbox" id="coverPlate" checked={withCoverPlateAssembled} onChange={(e) => setWithCoverPlateAssembled(e.target.checked)} />
                        <label htmlFor="coverPlate" className="option-detail">With Cover Plate Assembled</label>
                      </div>
                    </div>
                  )
                  : null}

                <div className="flex justify-between items-center">
                  <div className="text-lg font-bold">
                    Price: $
                    {product.variants[0].price}
                  </div>
                  <div className="flex space-x-4">
                    <div className="flex space-x-1">
                      <label htmlFor="quantity" className="font-bold">Quantity:</label>
                      <input
                        type="number"
                        id="quantity"
                        className="outline outline-1 rounded w-8 pl-1 h-full"
                        value={quantity}
                        min={1}
                        onChange={(e) => setQuantity(e.target.valueAsNumber)}
                      />
                    </div>
                    <div className="flex space-x-1">
                      <label htmlFor="bundlesize" className="font-bold">Bundle Size:</label>
                      <select id="bundlesize" name="bundlesize" value={bundleSize} onChange={(e) => handleBundleChange(parseInt(e.target.value, 10))}
                        className="outline outline-1 rounded h-full">
                        <option value="1">1</option>
                        <option value="5">5</option>
                        <option value="10">10</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div>
                  {addedToCart
                    ? (
                      <button
                        type="button"
                        className="bg-primary_light hover:bg-primary text-white rounded-lg w-full px-4 py-2"
                        onClick={handleGetCart}
                      >
                        Add to Cart
                      </button>
                    )
                    : <img className="loading-GIF" src="/img/loading80px.gif" alt="" />}
                </div>
                <div className="text-sm text-gray-400">Note: Price excludes sales tax</div>
              </div>
            </div>
          </div>
        )
        : <img className="loading-GIF" src="/img/loading80px.gif" alt="" />}
    </div>
  );
}

export default Product;