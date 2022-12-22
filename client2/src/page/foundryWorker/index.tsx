import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import API from '../../api/api';
import {
  getAllFoundryWorkers, editFoundryWorker, userBaseFind, userBaseDeleteById,
} from '../../api/serverConfig';
import DeleteModal from '../../component/modal/DeleteModal';
import { useNavigate } from 'react-router-dom';
import ManageRightLayout from '../../component/layout/ManageRightLayout';

function FoundryWorker() {
  const [workerList, setWorkerList] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteWorker, setDeleteWorker] = useState({});

  const navigate = useNavigate();

  function handleAddWorker() {
    navigate('/manage/foundryworkers/addfoundryworker');
  }

  function handleRetrieveChipOrders(worker) {
    navigate('/manage/admin-retrieve-worker-orders', {
      state: {
        workerId: worker.id,
        isCustomer: false,
      },
    });
  }

  function handleEditWorker(worker) {
    navigate('/manage/foundryworkers/editworker', {
      state: {
        workerId: worker.id,
        workerInfo: worker,
      }
    });
  }

  function handleDeleteWorker(worker) {
    setShowDelete(true);
    setDeleteWorker(worker);
  }

  function handleDelete() {
    // we need to delete both userBase and worker instances
    let url = `${userBaseFind}?filter={"where": {"email": "${deleteWorker.email}"}}`;
    API.Request(url, 'GET', {}, true)
      .then((res) => {
        const userBaseId = res.data[0].id;
        url = userBaseDeleteById.replace('id', userBaseId);
        API.Request(url, 'DELETE', {}, true)
          .then((res) => {
            url = editFoundryWorker.replace('id', deleteWorker.id);
            const classSelector = `#worker${deleteWorker.id}`;
            API.Request(url, 'DELETE', {}, true)
              .then((res) => {
                // console.log(res);
                $(classSelector).remove();
              })
              .catch((err) => {
                console.error(err);
              });
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    API.Request(getAllFoundryWorkers, 'GET', {}, true)
      .then((res) => {
        setWorkerList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <ManageRightLayout title="All Foundry Workers">
      <div>
        <button type="button" className="btn btn-primary" onClick={handleAddWorker}>Add New Foundry Worker</button>
      </div>
      <table className="table-info">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Login Username</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Affiliation</th>
            <th>Chip Orders</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {workerList.map((worker) => (
            <tr key={worker.id}>
              <td>{`${worker.firstName} ${worker.lastName}`}</td>
              <td>{worker.username}</td>
              <td>{worker.email}</td>
              <td>{worker.phoneNumber}</td>
              <td>{worker.affiliation}</td>
              <td>
                <i className="fa fa-microchip" onClick={() => handleRetrieveChipOrders(worker)} />
              </td>
              <td>
                <i className="fa fa-edit" onClick={() => handleEditWorker(worker)} />
              </td>
              <td>
                <i className="fa fa-trash" onClick={() => handleDeleteWorker(worker)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showDelete && <DeleteModal handleHide={() => setShowDelete(false)} handleDelete={handleDelete} />}
    </ManageRightLayout>
  );
}

export default FoundryWorker;
