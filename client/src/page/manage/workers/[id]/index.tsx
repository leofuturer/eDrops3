import ManageRightLayout from '@/component/layout/ManageRightLayout';
import { WorkerProfile } from '@/component/users';
import { ROUTES } from '@/router/routes';
import { Navigate, useParams } from 'react-router-dom';

export function ManageWorker() {
  const { id: workerId } = useParams();

  if (!workerId) {
    return <Navigate to={ROUTES.ManageCustomers} />
  }
  return (
    <ManageRightLayout title='Edit Worker'>
      <WorkerProfile workerId={workerId} />
    </ManageRightLayout>
  )
}

export default ManageWorker