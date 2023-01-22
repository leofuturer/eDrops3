import { useCookies } from 'react-cookie';
import SEO from '../../component/header/seo';
import ManageRightLayout from '../../component/layout/ManageRightLayout';
import AdminProfile from './AdminProfile';
import CustomerProfile from './CustomerProfile';
import { metadata } from './metadata';
import WorkerProfile from './WorkerProfile';

function Profile() {
  const [cookies] = useCookies(['userType']);

  return (
    <ManageRightLayout title="Profile">
      <SEO
        title="eDrops | Profile"
        description=""
        metadata={metadata}
      />
      {cookies.userType === 'admin' && <AdminProfile />}
      {cookies.userType === 'customer' && <CustomerProfile />}
      {cookies.userType === 'worker' && <WorkerProfile />}
    </ManageRightLayout>
  );
}

export default Profile;
