import ManageRightLayout from '@/component/layout/ManageRightLayout';
import OrderList from '@/component/orders/OrderList';
import { CartContext } from '@/context/CartContext';
import { api, DTO, OrderInfo } from '@edroplets/api';
import { useContext, useEffect, useState } from 'react';

export function AllOrders() {
  const [orderList, setOrderList] = useState < DTO < OrderInfo > [] > ([]);
  const [isLoading, setIsLoading] = useState(false);

  const cart = useContext(CartContext);

  useEffect(() => {
    setIsLoading(true);
    api.order.getAll().then((orders) => {
      setOrderList(orders);
    }).catch((err) => {
      console.log(err);
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <ManageRightLayout title="All Orders">
      <OrderList orderList={orderList} />
    </ManageRightLayout>
  );
}

export default AllOrders;
