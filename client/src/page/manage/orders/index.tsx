import SEO from '@/component/header/seo';
import ManageRightLayout from '@/component/layout/ManageRightLayout';
import { OrderList } from '@/component/orders/OrderList';
import { api, DTO, OrderInfo } from '@edroplets/api';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { metadata } from './metadata';
/*
 The order list page for customers
*/
export function OwnOrders() {
  const [orderList, setOrderList] = useState < DTO < OrderInfo > [] > ([]);

  const [cookies] = useCookies(['userId']);

  useEffect(() => {
    api.customer.getOrders(cookies.userId).then((orders) => {
      setOrderList(orders);
    });
  }, [cookies.userId]);

  return (
    <ManageRightLayout title="Orders">
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
