import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { request, customerDeleteById, getAllCustomers, userBaseDeleteById, userBaseFind } from '@/api';
import ManageRightLayout from '@/component/layout/ManageRightLayout';
import DeleteModal from '@/component/modal/DeleteModal';
import { Customer } from '@/types';
import { ROUTES, idRoute } from '@/router/routes';

export function Customers() {
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteCustomer, setDeleteCustomer] = useState<Customer>({} as Customer);

  const navigate = useNavigate();

  function handleAddUsers() {
    navigate(ROUTES.ManageCustomersAdd);
  }

  function handleRetrieveFiles(customer: Customer) {
    navigate(idRoute(ROUTES.ManageCustomersFiles, customer.id));
  }

  function handleRetrieveOrders(customer: Customer) {
    navigate(idRoute(ROUTES.ManageCustomersOrders, customer.id));
  }

  function handleDeleteCustomer(customer: Customer) {
    setShowDelete(true);
    setDeleteCustomer(customer);
  }

  function handleDelete() {
    // we need to delete both userBase and customer instances
    request(`${userBaseFind}?filter={"where": {"email": "${deleteCustomer.email}"}}`, 'GET', {}, true)
      .then((res) => request(userBaseDeleteById.replace('id', res.data[0].id), 'DELETE', {}, true))
      .then((res) => request(customerDeleteById.replace('id', deleteCustomer.id), 'DELETE', {}, true))
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
    request(getAllCustomers, 'GET', {}, true)
      .then((res) => {
        setCustomerList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <ManageRightLayout title="All Users">
      <div className="flex justify-end mb-4 -mt-4">
        <button type="button" className="bg-green-500 text-white px-4 py-2 w-max rounded-lg flex items-center space-x-2" onClick={handleAddUsers}>
          <i className="fa fa-plus" />
          <p>Add New User</p>
        </button>
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