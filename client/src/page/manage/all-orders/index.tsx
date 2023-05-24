import { useContext, useEffect, useState } from 'react';
import { api } from '@/api';
import ManageRightLayout from '@/component/layout/ManageRightLayout';
import Loading from '@/component/ui/Loading';
import { CartContext } from '@/context/CartContext';
import { DTO, OrderInfo } from '@/types';
import OrderList from '@/component/orders/OrderList';

export function AllOrders() {
  const [orderList, setOrderList] = useState<DTO<OrderInfo>[]>([]);
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
