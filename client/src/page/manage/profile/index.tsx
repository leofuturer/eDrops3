import SEO from '@/component/header/seo';
import ManageRightLayout from '@/component/layout/ManageRightLayout';
import { AdminProfile, CustomerProfile, WorkerProfile } from '@/component/users';
import { ROLES } from '@/lib/constants/roles';
import { useCookies } from 'react-cookie';
import { metadata } from './metadata';

export function Profile() {
  const [cookies] = useCookies(['userType', 'userId']);

  return (
    <ManageRightLayout title="Profile">
      <SEO
        title="eDroplets | Profile"
        description=""
        metadata={metadata}
      />
      {cookies.userType === ROLES.Admin && <AdminProfile adminId={cookies.userId} />}
      {cookies.userType === ROLES.Customer && <CustomerProfile customerId={cookies.userId} />}
      {cookies.userType === ROLES.Worker && <WorkerProfile workerId={cookies.userId} />}
    </ManageRightLayout>
  );
}
