import { customerOrderRetrieve, request } from '@/api';
import SEO from '@/component/header/seo';
import ManageRightLayout from '@/component/layout/ManageRightLayout';
import { OrderInfo } from '@/types';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { OrderList } from '@/component/orders/OrderList';
import { metadata } from './metadata';
/*
 The order list page for customers
*/
export function OwnOrders() {
  const [orderList, setOrderList] = useState<OrderInfo[]>([]);

  const [cookies] = useCookies(['userType', 'userId', 'username', 'token']);

  useEffect(() => {
    request(`${customerOrderRetrieve.replace('id', cookies.userId)}`, 'GET', {}, true)
      .then((res) => {
        // console.log(res.data)
        setOrderList(res.data);
      })
      .catch((err) => {
        console.error(err);
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