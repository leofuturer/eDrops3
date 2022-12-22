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
    <div className="flex flex-col items-center justify-center">
      <SEO
        title="eDrops | Orders"
        description=""
        metadata={metadata}
      />
      <div className="w-full border-b-2 border-primary_light flex justify-center py-8">
        {
          location.pathname === '/manage/admin-retrieve-user-orders'
            ? (
              <h2 className="text-2xl">
                Orders for
                {' '}
                {username}
              </h2>
            )
            : <h2 className="text-2xl">Orders</h2>
        }
      </div>
      <div className="w-full py-8">
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
            {orderList
              ? orderList.map((item, index) => (
                <tr key={index}>
                  <td className="p-2">{item.orderInfoId}</td>
                  <td className="p-2">{item.createdAt.substring(0, item.createdAt.indexOf('T'))}</td>
                  <td className="p-2">{item.status}</td>
                  <td className="p-2">
                    $
                    {parseFloat(item.total_cost).toFixed(2)}
                  </td>
                  <td className="p-2">
                    <i className="fa fa-commenting" onClick={() => this.handleDetail(item.id)} />
                  </td>
                  <td className="p-2">
                    <i className="fa fa-commenting" onClick={() => this.handleChat(item.id)} />
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
      </div>
    </div>
  );
}

export default Orders;
