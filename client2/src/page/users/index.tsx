import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import {
  getAllCustomers, customerDeleteById, userBaseFind, userBaseDeleteById,
} from '../../api/serverConfig';
import API from '../../api/api';
import DeleteModal from '../../component/modal/DeleteModal';
import { useNavigate } from 'react-router-dom';
import ManageRightLayout from '../../component/layout/ManageRightLayout';

function Users() {
  const [customerList, setCustomerList] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteCustomer, setDeleteCustomer] = useState({});

  const navigate = useNavigate();

  function handleAddUsers() {
    navigate('/manage/users/addNewUser');
  }

  function handleRetrieveFiles(customer) {
    navigate('/manage/admin-retrieve-user-files', {
      state: {
        userId: customer.id,
        isCustomer: true,
        username: customer.username,
      }
    });
  }

  function handleRetrieveOrders(customer) {
    navigate('/manage/admin-retrieve-user-orders', {
      state: {
        userId: customer.id,
        isCustomer: true,
        username: customer.username,
      }
    });
  }

  function handleDeleteCustomer(customer) {
    setShowDelete(true);
    setDeleteCustomer(customer);
  }

  function handleDelete() {
    // we need to delete both userBase and customer instances
    let url = `${userBaseFind}?filter={"where": {"email": "${deleteCustomer.email}"}}`;
    API.Request(url, 'GET', {}, true)
      .then((res) => {
        const userBaseId = res.data[0].id;
        url = userBaseDeleteById.replace('id', userBaseId);
        API.Request(url, 'DELETE', {}, true)
          .then((res) => {
            url = customerDeleteById.replace('id', deleteCustomer.id);
            const classSelector = `#customer${deleteCustomer.id}`;
            API.Request(url, 'DELETE', {}, true)
              .then((res) => {
                $(classSelector).remove();
              })
              .catch((err) => {
                console.error(err);
              });
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function handleEdit(customer) {
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
              <td><i className="fa fa-database" onClick={() => handleRetrieveFiles(customer)} /></td>
              <td><i className="fa fa-money" onClick={() => handleRetrieveOrders(customer)} /></td>
              <td><i className="fa fa-edit" onClick={() => handleEdit(customer)} /></td>
              <td><i className="fa fa-trash" onClick={() => handleDeleteCustomer(customer)} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      {showDelete && <DeleteModal handleHide={() => setShowDelete(false)} handleDelete={handleDelete} />}
    </ManageRightLayout>
  );
}

export default Users;
