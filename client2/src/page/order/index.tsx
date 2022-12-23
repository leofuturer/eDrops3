import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import API from '../../api/api';
import {
  customerOrderRetrieve, workerOrderRetrieve, getAllOrderInfos,
} from '../../api/serverConfig';
import SEO from '../../component/header/SEO';
import { metadata } from './metadata';
import { useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import ManageRightLayout from '../../component/layout/ManageRightLayout';

// The order list page for both customer and worker
function Orders() {
  const [orderList, setOrderList] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [custId, setCustId] = useState('');
  const [isCustomer, setIsCustomer] = useState(false);
  const [username, setUsername] = useState('');

  const location = useLocation();

  const [cookies, setCookie] = useCookies(['userType', 'userId', 'username', 'token']);

  useEffect(() => {
    if (location.pathname === '/manage/admin-retrieve-user-orders' && cookies.userType === 'admin') {
      setCustId(location.state.userId);
      setIsCustomer(location.state.isCustomer);
      setUsername(location.state.username);
    }
  }, [])

  useEffect(() => {
    setIsLoading(true);
    let url;
    if (location.pathname === '/manage/customer-orders') {
      url = `${customerOrderRetrieve.replace('id', cookies.userId)}`;
    } else if (location.pathname === '/manage/admin-retrieve-user-orders') {
      url = `${getAllOrderInfos}?filter={"where": {"customerId": ${custId}, "orderComplete": true}}`;
    } else {
      console.error('Unexpected error');
      return;
    }

    API.Request(url, 'GET', {}, true)
      .then((res) => {
        // console.log(res.data)
        setOrderList(res.data);
        setIsLoading(false);
        console.log(orderList);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
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

  return (
    <ManageRightLayout title={location.pathname === '/manage/admin-retrieve-user-orders' ? 'Orders for ${username}' : 'Orders'}>
      <SEO
        title="eDrops | Orders"
        description=""
        metadata={metadata}
      />
      <table className="table-info">
        <thead className="">
          <tr className="border-b-2">
            <th className="p-2">Order ID</th>
            <th className="p-2">Order Date</th>
            <th className="p-2">Process Status</th>
            <th className="p-2">Total Price</th>
            <th className="p-2">Other Details</th>
            <th className="p-2">Chat</th>
          </tr>
        </thead>
        <tbody>
          {orderList.length !== 0 ? orderList.map((order, index) => (
              <tr key={index}>
                <td className="p-2">{order.orderInfoId}</td>
                <td className="p-2">{order.createdAt.substring(0, order.createdAt.indexOf('T'))}</td>
                <td className="p-2">{order.status}</td>
                <td className="p-2">
                  $
                  {parseFloat(order.total_cost).toFixed(2)}
                </td>
                <td className="p-2">
                  <i className="fa fa-commenting cursor-pointer" onClick={() => handleDetail(order.id)} />
                </td>
                <td className="p-2">
                  <i className="fa fa-commenting cursor-pointer" onClick={() => handleChat(order.id)} />
                </td>
              </tr>
            ))
            : (
              <tr>
                <td className="p-2">
                  {
                    isLoading
                      ? <img src="/img/loading80px.gif" alt="" className="loading-icon" />
                      : (Cookies.get('userType') === 'worker'
                        ? 'No orders have been assigned to you yet.'
                        : 'No orders have been placed.')
                  }
                </td>
              </tr>
            )}
        </tbody>
      </table>
    </ManageRightLayout>
  );
}

export default Orders;
