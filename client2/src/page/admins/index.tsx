import $ from 'jquery';
import Cookies from 'js-cookie';
import {
  deleteAdminById, userBaseFind, userBaseDeleteById, findAdminByWhere,
} from '../../api/serverConfig';
import API from '../../api/api';
import DeleteModal from '../../component/modal/DeleteModal';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Admin } from '../../types';
import { useCookies } from 'react-cookie';
import ManageRightLayout from '../../component/layout/ManageRightLayout';

function Admins() {
  const [adminList, setAdminList] = useState<Admin[]>([]);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteAdmin, setDeleteAdmin] = useState<Admin>({} as Admin);

  const navigate = useNavigate();

  const [cookies] = useCookies(['userId'])

  function handleAddAdmin() {
    navigate('/manage/admins/addNewAdmin');
  }

  useEffect(() => {
    API.Request(findAdminByWhere, 'GET', {}, true)
      .then((res) => {
        setAdminList(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  function handleEditAdmin(admin: Admin) {
    navigate('/manage/admins/editAdmin', {
      state: {
        adminId: admin.id,
        adminInfo: admin,
      },
    });
  }

  function handleDeleteAdmin(admin: Admin) {
    setShowDelete(true);
    setDeleteAdmin(admin);
  }

  function handleDelete() {
    API.Request(`${userBaseFind}?filter={"where": {"email": "${deleteAdmin.email}"}}`, 'GET', {}, true)
      .then((res) => API.Request(userBaseDeleteById.replace('id', res.data[0].id), 'DELETE', {}, true))
      .then((res) => API.Request(deleteAdminById.replace('id', deleteAdmin.id), 'DELETE', {}, true))
      .then((res) => setAdminList(adminList.filter((admin) => admin.id !== deleteAdmin.id)))
      .catch((err) => console.error(err));
  }

  return (
    <ManageRightLayout title="All Admins">
      <div>
        <button type="button" className="btn btn-primary" onClick={handleAddAdmin}>Add New Admin</button>
      </div>
      <table className="table-info">
        <thead>
          <tr>
            <th>ID</th>
            <th>Phone</th>
            <th>Realm</th>
            <th>Login username</th>
            <th>E-mail</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {adminList.map((admin: Admin) => (
            <tr id={`admin${admin.id}`} key={admin.id}>
              <td>{admin.id}</td>
              <td>{admin.phoneNumber}</td>
              <td>{admin.realm == null ? 'Null' : admin.realm}</td>
              <td>{admin.username}</td>
              <td>{admin.email}</td>
              <td>
                <i className="fa fa-edit" onClick={() => handleEditAdmin(admin)} />
              </td>
              {admin.id !== cookies.userId && (
                <td>
                  <i className="fa fa-trash" onClick={() => handleDeleteAdmin(admin)} />
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

export default Admins;
