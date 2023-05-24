import { CartContext } from '@/context';
import { ROLES } from '@/lib/constants/roles';
import { ROUTES, idRoute } from '@/router/routes';
import { DTO, OrderChip } from '@/types'
import React, { useContext } from 'react'
import { useCookies } from 'react-cookie';

function ChipOrderList({ chipOrderList }: { chipOrderList: DTO<OrderChip>[] }) {
  const [cookies] = useCookies(['userType']);
  const cart = useContext(CartContext);

  function handleDownload(itemId: number) {
    // console.log(e.target.id);
    let url = '';
    // TODO: fix this
    // if (cookies.userType === ROLES.Customer) {
    //   // for customer, `id` is file ID
    //   url = downloadFileById.replace('id', cookies.userId);
    //   url += `?access_token=${Cookies.get('access_token')}&fileId=${itemId}`;
    // } else if (cookies.userType === ROLES.Worker) {
    //   // for worker, `id` is chipOrder ID (associated with that file)
    //   url = workerDownloadFile.replace('id', cookies.userId);
    //   url += `?access_token=${Cookies.get('access_token')}&chipOrderId=${itemId}`;
    // } else if (cookies.userType === ROLES.Admin) {
    //   // for admin, `id` is file ID
    //   url = adminDownloadFile;
    //   url += `?access_token=${Cookies.get('access_token')}&fileId=${itemId}`;
    // }

    window.location.href = url;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>, chipOrderId: number) {
    e.preventDefault();
    // const dropdown = document.getElementById('status-selection');
    // const selectedStatus = dropdown.options[dropdown.selectedIndex].value;
    // const chipOrderId = Number(e.target.id.replace(/[^0-9]/ig, ''));

    const dropdown = document.getElementById(`status-selection-${chipOrderId}`);
    // @ts-expect-error
    const selectedStatus = dropdown.options[dropdown.selectedIndex].value;
    const url = editOrderStatus.replace('id', chipOrderId.toString());
    const data = { status: selectedStatus };
    request(url, 'PATCH', data, true)
      .then((res) => {
        alert('Status updated!');
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // TODO: work on option for admin to reassign if needed
  // function handleAssign(orderIndex: number) {
  //   // Using the window.open() method to open a new window and display the page based on the passed in redirectUrl
  //   const redirectUrl = '/manage/assign-orders';
  //   const strWindowFeatures = 'width=1200px, height=900px';
  //   const newWindow = window.open(redirectUrl, '_blank', strWindowFeatures);
  //   // @ts-expect-error
  //   newWindow._order = orderList[orderIndex];
  // }

  function handleChat(orderId: number) {
    const redirectUrl = idRoute(ROUTES.SubpageOrderChat, orderId);
    const strWindowFeatures = 'width=1200px, height=900px';
    const WindowForOrderChat = window.open(redirectUrl, '_blank', strWindowFeatures);
    // @ts-expect-error
    WindowForOrderChat._orderItemId = orderId;
  }

  return (
    <table className="table-info">
      <thead className="">
        <tr className="">
          <th className="">ID</th>
          {cookies.userType !== ROLES.Customer && <th>Uploader</th> // admin or worker
          }
          <th className="">Last Updated</th>
          {cookies.userType !== ROLES.Worker && <th>Worker</th> // customer or admin
          }
          {cookies.userType !== ROLES.Worker
            ? <th>Process Status</th> // customer
            : <th className="icon-center">Edit Status</th> // worker or admin
          }
          <th className="">Qty</th>
          <th className="">Mask File</th>
          <th className="">Chat</th>
          {cookies.userType === ROLES.Admin && <th className="">Assign Order</th> // admin
          }
        </tr>
      </thead>
      <tbody>
        {cart.enabled && chipOrderList.length !== 0 ? chipOrderList.map((item, index) => (
          <tr key={item?.id}>
            <td className="">{item?.id}</td>
            {cookies.userType !== ROLES.Customer && <td className="">{item?.customerName}</td>}
            <td className="">{item?.lastUpdated.substring(0, item?.lastUpdated.indexOf('T'))}</td>
            {cookies.userType !== ROLES.Worker && <td className="">{item?.workerName}</td>}
            {cookies.userType !== ROLES.Worker
              ? <td className="">{item?.status}</td>
              : (<td className="">
                <form
                  id="edit-order-status-form"
                  className="edit-order-status-form"
                  onSubmit={(e) => handleSubmit(e, item?.id)} // TODO: fix form submission
                >
                  <select title="status" className="order-status" name="status" defaultValue={item?.status}>
                    <option value="Fabrication request received">Fab Req Received</option>
                    <option value="Project Started">Project Started</option>
                    <option value="Project Completed">Project Completed</option>
                    <option value="Item Shipped">Item Shipped</option>
                  </select>
                  <input type="submit" />
                </form>
              </td>)
            }
            <td className="">{item?.quantity}</td>
            <td className="">
              {cookies.userType === ROLES.Worker
                ? <i className="fa fa-download cursor-pointer" onClick={() => handleDownload(item?.id)} />
                : <i className="fa fa-download cursor-pointer" onClick={() => handleDownload(item?.fileInfoId)} />
              }
            </td>
            <td className="">
              <i className="fa fa-commenting cursor-pointer" onClick={() => handleChat(item?.orderInfoId)} />
            </td>
            {/* {cookies.userType === ROLES.Admin &&
              <td className="">
                <i className="fa fa-users cursor-pointer" onClick={() => handleAssign(index)} />
              </td>
            } */}
          </tr>
        )) : (<tr>
          <td className="p-2" colSpan={9}>
            {cookies.userType === ROLES.Worker
              ? <p>No orders have been assigned to you yet.</p>
              : <p>No orders have been placed.</p>}
          </td>
        </tr>)}
      </tbody>
    </table>
  )
}

export default ChipOrderList