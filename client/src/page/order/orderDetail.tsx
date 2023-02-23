import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { request } from '../../api';
import { getChipOrders, getOrderInfoById, getProductOrders } from '../../api';
import MessageLayout from '../../component/layout/MessageLayout';
import { ChipOrder, DisplayAddress, ProductOrder } from '../../types';
import OrderAddress from './orderAddress';
import OrderItem from './orderItem';

function OrderDetail() {
  const [doneLoading, setDoneLoading] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [orderDetail, setOrderDetail] = useState<any>({}); // TODO: type order detail
  const [shippingAddress, setShippingAddress] = useState<DisplayAddress>({} as DisplayAddress);
  const [billingAddress, setBillingAddress] = useState<DisplayAddress>({} as DisplayAddress);
  const [productOrders, setProductOrders] = useState<ProductOrder[]>([]);
  const [chipOrders, setChipOrders] = useState<ChipOrder[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    setOrderId(searchParams.get('id') as string);
  }, [searchParams]);

  useEffect(() => {
    orderId && request(getOrderInfoById.replace('id', orderId), 'GET', {}, true)
      .then((res) => {
        setOrderDetail(res.data);
        // console.log(res.data);
        setShippingAddress({
          type: 'Shipping',
          name: res.data.sa_name,
          street: res.data.sa_address1,
          streetLine2: res.data.sa_address2,
          city: res.data.sa_city,
          state: res.data.sa_province,
          country: res.data.sa_country,
          zipCode: res.data.sa_zip,
        });
        setBillingAddress({
          type: 'Billing',
          name: res.data.ba_name,
          street: res.data.ba_address1,
          streetLine2: res.data.ba_address2,
          city: res.data.ba_city,
          state: res.data.ba_province,
          country: res.data.ba_country,
          zipCode: res.data.ba_zip,
        });
        return Promise.all([
          request(getProductOrders.replace('id', res.data.id), 'GET', {}, true),
          request(getChipOrders.replace('id', res.data.id), 'GET', {}, true),
        ]);
      })
      .then(([res1, res2]) => {
        setProductOrders(res1.data);
        setChipOrders(res2.data);
        setDoneLoading(true);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [orderId]);

  useEffect(() => {
    const productPrices = productOrders.reduce((acc, cur) => acc + cur.price * cur.quantity, 0);
    const chipPrices = chipOrders.reduce((acc, cur) => acc + cur.price * cur.quantity, 0);
    setTotalPrice(productPrices + chipPrices);
  }, [productOrders, chipOrders]);

  return (
    <MessageLayout title="eDroplets Order Details" message={`Order Number: ${orderDetail.orderComplete ? orderDetail.orderInfoId : "N/A"}`}>
      {!doneLoading
        ? (
          <div className="order-detail-title-container">
            <h2>Page loading...</h2>
          </div>
        )
        : (
          <div className="flex flex-col space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <OrderAddress address={shippingAddress} />
              <OrderAddress address={billingAddress} />
            </div>
            {
              productOrders.map((oneProduct, index) => <OrderItem key={index} info={oneProduct} />)
            }
            {
              chipOrders.map((oneProduct, index) => <OrderItem key={index} info={oneProduct} />)
            }
            <div className="flex flex-col">
              <p className="text-right">
                Subtotal: ${totalPrice.toFixed(2)}
              </p>
              <p className="text-right">
                Fees and Taxes: ${orderDetail.orderComplete ? parseFloat(orderDetail.fees_and_taxes).toFixed(2) : 'N/A'}
              </p>
              <p className="text-right font-bold">
                Total: ${orderDetail.orderComplete ? (totalPrice + parseFloat(orderDetail.fees_and_taxes)).toFixed(2) : 'N/A'}
              </p>
            </div>
            <p className="text-center text-xs">
              Please contact us at edropswebsite@gmail.com for any questions. Thank you for the order!
            </p>
          </div>
        )}
    </MessageLayout>
  );
}

export default OrderDetail;
