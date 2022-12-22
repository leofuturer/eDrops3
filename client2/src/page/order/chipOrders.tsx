import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import API from '../../api/api';
import {
  adminGetChipOrders, customerGetChipOrders,
  workerGetChipOrders, editOrderStatus,
  downloadFileById, adminDownloadFile, workerDownloadFile,
}
  from '../../api/serverConfig';

import SEO from '../../component/header/SEO.js';
import { metadata } from './metadata.jsx';
import { useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import ManageRightLayout from '../../component/layout/ManageRightLayout';

// List all chip orders for all user types
function ChipOrders() {
  const [orderList, setOrderList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [workerId, setWorkerId] = useState('');
  const [isCustomer, setIsCustomer] = useState(false);

  const location = useLocation();

  const [cookies] = useCookies(['userId', 'userType', 'access_token']);

  useEffect(() => {
    if (location.pathname === '/manage/admin-retrieve-worker-orders'
      && cookies.userType === 'admin') {
      setWorkerId(location.state.workerId);
      setIsCustomer(location.state.isCustomer);
    }
  }, [location.pathname, cookies.userType])

  useEffect(() => {
    setIsLoading(true);
    let url;
    switch (cookies.userType) {
      default:
      case 'customer':
        url = customerGetChipOrders.replace('id', cookies.userId);
        break;
      case 'worker':
        url = workerGetChipOrders.replace('id', cookies.userId);
        break;
      case 'admin':
        url = adminGetChipOrders.replace('id', cookies.userId);
        break;
    }

    API.Request(url, 'GET', {}, true)
      .then((res) => {
        if (workerId) {
          res.data = res.data.filter((orderChip) => orderChip.workerId === workerId);
        }
        setOrderList(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  function handleDownload(e) {
    // console.log(e.target.id);
    let url = '';
    const itemId = Number(e.target.id.replace(/[^0-9]/ig, ''));
    if (cookies.userType === 'customer') {
      // for customer, `id` is file ID
      url = downloadFileById.replace('id', Cookies.get('userId'));
      url += `?access_token=${Cookies.get('access_token')}&fileId=${itemId}`;
    } else if (cookies.userType === 'worker') {
      // for worker, `id` is chipOrder ID (associated with that file)
      url = workerDownloadFile.replace('id', Cookies.get('userId'));
      url += `?access_token=${Cookies.get('access_token')}&chipOrderId=${itemId}`;
    } else if (cookies.userType === 'admin') {
      // for admin, `id` is file ID
      url = adminDownloadFile;
      url += `?access_token=${Cookies.get('access_token')}&fileId=${itemId}`;
    }

    window.location = url;
  }

  function handleAssign(e) {
    // Using the window.open() method to open a new window and display the page based on the passed in redirectUrl
    const orderIndex = Number(e.target.id.replace(/[^0-9]/ig, ''));
    const redirectUrl = '/manage/assign-orders';
    const strWindowFeatures = 'width=1200px, height=900px';
    const newWindow = window.open(redirectUrl, '_blank', strWindowFeatures);
    newWindow._order = orderList[orderIndex];
  }

  function handleSubmit(e) {
    e.preventDefault();
    // const dropdown = document.getElementById('status-selection');
    // const selectedStatus = dropdown.options[dropdown.selectedIndex].value;
    // const chipOrderId = Number(e.target.id.replace(/[^0-9]/ig, ''));

    const chipOrderId = Number(e.target.getAttribute('data-item-id'));
    const dropdown = document.getElementById(`status-selection-${chipOrderId}`);
    const selectedStatus = dropdown.options[dropdown.selectedIndex].value;
    const url = editOrderStatus.replace('id', chipOrderId);
    const data = { status: selectedStatus };
    API.Request(url, 'PATCH', data, true)
      .then((res) => {
        alert('Status updated!');
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function handleChat(e) {
    const orderId = Number(e.target.id.replace(/[^0-9]/ig, ''))
    const redirectUrl = `/subpage/order-chat?id=${orderId}`;
    const strWindowFeatures = 'width=1200px, height=900px';
    const WindowForOrderChat = window.open(redirectUrl, '_blank', strWindowFeatures);
    WindowForOrderChat._orderItemId = orderId;
  }

  return (
    <ManageRightLayout title="Chip Orders">
      <SEO
        title="eDrops | Chip Orders"
        description=""
        metadata={metadata}
      />
      <table className="rounded-md shadow-box w-full border-collapse table-auto">
        <thead className="">
          <tr className="border-b-2">
            <th className="p-2">ID</th>
            {
              !(cookies.userType === 'customer')
                ? <th>Uploader</th> // admin or worker
                : null
            }
            <th className="p-2">Last Updated</th>
            {
              !(cookies.userType === 'worker')
                ? <th>Worker</th> // customer or admin
                : null
            }
            {
              cookies.userType === 'customer'
                ? <th>Process Status</th> // customer
                : <th className="icon-center">Edit Status</th> // worker or admin
            }
            <th className="p-2">Qty</th>
            <th className="p-2">Mask File</th>
            <th className="p-2">Chat</th>
            {
              cookies.userType === 'admin'
                ? <th className="p-2">Assign Order</th> // admin
                : null
            }
          </tr>
        </thead>
        <tbody>
          {orderList.length !== 0
            ? orderList.map((item, index) => (
              <tr key={item.id}>
                <td className="p-2">{item.id}</td>
                {cookies.userType !== 'customer' && <td className="p-2">{item.customerName}</td>}
                <td className="p-2">{item.lastUpdated.substring(0, item.lastUpdated.indexOf('T'))}</td>
                {cookies.userType !== 'worker' && <td className="p-2">{item.workerName}</td>}
                {cookies.userType === 'customer'
                  ? <td className="p-2">{item.status}</td>
                  : (
                    <td className="p-2">
                      <form
                        id="edit-order-status-form"
                        className="edit-order-status-form"
                        onSubmit={handleSubmit}
                        data-item-id={item.id}
                      >
                        <select id={`status-selection-${item.id}`} className="order-status" name="status" defaultValue={item.status}>
                          <option value="Fabrication request received">Fab Req Received</option>
                          <option value="Project Started">Project Started</option>
                          <option value="Project Completed">Project Completed</option>
                          <option value="Item Shipped">Item Shipped</option>
                        </select>
                        <input type="submit" id={`allOrder${index}`} />
                      </form>
                    </td>
                  )
                }
                <td className="p-2">
                  {item.quantity}
                </td>
                <td className="p-2">
                  {
                    cookies.userType === 'worker'
                      ? <i className="fa fa-download" onClick={handleDownload} id={`download${item.id}`} />
                      : <i className="fa fa-download" onClick={handleDownload} id={`download${item.fileInfoId}`} />
                  }
                </td>
                <td className="p-2">
                  <i className="fa fa-commenting" onClick={handleChat} id={`order${item.orderId}`} />
                </td>
                {cookies.userType === 'admin' &&
                  <td className="p-2">
                    <i className="fa fa-users" id={`allOrder${index}`} onClick={handleAssign} />
                  </td>
                }
              </tr>
            ))
            : (
              <tr>
                <td className="p-2">
                  {
                    isLoading
                      ? <img src="/img/loading80px.gif" alt="" className="loading-icon" />
                      : (cookies.userType === 'worker'
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

export default ChipOrders;
