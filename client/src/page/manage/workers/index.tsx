import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/api';
import ManageRightLayout from '@/component/layout/ManageRightLayout';
import DeleteModal from '@/component/modal/DeleteModal';
import { DTO, FoundryWorker, IncludeUser } from '@/types';
import { ROUTES, idRoute } from '@/router/routes';
import { CpuChipIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';

export function FoundryWorkers() {
  const [workerList, setWorkerList] = useState<DTO<IncludeUser<FoundryWorker>>[]>([]);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteWorker, setDeleteWorker] = useState<DTO<FoundryWorker>>({} as DTO<FoundryWorker>);

  const navigate = useNavigate();

  function handleAddWorker() {
    navigate(ROUTES.ManageWorkersAdd);
  }

  function handleRetrieveChipOrders(worker: DTO<FoundryWorker>) {
    navigate(idRoute(ROUTES.ManageWorkersOrders, worker.id as string));
  }

  function handleEditWorker(worker: DTO<FoundryWorker>) {
    navigate(idRoute(ROUTES.ManageWorkersUpdate, worker.id as string));
  }

  function handleDeleteWorker(worker: DTO<FoundryWorker>) {
    setShowDelete(true);
    setDeleteWorker(worker);
  }

  function handleDelete() {
    api.worker.delete(deleteWorker.id as string).then(() => {
      setWorkerList(workerList.filter((worker) => worker.id !== deleteWorker.id));
    }).catch((err) => {
      console.error(err);
    });
  }

  useEffect(() => {
    api.worker.getAll().then((workers) => {
      setWorkerList(workers);
    }).catch((err) => {
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
          {workerList.map((worker: DTO<IncludeUser<FoundryWorker>>) => (
            <tr key={worker.id}>
              <td>{`${worker.firstName} ${worker.lastName}`}</td>
              <td>{worker.user.username}</td>
              <td>{worker.user.email}</td>
              <td>{worker.phoneNumber}</td>
              <td>{worker.affiliation}</td>
              <td>
                <CpuChipIcon className="w-5 cursor-pointer" onClick={() => handleRetrieveChipOrders(worker)} />
              </td>
              <td>
                <PencilSquareIcon className="w-5 cursor-pointer" onClick={() => handleEditWorker(worker)} />
              </td>
              <td>
                <TrashIcon className="w-5 cursor-pointer" onClick={() => handleDeleteWorker(worker)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showDelete && <DeleteModal handleHide={() => setShowDelete(false)} handleDelete={handleDelete} />}
    </ManageRightLayout>
  );
}
