import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import API from '../../api/lib/api';
import {
  adminGetChipOrders, customerGetChipOrders,
  workerGetChipOrders, editOrderStatus,
  downloadFileById, adminDownloadFile, workerDownloadFile,
}
  from '../../api/lib/serverConfig';

import SEO from '../../component/header/SEO';
import { metadata } from './metadata.jsx';
import { useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import ManageRightLayout from '../../component/layout/ManageRightLayout';
import Loading from '../../component/ui/Loading';

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
        console.log(res)
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
      url = downloadFileById.replace('id', cookies.userId);
      url += `?access_token=${Cookies.get('access_token')}&fileId=${itemId}`;
    } else if (cookies.userType === 'worker') {
      // for worker, `id` is chipOrder ID (associated with that file)
      url = workerDownloadFile.replace('id', cookies.userId);
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

  function handleSubmit(chipOrderId) {
    e.preventDefault();
    // const dropdown = document.getElementById('status-selection');
    // const selectedStatus = dropdown.options[dropdown.selectedIndex].value;
    // const chipOrderId = Number(e.target.id.replace(/[^0-9]/ig, ''));

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
      <table className="table-info">
        <thead className="">
          <tr className="">
            <th className="">ID</th>
            {cookies.userType !== 'customer' && <th>Uploader</th> // admin or worker
            }
            <th className="">Last Updated</th>
            {cookies.userType !== 'worker' && <th>Worker</th> // customer or admin
            }
            {cookies.userType === 'customer'
              ? <th>Process Status</th> // customer
              : <th className="icon-center">Edit Status</th> // worker or admin
            }
            <th className="">Qty</th>
            <th className="">Mask File</th>
            <th className="">Chat</th>
            {cookies.userType === 'admin' && <th className="">Assign Order</th> // admin
            }
          </tr>
        </thead>
        <tbody>
          {orderList.length !== 0 ? orderList.map((item, index) => (
            <tr key={item?.id}>
              <td className="">{item?.id}</td>
              {cookies.userType !== 'customer' && <td className="">{item?.customerName}</td>}
              <td className="">{item?.lastUpdated.substring(0, item?.lastUpdated.indexOf('T'))}</td>
              {cookies.userType !== 'worker' && <td className="">{item?.workerName}</td>}
              {cookies.userType === 'customer'
                ? <td className="">{item?.status}</td>
                : (
                  <td className="">
                    <form
                      id="edit-order-status-form"
                      className="edit-order-status-form"
                      onSubmit={() => handleSubmit(item?.id)} // TODO: fix form submission
                    >
                      <select title="status" className="order-status" name="status" defaultValue={item?.status}>
                        <option value="Fabrication request received">Fab Req Received</option>
                        <option value="Project Started">Project Started</option>
                        <option value="Project Completed">Project Completed</option>
                        <option value="Item Shipped">Item Shipped</option>
                      </select>
                      <input type="submit"/>
                    </form>
                  </td>
                )
              }
              <td className="">
                {item?.quantity}
              </td>
              <td className="">
                {
                  cookies.userType === 'worker'
                    ? <i className="fa fa-download cursor-pointer" onClick={handleDownload} id={`download${item?.id}`} />
                    : <i className="fa fa-download cursor-pointer" onClick={handleDownload} id={`download${item?.fileInfoId}`} />
                }
              </td>
              <td className="">
                <i className="fa fa-commenting cursor-pointer" onClick={handleChat} id={`order${item?.orderId}`} />
              </td>
              {cookies.userType === 'admin' &&
                <td className="">
                  <i className="fa fa-users cursor-pointer" id={`allOrder${index}`} onClick={handleAssign} />
                </td>
              }
            </tr>
          ))
            : (
              <tr>
                <td className="p-2" colSpan={9}>
                  {isLoading
                    ? <Loading />
                    : (cookies.userType === 'worker'
                      ? <p>No orders have been assigned to you yet.</p>
                      : <p>No orders have been placed.</p>)
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
