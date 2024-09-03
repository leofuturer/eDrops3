import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, Customer, IncludeUser, DTO } from '@edroplets/api';
import ManageRightLayout from '@/component/layout/ManageRightLayout';
import DeleteModal from '@/component/modal/DeleteModal';
import { ROUTES, idRoute } from '@/router/routes';
import { BanknotesIcon, CircleStackIcon, CurrencyDollarIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';

export function Customers() {
  const [customerList, setCustomerList] = useState<DTO<IncludeUser<Customer>>[]>([]);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteCustomer, setDeleteCustomer] = useState<DTO<Customer>>({} as DTO<Customer>);

  const navigate = useNavigate();

  function handleAddUsers() {
    navigate(ROUTES.ManageCustomersAdd);
  }

  function handleRetrieveFiles(customer: DTO<Customer>) {
    navigate(idRoute(ROUTES.ManageCustomersFiles, customer.id as string));
  }

  function handleRetrieveOrders(customer: DTO<Customer>) {
    navigate(idRoute(ROUTES.ManageCustomersOrders, customer.id as string));
  }

  function handleDeleteCustomer(customer: DTO<Customer>) {
    setShowDelete(true);
    setDeleteCustomer(customer);
  }

  function handleDelete() {
    api.customer.delete(deleteCustomer.id as string).then(() => {
      setCustomerList(customerList.filter((customer) => customer.id !== deleteCustomer.id))
    }).catch((err) => console.error(err));
  }

  function handleEdit(customer: DTO<Customer>) {
    navigate(idRoute(ROUTES.ManageCustomersUpdate, customer.id as string));
  }

  useEffect(() => {
    api.customer.getAll().then((customers) => {
      setCustomerList(customers);
    }).catch((err) => {
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
              <td>{customer.user.username}</td>
              <td>{customer.user.email}</td>
              <td>{customer.phoneNumber}</td>
              <td><CircleStackIcon className="w-5 cursor-pointer" onClick={() => handleRetrieveFiles(customer)} /></td>
              <td><BanknotesIcon className="w-5 cursor-pointer" onClick={() => handleRetrieveOrders(customer)} /></td>
              <td><PencilSquareIcon className="w-5 cursor-pointer" onClick={() => handleEdit(customer)} /></td>
              <td><TrashIcon className="w-5 cursor-pointer" onClick={() => handleDeleteCustomer(customer)} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      {showDelete && <DeleteModal handleHide={() => setShowDelete(false)} handleDelete={handleDelete} />}
    </ManageRightLayout>
  );
}
