// Admin only page, for customer page see order/index.jsx
import { useContext, useEffect, useState } from 'react';
import { getAllOrderInfos, request } from '../../api';
import ManageRightLayout from '../../component/layout/ManageRightLayout';
import Loading from '../../component/ui/Loading';
import { CartContext } from '../../context/CartContext';
import { ChatContext } from '../../context/ChatContext';
import { OrderInfo } from '../../types';

function AllOrders() {
  const [orderList, setOrderList] = useState<OrderInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const cart = useContext(CartContext);
  const chat = useContext(ChatContext);

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

  function handleDetail(orderId: number) {
    // Using the window.open() method to open a new window
    // and display the page based on the passed in redirectUrl
    const redirectUrl = `/subpage/order-detail?id=${orderId}`;
    const strWindowFeatures = 'width=1200px, height=900px';
    const WindowForOrderDetail = window.open(redirectUrl, '_blank', strWindowFeatures);
    // @ts-expect-error
    WindowForOrderDetail._orderItemId = orderId;
  }

  // TODO: chat feature
  function handleChat(orderId: number) {
    const redirectUrl = `/subpage/order-chat?id=${orderId}`;
    const strWindowFeatures = 'width=1200px, height=900px';
    const WindowForOrderChat = window.open(redirectUrl, '_blank', strWindowFeatures);
    // @ts-expect-error
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
          {cart.enabled && orderList.length !== 0 ? orderList.map((order, index) => (
            <tr key={index}>
              <td>{order.orderComplete ? order.orderInfoId : 'Customer cart'}</td>
              <td>{order.customerId}</td>
              <td>{order.status}</td>
              <td>
                ${order.total_cost ? parseFloat(order.total_cost).toFixed(2) : 0}
              </td>
              <td className="icon-center">
                <i className="fa fa-commenting cursor-pointer" onClick={() => handleDetail(order.id)} />
              </td>
              <td className="icon-center">
                <i className="fa fa-commenting cursor-pointer" onClick={() => handleChat(order.id)} />
              </td>
            </tr>
          ))
            : (
              <tr>
                <td>
                  {
                    isLoading
                      ? <Loading />
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
