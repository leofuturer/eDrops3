import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { customerOrderRetrieve, getAllOrderInfos, request } from '@/api';
import SEO from '@/component/header/seo';
import ManageRightLayout from '@/component/layout/ManageRightLayout';
import { OrderInfo } from '@/types';
import OrderList from '@/component/orders/OrderList';
import { ROUTES } from '@/router/routes';

/*
 The order list page for admins to view a given customer's orders
*/
export function CustomerOrders() {
  const [orderList, setOrderList] = useState<OrderInfo[]>([]);

  const navigate = useNavigate();

  const { id: customerId } = useParams();
  if (!customerId) {
    // Go back to the manage customers page if the customer id is not provided
    navigate(ROUTES.ManageCustomers);
  }

  const [cookies, setCookie] = useCookies(['userType', 'userId', 'username', 'token']);

  useEffect(() => {
    request(`${getAllOrderInfos}?filter={"where": {"customerId": ${customerId}, "orderComplete": true}}`, 'GET', {}, true)
      .then((res) => {
        // console.log(res.data)
        setOrderList(res.data);
      })
      .catch((err) => {
        console.error(err);
      });

    
  }, []);

  function handleDetail(orderId: number) {
    // Using the window.open() method to open a new window
    // and display the page based on the passed in redirectUrl
    const redirectUrl = `/subpage/order-detail?id=${orderId}`;
    const strWindowFeatures = 'width=1200px, height=900px';
    const WindowForOrderDetail = window.open(redirectUrl, '_blank', strWindowFeatures);
  }

  function handleChat(orderId: number) {
    const redirectUrl = `/subpage/order-chat?id=${orderId}`;
    const strWindowFeatures = 'width=1200px, height=900px';
    const WindowForOrderDetail = window.open(redirectUrl, '_blank', strWindowFeatures);
  }

  const username = ""; // TODO: retrieve actual username
  return (
    <ManageRightLayout title={`Orders for ${username}`}>
      <SEO
        title={`eDroplets | Orders for ${username}`}
        description=""
      />
      <OrderList orderList={orderList} />
    </ManageRightLayout>
  );
}

export default CustomerOrders;