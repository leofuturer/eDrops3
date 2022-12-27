import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/lib/api';
import { editFoundryWorker, getAllFoundryWorkers, userBaseDeleteById, userBaseFind } from '../../api/lib/serverConfig';
import ManageRightLayout from '../../component/layout/ManageRightLayout';
import DeleteModal from '../../component/modal/DeleteModal';
import { Worker } from '../../types';

function FoundryWorker() {
  const [workerList, setWorkerList] = useState<Worker[]>([]);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteWorker, setDeleteWorker] = useState<Worker>({} as Worker);

  const navigate = useNavigate();

  function handleAddWorker() {
    navigate('/manage/foundryworkers/addfoundryworker');
  }

  function handleRetrieveChipOrders(worker: Worker) {
    navigate('/manage/admin-retrieve-worker-orders', {
      state: {
        workerId: worker.id,
        isCustomer: false,
      },
    });
  }

  function handleEditWorker(worker: Worker) {
    navigate('/manage/foundryworkers/editworker', {
      state: {
        workerId: worker.id,
        workerInfo: worker,
      }
    });
  }

  function handleDeleteWorker(worker: Worker) {
    setShowDelete(true);
    setDeleteWorker(worker);
  }

  function handleDelete() {
    // we need to delete both userBase and worker instances
    let url = `${userBaseFind}?filter={"where": {"email": "${deleteWorker.email}"}}`;
    API.Request(url, 'GET', {}, true)
      .then((res) => API.Request(userBaseDeleteById.replace('id', res.data[0].id), 'DELETE', {}, true))
      .then((res) => API.Request(editFoundryWorker.replace('id', deleteWorker.id), 'DELETE', {}, true))
      .then((res) => {
        // console.log(res);
        setWorkerList(workerList.filter((worker) => worker.id !== deleteWorker.id));
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
      <div className="flex justify-end mb-4 -mt-4">
        <button type="button" className="bg-green-500 text-white px-4 py-2 w-max rounded-lg flex items-center space-x-2" onClick={handleAddWorker}>
          <i className="fa fa-plus" />
          <p>Add New Foundry Worker</p>
        </button>
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
          {workerList.map((worker: Worker) => (
            <tr key={worker.id}>
              <td>{`${worker.firstName} ${worker.lastName}`}</td>
              <td>{worker.username}</td>
              <td>{worker.email}</td>
              <td>{worker.phoneNumber}</td>
              <td>{worker.affiliation}</td>
              <td>
                <i className="fa fa-microchip cursor-pointer" onClick={() => handleRetrieveChipOrders(worker)} />
              </td>
              <td>
                <i className="fa fa-edit cursor-pointer" onClick={() => handleEditWorker(worker)} />
              </td>
              <td>
                <i className="fa fa-trash cursor-pointer" onClick={() => handleDeleteWorker(worker)} />
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
