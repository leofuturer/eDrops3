import ManageRightLayout from '@/component/layout/ManageRightLayout';
import { CustomerProfile } from '@/component/users';
import { ROUTES } from '@/router/routes';
import { Navigate, useParams } from 'react-router-dom';

export function ManageCustomer() {
  const { id: customerId } = useParams();

  if (!customerId) {
    return <Navigate to={ROUTES.ManageCustomers} />;
  }
  return (
    <ManageRightLayout title="Edit Customer">
      <CustomerProfile customerId={customerId} />
    </ManageRightLayout>
  );
}

export default ManageCustomer;
