import { Buffer } from 'buffer';
import { useContext, useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Product as ProductType } from 'shopify-buy';
import { request } from '../../api';
import {
  addOrderProductToCart, getCustomerCart, getProductOrders, manipulateCustomerOrders, returnOneItem
} from '../../api';
import { ShopifyContext } from '../../context/ShopifyContext';
import Loading from '../../component/ui/Loading';
import {
  controlSysId10, controlSysId5, getProductType, pcbChipId10, pcbChipId5, productIdsJson, testBoardId10, testBoardId5
} from '../../utils/constants';
import { CartContext } from '../../context/CartContext';

function Product() {
  const [productId, setProductId] = useState("");
  const [product, setProduct] = useState<ProductType>({} as ProductType);
  const [quantity, setQuantity] = useState(1);
  const [bundleSize, setBundleSize] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  const shopify = useContext(ShopifyContext);
  const cart = useContext(CartContext);

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const [cookies, setCookie] = useCookies(['access_token', 'userType']);

  useEffect(() => {
    !searchParams.get('id') ? navigate('/allItems') : setProductId(searchParams.get('id'))
  }, [searchParams]);

  // fetch product information from Shopify API
  useEffect(() => {
    shopify && productId && shopify.product
      .fetch(productId)
      .then((res) => {
        setProduct(res);
        if ([controlSysId5, testBoardId5, pcbChipId5].includes(productId)) {
          setBundleSize(5);
        }
        if ([controlSysId10, testBoardId10, pcbChipId10].includes(productId)) {
          setBundleSize(10);
        }
      }).catch((err) => {
        console.error(err);
        // redirect to all items page if product ID is invalid
        navigate('/allItems');
      });
  }, [shopify, productId]);

  function handleBundleChange(bsize: number) {
    setBundleSize(bsize)
    const productType = getProductType(productId);
    setSearchParams({ id: productIdsJson[productType][bsize] });
  }

  function handleAddToCart() {
    if(!cookies.access_token || cookies.userType !== 'customer') { navigate('/login'); return; }
    setAddingToCart(true);
    cart.addProduct(product, quantity).then(() => {
      setAddingToCart(false);
    });
  }

  return (
    <div className="flex items-center justify-center p-10">
      <div className="grid grid-cols-2 w-2/3 gap-4">
        <div className="col-span-1 flex flex-col">
          <img alt={product?.title} src={product?.variants && product?.variants[0].image.src} className="w-full aspect-square" />
        </div>
        <div className="col-span-1 flex flex-col justify-between">
          <div className="flex flex-col space-y-2">
            <NavLink to="/allItems" className="text-primary_light hover:text-primary mb-4"><i className="fa fa-arrow-left" /> Return to all products</NavLink>
            <h2 className="text-2xl">{product?.title}</h2>
            <p className="text-justify">
              {product?.description}
            </p>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <div className="text-lg font-bold">
                {/* @ts-expect-error NOTE: Shopify types not updated*/ }
                Price: ${product?.variants && product?.variants[0].price.amount}
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
                    <option value={1}>1</option>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                  </select>
                </div>
              </div>
            </div>
            <div>
              {addingToCart ? <Loading /> :
                <button
                  type="button"
                  className="bg-primary_light hover:bg-primary text-white rounded-lg w-full px-4 py-2"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>}
            </div>
            <div className="text-sm text-gray-400">Note: Price excludes sales tax</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;