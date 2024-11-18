import React, { useContext, useEffect, useState, useRef } from 'react'
import { useCookies } from 'react-cookie';
import { api, DTO, FoundryWorker, IncludeUser, OrderChip } from '@edroplets/api';
import { ROLES } from '@/lib/constants/roles';
import { ArrowDownTrayIcon, ChatBubbleOvalLeftEllipsisIcon, UsersIcon } from '@heroicons/react/24/solid';
import { CartContext } from '@/context';
import { ROUTES, idRoute } from '@/router/routes';
import { OrderChip as OrderChipType } from '@edroplets/api';

function ChipOrderList({ cookies, chipOrderList }: { cookies: any, chipOrderList: DTO<OrderChip>[] }) {
  const [workerList, setWorkerList] = useState<DTO<IncludeUser<FoundryWorker>>[]>([]);
  //const [cookies] = useCookies(['userType', 'userId']);
  const cart = useContext(CartContext);

  useEffect(() => {
    if (cookies.userType === ROLES.Admin) {
      api.worker.getAll().then((workers) => {
        console.log(workers);
        setWorkerList(workers);
      });
    }
  }, [cookies.userType]);

  const statusRefs = useRef<{ [key: number]: HTMLSelectElement }>({});

  function handleStatus(e: React.FormEvent<HTMLFormElement>, chipOrderId: number, item: OrderChipType) {
    e.preventDefault();

    const selectedStatus = statusRefs.current[chipOrderId]?.value;
    console.log(selectedStatus);
    var order;
    if (selectedStatus) {
      console.log("Item: ", item);
      //get all the chip orders for the worker, and set order to be the one with the chipOrderId
      api.worker.getChipOrders(item.workerId).then((res) => {
        console.log(res);
        var order = res.find((o) => o.id === chipOrderId);
        if (order) {
          order.status = selectedStatus;
          api.worker.updateChip(item.workerId, chipOrderId, order).then((res) => {
            console.log(res);
          });
        }
      });
      console.log("Order: ", order);
      if (order) {
        (order as OrderChipType).status = selectedStatus;
        api.worker.updateChip(item.workerId, chipOrderId, order).then((res) => {
          console.log("Result was: ", res);
        });
      }
    }
  }


  function handleDownload(fileId: string, orderId?: number) {
    switch (cookies.userType) {
      case ROLES.Customer:
        api.customer.downloadFile(cookies.userId, fileId, true);
        break;
      case ROLES.Worker:
        // for worker, `id` is chipOrder ID (associated with that file)
        break;
      case ROLES.Admin:
        api.file.download(fileId);
        break;
    }
  }

  function handleChat(orderId: number, item: OrderChipType) {
    console.log("order details: ", item);
    const redirectUrl = idRoute(ROUTES.SubpageOrderChat, orderId) + `?workerName=${encodeURIComponent(item.workerName)}&customerName=${encodeURIComponent(item.customerName)}`;
    const strWindowFeatures = 'width=1200px, height=900px';
    const WindowForOrderChat = window.open(redirectUrl, '_blank', strWindowFeatures);
    // @ts-expect-error
    WindowForOrderChat._orderItemId = orderId;
  }

  function handleAssign(workerId: string, item: OrderChipType) {
    api.order.updateChipOrder(item.orderInfoId as number, item.id as number, { ...item, workerId: workerId } );
  }

  return (
    <table className="table-info">
      <thead>
        <tr>
          <th>ID</th>
          {cookies.userType !== ROLES.Customer && <th>Uploader</th>}
          <th>Last Updated</th>
          {cookies.userType !== ROLES.Worker && <th>Worker</th>}
          {cookies.userType !== ROLES.Worker
            ? <th>Process Status</th>
            : <th className="icon-center">Edit Status</th>}
          <th>Qty</th>
          <th>Mask File</th>
          <th>Chat</th>
          {cookies.userType === ROLES.Admin && <th>Assign Order</th>}
        </tr>
      </thead>
      <tbody>
        {cart.enabled && chipOrderList.length !== 0 ? chipOrderList.map((item, index) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            {cookies.userType !== ROLES.Customer && <td>{item.customerName}</td>}
            <td>{item.lastUpdated.substring(0, item.lastUpdated.indexOf('T'))}</td>
            {cookies.userType !== ROLES.Worker && <td>{item.workerName}</td>}
            {cookies.userType !== ROLES.Worker
              ? <td>{item.status}</td>
              : (
                <td>
                  <form onSubmit={(e) => handleStatus(e, item.id as number, item)}>
                    <select
                      title="status"
                      className="order-status"
                      name="status"
                      defaultValue={item.status}
                      ref={(el) => statusRefs.current[item.id as number] = el!} // Assign ref
                    >
                      <option value="Fabrication request received">Fab Req Received</option>
                      <option value="Project Started">Project Started</option>
                      <option value="Project Completed">Project Completed</option>
                      <option value="Item Shipped">Item Shipped</option>
                    </select>
                    <input type="submit" />
                  </form>
                </td>
              )}
            <td>{item.quantity}</td>
            <td>
              {cookies.userType === ROLES.Worker
                ? <ArrowDownTrayIcon className="w-5 cursor-pointer mx-auto" onClick={() => handleDownload('', item.id)} />
                : <ArrowDownTrayIcon className="w-5 cursor-pointer mx-auto" onClick={() => handleDownload(item.fileInfoId)} />
              }
            </td>
            <td>
              <ChatBubbleOvalLeftEllipsisIcon className="w-5 cursor-pointer mx-auto" onClick={() => handleChat(item.orderInfoId as number, item)} />
            </td>
            {cookies.userType === ROLES.Admin &&
              <td>
                <div className="flex flex-row space-x-2">
                  <UsersIcon className="w-5 cursor-pointer mx-auto" />
                    <select title="workers" onChange={(e) => handleAssign(e.target.value, item)}>
                    {workerList.map((worker) => (
                      <option key={worker.id} value={worker.id}>{worker.user.username}</option>
                    ))}
                  </select>
                </div>
              </td>
            }
          </tr>
        )) : (
          <tr>
            <td className="p-2" colSpan={9}>
              {cookies.userType === ROLES.Worker
                ? <p>No orders have been assigned to you yet.</p>
                : <p>No orders have been placed.</p>}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default ChipOrderList;
