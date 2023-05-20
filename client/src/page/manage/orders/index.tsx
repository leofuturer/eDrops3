import { getCustomerOrders } from '@/api/customer';
import SEO from '@/component/header/seo';
import ManageRightLayout from '@/component/layout/ManageRightLayout';
import { OrderList } from '@/component/orders/OrderList';
import { OrderInfo } from '@/types';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { metadata } from './metadata';
/*
 The order list page for customers
*/
export function OwnOrders() {
  const [orderList, setOrderList] = useState<OrderInfo[]>([]);

  const [cookies] = useCookies(['userId']);

  useEffect(() => {
    getCustomerOrders(cookies.userId).then((orders) => {
      setOrderList(orders);
    });
  }, []);

  return (
    <ManageRightLayout title='Orders'>
      <SEO
        title="eDroplets | Orders"
        description=""
        metadata={metadata}
      />
      <OrderList orderList={orderList} />
    </ManageRightLayout>
  );
}

export default OwnOrders;