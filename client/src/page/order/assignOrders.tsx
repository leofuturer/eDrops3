import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import API from '../../api/lib/api';
import { assignOrders, foundryWorkerGetName, getAllFoundryWorkers } from '../../api/lib/serverConfig';
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
    API.Request(getAllFoundryWorkers, 'GET', {}, true)
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
    API.Request(foundryWorkerGetName.replace('id', assignId), 'GET', {}, true)
      .then((res) => {
        const data = {
          workerId: assignId,
          workerName: `${res.data.firstName} ${res.data.lastName}`,
        };
        // @ts-expect-error
        return API.Request(assignOrders.replace('id', window._order.id), 'PATCH', data, true);
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
      <OrderItem info={order} adminAssignOrderDisplay />
      <div className="table-background">
        <table className="table">
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
          title="eDrops"
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
