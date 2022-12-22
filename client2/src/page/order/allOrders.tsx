// Admin only page, for customer page see order/index.jsx
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { getAllOrderInfos } from '../../api/serverConfig';
import API from '../../api/api';
import ManageRightLayout from '../../component/layout/ManageRightLayout';

function AllOrders() {
  const [orderList, setOrderList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    API.Request(getAllOrderInfos, 'GET', {}, true)
      .then((res) => {
        setOrderList(res.data);
      })
      .catch((err) => {
        console.log(err);
      }).finally(() => {
        setIsLoading(false);
      });
  }, []);

  function handleDetail(e) {
    // Using the window.open() method to open a new window
    // and display the page based on the passed in redirectUrl
    const orderId = e.target.parentNode.parentNode.id;
    const redirectUrl = `/subpage/order-detail?id=${orderId}`;
    const strWindowFeatures = 'width=1200px, height=900px';
    const WindowForOrderDetail = window.open(redirectUrl, '_blank', strWindowFeatures);
    WindowForOrderDetail._orderItemId = orderId;
  }

  function handleChat(e) {
    const orderId = e.target.parentNode.parentNode.id;
    const redirectUrl = `/subpage/order-chat?id=${orderId}`;
    const strWindowFeatures = 'width=1200px, height=900px';
    const WindowForOrderChat = window.open(redirectUrl, '_blank', strWindowFeatures);
    WindowForOrderChat._orderItemId = orderId;
  }

  return (
    <ManageRightLayout title="All Orders">
      <table className="table-info">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer ID</th>
            <th>Status</th>
            <th>Price</th>
            <th>Details</th>
            <th>Chat</th>
          </tr>
        </thead>
        <tbody>
          {orderList.length !== 0 ? orderList.map((item, index) => (
            <tr key={index} id={item.id}>
              <td>{item.orderComplete ? item.orderInfoId : 'Customer cart'}</td>
              <td>{item.customerId}</td>
              <td>{item.status}</td>
              <td>
                $
                {parseFloat(item.total_cost).toFixed(2)}
              </td>
              <td className="icon-center">
                <i className="fa fa-commenting" onClick={handleDetail} />
              </td>
              <td className="icon-center">
                <i className="fa fa-commenting" onClick={handleChat} />
              </td>
            </tr>
          ))
            : (
              <tr>
                <td>
                  {
                    isLoading
                      ? <img src="/img/loading80px.gif" alt="" className="loading-icon" />
                      : 'No orders have been submitted yet.'
                  }
                </td>
              </tr>
            )}
        </tbody>
      </table>
    </ManageRightLayout>
  );
}

export default AllOrders;
