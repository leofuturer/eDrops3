import OrderItem from '@/component/orders/OrderItem';
import { ROUTES } from '@/router/routes';
import { Address, OrderChip, OrderInfo, OrderProduct } from '@/types';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getChipOrders, getOrderInfoById, getProductOrders, request } from '../../../api';
import MessageLayout from '../../../component/layout/MessageLayout';


export function OrderDetail() {
  const [doneLoading, setDoneLoading] = useState(false);
  const [order, setOrder] = useState<OrderInfo>({} as OrderInfo);
  const [productOrders, setProductOrders] = useState<OrderProduct[]>([]);
  const [chipOrders, setChipOrders] = useState<OrderChip[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const { id: orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!orderId) {
      navigate(ROUTES.ManageOrders);
      return;
    }
    request(getOrderInfoById.replace('id', orderId), 'GET', {}, true)
      .then(res => {
        setOrder(res.data);
        console.log(res.data);
        return Promise.all([
          request(
            getProductOrders.replace('id', res.data.id),
            'GET',
            {},
            true,
          ),
          request(getChipOrders.replace('id', res.data.id), 'GET', {}, true),
        ]);
      })
      .then(([res1, res2]) => {
        setProductOrders(res1.data);
        setChipOrders(res2.data);
        setDoneLoading(true);
      })
      .catch(err => {
        console.error(err);
      });
  }, [orderId]);

  useEffect(() => {
    const productPrices = productOrders.reduce(
      (acc, cur) => acc + cur.price * cur.quantity,
      0,
    );
    const chipPrices = chipOrders.reduce(
      (acc, cur) => acc + cur.price * cur.quantity,
      0,
    );
    setTotalPrice(productPrices + chipPrices);
  }, [productOrders, chipOrders]);

  return (
    <MessageLayout
      title="eDrops Order Details"
      message={`Order Number: ${order.orderComplete ? order.orderInfoId : 'N/A'}`}
    >
      {order.orderComplete ? (
        <a className="text-center text-xs" href={order.checkoutLink}>
          <u>See full order details</u>
        </a>
      ) : null}
      {!doneLoading ? (
        <div className="order-detail-title-container">
          <h2>Page loading...</h2>
        </div>
      ) : (
        <div className="flex flex-col space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="shadow-box-sm p-4">
              <div className="flex">
                <h4>Shipping Address</h4>
              </div>
              <div className="flex flex-col">
                <div className="">{order.sa_name}</div>
                <div className="">{order.sa_address1}</div>
                <div className="">{order.sa_address2}</div>
                <div className="">{order.sa_city}</div>
                <div className="">{order.sa_province}</div>
                <div className="">{order.sa_country}</div>
                <div className="">{order.sa_zip}</div>
              </div>
            </div >
            <div className="shadow-box-sm p-4">
              <div className="flex">
                <h4>Billing Address</h4>
              </div>
              <div className="flex flex-col">
                <div className="">{order.ba_name}</div>
                <div className="">{order.ba_address1}</div>
                <div className="">{order.ba_address2}</div>
                <div className="">{order.ba_city}</div>
                <div className="">{order.ba_province}</div>
                <div className="">{order.ba_country}</div>
                <div className="">{order.ba_zip}</div>
              </div>
            </div >
          </div>
          {productOrders.map((product) => (
            <OrderItem key={product.id} info={product} />
          ))}
          {chipOrders.map((chip) => (
            <OrderItem key={chip.id} info={chip} />
          ))}
          <div className="flex flex-col">
            <p className="text-right">Subtotal: ${totalPrice.toFixed(2)}</p>
            <p className="text-right">
              Fees and Taxes: $
              {order.orderComplete
                ? parseFloat(order.fees_and_taxes as string).toFixed(2)
                : 'N/A'}
            </p>
            <p className="text-right font-bold">
              Total: $
              {order.orderComplete
                ? (totalPrice + parseFloat(order.fees_and_taxes as string)).toFixed(2)
                : 'N/A'}
            </p>
          </div>
          <p className="text-center text-xs">
            Please contact us at edropswebsite@gmail.com for any questions.
            Thank you for the order!
          </p>
        </div>
      )}
    </MessageLayout>
  );
}

export default OrderDetail;
