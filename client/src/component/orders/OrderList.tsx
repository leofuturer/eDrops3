import { ROUTES, idRoute } from '@/router/routes';
import { useContext } from 'react';
import { CartContext } from '@/context/CartContext';
import { OrderInfo } from '@/types';
import { SERVICE_EMAIL } from '@/lib/constants/misc';
import { useCookies } from 'react-cookie';
import { ROLES } from '@/lib/constants/roles';

/*
 The order list page for both customer and worker
 Component that renders the order list
*/
export function OrderList({ orderList }: { orderList: OrderInfo[] }) {
  const [cookies] = useCookies(['userType']);
  const cart = useContext(CartContext);

  function handleDetail(orderId: number) {
    // Using the window.open() method to open a new window
    // and display the page based on the passed in redirectUrl
    const redirectUrl = idRoute(ROUTES.SubpageOrderDetail, orderId.toString());
    const strWindowFeatures = 'width=1200px, height=900px';
    window.open(redirectUrl, '_blank', strWindowFeatures);
  }

  function handleChat(orderId: number) {
    const redirectUrl = idRoute(ROUTES.SubpageOrderChat, orderId.toString());
    const strWindowFeatures = 'width=1200px, height=900px';
    window.open(redirectUrl, '_blank', strWindowFeatures);
  }

  return (
    <table className="table-info">
      <thead className="">
        <tr className="border-b-2">
          <th className="p-2">Order ID</th>
          {cookies.userType === ROLES.Admin && <th className="p-2">Customer ID</th>}
          <th className="p-2">Order Date</th>
          <th className="p-2">Status</th>
          <th className="p-2">Price</th>
          <th className="p-2">Other Details</th>
        </tr>
      </thead>
      <tbody>
        {cart.enabled && orderList.length !== 0 ? orderList.map((order, index) => (
          <tr key={index}>
            <td className="p-2">{order.orderComplete ? order.orderInfoId : 'In cart'}</td>
            {cookies.userType === ROLES.Admin && <td>{order.customerId}</td>}
            <td className="p-2">{order.createdAt.substring(0, order.createdAt.indexOf('T'))}</td>
            <td className="p-2">{order.status}</td>
            <td className="p-2">
              ${order.total_cost ? parseFloat(order.total_cost).toFixed(2) : 0}
            </td>
            <td className="p-2">
              <i className="fa fa-commenting cursor-pointer" onClick={() => order.id && handleDetail(order.id)} />
            </td>
          </tr>
        )) : (
          <tr>
            <td className="p-2" colSpan={100}>
              No orders found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default OrderList;