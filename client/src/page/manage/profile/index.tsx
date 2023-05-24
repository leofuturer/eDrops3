import { useCookies } from 'react-cookie';
import SEO from '../../../component/header/seo';
import ManageRightLayout from '../../../component/layout/ManageRightLayout';
import { metadata } from './metadata';
import { AdminProfile, WorkerProfile, CustomerProfile } from '@/component/users';

export function Profile() {
  const [cookies] = useCookies(['userType', 'userId']);

  return (
    <ManageRightLayout title="Profile">
      <SEO
        title="eDroplets | Profile"
        description=""
        metadata={metadata}
      />
      {cookies.userType === 'admin' && <AdminProfile adminId={cookies.userId} />}
      {cookies.userType === 'customer' && <CustomerProfile customerId={cookies.userId} />}
      {cookies.userType === 'worker' && <WorkerProfile workerId={cookies.userId} />}
    </ManageRightLayout>
  );
}
