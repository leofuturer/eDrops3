import ManageRightLayout from '@/component/layout/ManageRightLayout';
import DeleteModal from '@/component/modal/DeleteModal';
import { ROUTES, idRoute } from '@/router/routes';
import { Admin, DTO, IncludeUser, api } from '@edroplets/api';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

export function Admins() {
  const [adminList, setAdminList] = useState<DTO<IncludeUser<Admin>>[]>([]);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteAdmin, setDeleteAdmin] = useState<DTO<Admin>>({} as DTO<Admin>);

  const navigate = useNavigate();

  const [cookies] = useCookies(['userId'])

  function handleAddAdmin() {
    navigate(ROUTES.ManageAdminsAdd);
  }

  useEffect(() => {
    api.admin.getAll().then((admins) => {
      setAdminList(admins);
    }).catch((err) => console.log(err));
  }, []);

  function handleEditAdmin(admin: DTO<Admin>) {
    navigate(idRoute(ROUTES.ManageAdminsUpdate, admin.id as string));
  }

  function handleDeleteAdmin(admin: DTO<Admin>) {
    setShowDelete(true);
    setDeleteAdmin(admin);
  }

  function handleDelete() {
    api.admin.delete(deleteAdmin.id as string).then(() => {
      setAdminList(adminList.filter((admin) => admin.id !== deleteAdmin.id))
    }).catch((err) => console.error(err));
  }

  return (
    <ManageRightLayout title="All Admins">
      <div className="flex justify-end mb-4 -mt-4">
        <button type="button" className="bg-green-500 text-white px-4 py-2 w-max rounded-lg flex items-center space-x-2" onClick={handleAddAdmin}>
          <i className="fa fa-plus" />
          <p>Add New Admin</p>
        </button>
      </div>
      <table className="table-info">
        <thead>
          <tr>
            <th>ID</th>
            <th>Phone</th>
            <th>Login username</th>
            <th>E-mail</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {adminList.map((admin) => (
            <tr id={`admin${admin.id}`} key={admin.id}>
              <td>{admin.id}</td>
              <td>{admin.phoneNumber}</td>
              <td>{admin.user.username}</td>
              <td>{admin.user.email}</td>
              <td>
                <i className="fa fa-edit cursor-pointer" onClick={() => handleEditAdmin(admin)} />
              </td>
              {admin.id !== cookies.userId && (
                <td>
                  <i className="fa fa-trash cursor-pointer" onClick={() => handleDeleteAdmin(admin)} />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {showDelete && <DeleteModal handleHide={() => setShowDelete(false)} handleDelete={handleDelete} />}
    </ManageRightLayout>
  );
}
