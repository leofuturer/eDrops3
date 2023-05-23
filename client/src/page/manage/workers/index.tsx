import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { request, editFoundryWorker, getAllFoundryWorkers, userBaseDeleteById, userBaseFind } from '@/api';
import ManageRightLayout from '@/component/layout/ManageRightLayout';
import DeleteModal from '@/component/modal/DeleteModal';
import { FoundryWorker } from '@/types';
import { ROUTES, idRoute } from '@/router/routes';

export function FoundryWorkers() {
  const [workerList, setWorkerList] = useState<FoundryWorker[]>([]);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteWorker, setDeleteWorker] = useState<FoundryWorker>({} as FoundryWorker);

  const navigate = useNavigate();

  function handleAddWorker() {
    navigate(ROUTES.ManageWorkersAdd);
  }

  function handleRetrieveChipOrders(worker: FoundryWorker) {
    navigate(idRoute(ROUTES.ManageWorkersOrders, worker.id as string));
  }

  function handleEditWorker(worker: FoundryWorker) {
    navigate(idRoute(ROUTES.ManageWorkersUpdate, worker.id as string));
  }

  function handleDeleteWorker(worker: FoundryWorker) {
    setShowDelete(true);
    setDeleteWorker(worker);
  }

  function handleDelete() {
    // we need to delete both userBase and worker instances
    let url = `${userBaseFind}?filter={"where": {"email": "${deleteWorker.id}"}}`;
    request(url, 'GET', {}, true)
      .then((res) => request(userBaseDeleteById.replace('id', res.data[0].id), 'DELETE', {}, true))
      .then((res) => request(editFoundryWorker.replace('id', deleteWorker.id), 'DELETE', {}, true))
      .then((res) => {
        // console.log(res);
        setWorkerList(workerList.filter((worker) => worker.id !== deleteWorker.id));
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    request(getAllFoundryWorkers, 'GET', {}, true)
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
