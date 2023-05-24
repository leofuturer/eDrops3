import ManageRightLayout from '@/component/layout/ManageRightLayout';
import { AdminProfile } from '@/component/users';
import { ROUTES } from '@/router/routes';
import { Navigate, useParams } from 'react-router-dom';

export function ManageAdmin() {
  const { id: adminId } = useParams();

  if (!adminId) {
    return <Navigate to={ROUTES.ManageAdmins} />
  }
  return (
    <ManageRightLayout title='Edit Admin'>
      <AdminProfile adminId={adminId} />
    </ManageRightLayout>
  )
}

export default ManageAdmin