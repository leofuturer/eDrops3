import { api, DTO, FoundryWorker, IncludeUser, OrderChip } from '@edroplets/api';
import { CartContext } from '@/context';
import { ROLES } from '@/lib/constants/roles';
import { ROUTES, idRoute } from '@/router/routes';
import { ArrowDownTrayIcon, ChatBubbleOvalLeftEllipsisIcon, UsersIcon } from '@heroicons/react/24/solid';
import React, { useContext, useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';

function ChipOrderList({ chipOrderList }: { chipOrderList: DTO<OrderChip>[] }) {
  const [workerList, setWorkerList] = useState<DTO<IncludeUser<FoundryWorker>>[]>([]);
  const [cookies] = useCookies(['userType', 'userId']);
  const cart = useContext(CartContext);

  useEffect(() => {
    cookies.userType === ROLES.Admin && api.worker.getAll().then((workers) => {
      console.log(workers);
      setWorkerList(workers);
    });
  }, [])

  function handleDownload(fileId: string, orderId?: number) {
    switch (cookies.userType) {
      case ROLES.Customer:
        // for customer, `id` is file ID
        api.customer.downloadFile(cookies.userId, fileId, true);
        break;
      case ROLES.Worker:
        // for worker, `id` is chipOrder ID (associated with that file)
        // api.worker.downloadFile(cookies.userId, orderId);
        break;
      case ROLES.Admin:
        // for admin, `id` is file ID
        api.file.download(fileId);
    }

    // window.location.href = url;
  }

  // Worker only
  function handleStatus(e: React.FormEvent<HTMLFormElement>, chipOrderId: number) {
    e.preventDefault();
    // const dropdown = document.getElementById('status-selection');
    // const selectedStatus = dropdown.options[dropdown.selectedIndex].value;
    // const chipOrderId = Number(e.target.id.replace(/[^0-9]/ig, ''));

    const dropdown = document.getElementById(`status-selection-${chipOrderId}`);
    // @ts-expect-error
    const selectedStatus = dropdown.options[dropdown.selectedIndex].value;
    api.worker.updateChip(cookies.userId, chipOrderId, { status: selectedStatus });
  }

  // TODO: work on option for admin to reassign if needed
  function handleAssign(e: React.ChangeEvent<HTMLSelectElement>) {
    // Using the window.open() method to open a new window and display the page based on the passed in redirectUrl
    const redirectUrl = '/manage/assign-orders';
    const strWindowFeatures = 'width=1200px, height=900px';
    const newWindow = window.open(redirectUrl, '_blank', strWindowFeatures);
    // @ts-expect-error
    newWindow._order = orderList[orderIndex];
  }

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
                  className=""
                  onSubmit={(e) => handleStatus(e, item?.id as number)} // TODO: fix form submission
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
                ? <ArrowDownTrayIcon className="w-5 cursor-pointer mx-auto" onClick={() => handleDownload('', item?.id)} />
                : <ArrowDownTrayIcon className="w-5 cursor-pointer mx-auto" onClick={() => handleDownload(item?.fileInfoId)} />
              }
            </td>
            <td className="">
              <ChatBubbleOvalLeftEllipsisIcon className="w-5 cursor-pointer mx-auto" onClick={() => handleChat(item?.orderInfoId as number)} />
            </td>
            {cookies.userType === ROLES.Admin &&
              <td className="">
                <div className="flex flex-row space-x-2">
                  <UsersIcon className="w-5 cursor-pointer mx-auto" />
                  <select title="workers" onChange={(e) => handleAssign(e)}>
                    {workerList.map((worker) => (
                      <option value={worker?.id}>{worker?.user.username}</option>
                    ))}
                  </select>
                </div>
              </td>
            }
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