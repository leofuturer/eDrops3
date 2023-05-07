import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { request } from '../../api';
import { assignOrders, foundryWorkerGetName, getAllFoundryWorkers } from '../../api';
import ManageRightLayout from '../../component/layout/ManageRightLayout';
import TwoChoiceModal from '../../component/modal/TwoChoiceModal';
import { Worker } from '../../types';
import OrderItem from './orderItem';

function AssignOrders() {
  const [workerList, setWorkerList] = useState<Worker[]>([]);
  const [assignId, setAssignId] = useState('');
  const [chipOrder, setChipOrder] = useState(undefined);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    request(getAllFoundryWorkers, 'GET', {}, true)
      .then((res) => {
        setWorkerList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleAssignId(id: string) {
    setAssignId(id)
    setShowModal(true);
  }

  function handleAssign() {
    setShowModal(false);
    request(foundryWorkerGetName.replace('id', assignId), 'GET', {}, true)
      .then((res) => {
        const data = {
          workerId: assignId,
          workerName: `${res.data.firstName} ${res.data.lastName}`,
        };
        // @ts-expect-error
        return request(assignOrders.replace('id', window._order.id), 'PATCH', data, true);
      })
      .then((res) => {
        window.opener.location.href = window.opener.location.href;
        window.close();
      })
      .catch((err) => {
        console.log(err);
      });;
  }

  // @ts-expect-error
  const order = window._order;
  return (
    <ManageRightLayout title="Assign Order">
      <div className="flex flex-col space-y-2">
        <div className="rounded-md p-2 shadow-box">
          <OrderItem info={order} />
        </div>
        <table className="table-fixed">
          <tr>
            <td>Customer name</td>
            <td>{order.customerName}</td>
          </tr>
          <tr>
            <td>Chip Order ID</td>
            <td>{order.id}</td>
          </tr>
          <tr>
            <td>Order ID</td>
            <td>{order.orderId}</td>
          </tr>
          <tr>
            <td>Customer ID</td>
            <td>{order.customerId}</td>
          </tr>
          <tr>
            <td>File ID</td>
            <td>{order.fileInfoId}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td>{order.status}</td>
          </tr>
        </table>
          <table className="table-info">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Username</th>
                <th>E-mail</th>
                <th>Phone</th>
                <th>Affiliation</th>
                <th>Assign</th>
              </tr>
            </thead>
            <tbody>
              {workerList.map((worker, index) => (
                <tr key={index}>
                  <td>{`${worker.firstName} ${worker.lastName}`}</td>
                  <td>{worker.username}</td>
                  <td>{worker.email}</td>
                  <td>{worker.phoneNumber}</td>
                  <td>{worker.affiliation}</td>
                  <td onClick={() => handleAssignId(worker.id)}>
                    <NavLink id={`file${worker.id}`} to="#">
                      Assign to Him/Her
                    </NavLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
      {showModal && (
        <TwoChoiceModal
          title="eDroplets"
          content="Do you want to assign the order to this worker?"
          affirmativeText="Yes"
          negativeText="Cancel"
          handleAffirmative={handleAssign}
          handleNegative={() => setShowModal(false)}
        />)}
    </ManageRightLayout>
  );
}

export default AssignOrders;
