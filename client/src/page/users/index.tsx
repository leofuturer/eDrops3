import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/lib/api';
import { customerDeleteById, getAllCustomers, userBaseDeleteById, userBaseFind } from '../../api/lib/serverConfig';
import ManageRightLayout from '../../component/layout/ManageRightLayout';
import DeleteModal from '../../component/modal/DeleteModal';
import { Customer } from '../../types';

function Users() {
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteCustomer, setDeleteCustomer] = useState<Customer>({} as Customer);

  const navigate = useNavigate();

  function handleAddUsers() {
    navigate('/manage/users/addNewUser');
  }

  function handleRetrieveFiles(customer: Customer) {
    navigate('/manage/admin-retrieve-user-files', {
      state: {
        userId: customer.id,
        isCustomer: true,
        username: customer.username,
      }
    });
  }

  function handleRetrieveOrders(customer: Customer) {
    navigate('/manage/admin-retrieve-user-orders', {
      state: {
        userId: customer.id,
        isCustomer: true,
        username: customer.username,
      }
    });
  }

  function handleDeleteCustomer(customer: Customer) {
    setShowDelete(true);
    setDeleteCustomer(customer);
  }

  function handleDelete() {
    // we need to delete both userBase and customer instances
    API.Request(`${userBaseFind}?filter={"where": {"email": "${deleteCustomer.email}"}}`, 'GET', {}, true)
      .then((res) => API.Request(userBaseDeleteById.replace('id', res.data[0].id), 'DELETE', {}, true))
      .then((res) => API.Request(customerDeleteById.replace('id', deleteCustomer.id), 'DELETE', {}, true))
      .then((res) => setCustomerList(customerList.filter((customer) => customer.id !== deleteCustomer.id)))
      .catch((err) => console.error(err));
  }

  function handleEdit(customer: Customer) {
    navigate('/manage/users/edituser', {
      state: {
        customerId: customer.id,
        customerInfo: customer,
      }
    });
  }

  useEffect(() => {
    API.Request(getAllCustomers, 'GET', {}, true)
      .then((res) => {
        setCustomerList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <ManageRightLayout title="All Users">
      <div>
        <button type="button" className="btn btn-primary" onClick={handleAddUsers}>Add New User</button>
      </div>
      <table className="table-info">
        <thead>
          <tr>
            <th>ID</th>
            <th>Full name</th>
            <th>Login username</th>
            <th>E-mail</th>
            <th>Phone</th>
            <th>Files</th>
            <th>Orders</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {customerList.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{`${customer.firstName} ${customer.lastName}`}</td>
              <td>{customer.username}</td>
              <td>{customer.email}</td>
              <td>{customer.phoneNumber}</td>
              <td><i className="fa fa-database cursor-pointer" onClick={() => handleRetrieveFiles(customer)} /></td>
              <td><i className="fa fa-money-bill cursor-pointer" onClick={() => handleRetrieveOrders(customer)} /></td>
              <td><i className="fa fa-edit cursor-pointer" onClick={() => handleEdit(customer)} /></td>
              <td><i className="fa fa-trash cursor-pointer" onClick={() => handleDeleteCustomer(customer)} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      {showDelete && <DeleteModal handleHide={() => setShowDelete(false)} handleDelete={handleDelete} />}
    </ManageRightLayout>
  );
}

export default Users;
