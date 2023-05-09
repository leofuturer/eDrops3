import { useContext, useEffect, useState } from 'react';
import { getAllOrderInfos, request } from '../../../api';
import ManageRightLayout from '../../../component/layout/ManageRightLayout';
import Loading from '../../../component/ui/Loading';
import { CartContext } from '../../../context/CartContext';
import { OrderInfo } from '../../../types';
import OrderList from '@/component/orders/OrderList';

export function AllOrders() {
  const [orderList, setOrderList] = useState<OrderInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const cart = useContext(CartContext);

  useEffect(() => {
    setIsLoading(true);
    request(getAllOrderInfos, 'GET', {}, true)
      .then((res) => {
        setOrderList(res.data);
      })
      .catch((err) => {
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
