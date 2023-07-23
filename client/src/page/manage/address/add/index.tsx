import AddAddress from '@/component/address/AddAddress';
import ManageRightLayout from '@/component/layout/ManageRightLayout';
import { ROUTES } from '@/router/routes';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

export function AddNewAddress() {
  const navigate = useNavigate();
  const [cookies] = useCookies(['userId'])

  return (
    <ManageRightLayout title="Add New Address">
      <AddAddress userId={cookies.userId} onAdd={(addr) => { navigate(ROUTES.ManageAddress) }} />
    </ManageRightLayout>
  );
}
