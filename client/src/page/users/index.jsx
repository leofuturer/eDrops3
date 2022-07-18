import React from 'react';
import { withRouter } from 'react-router-dom';
import { getAllCustomers, customerDeleteById, userBaseFind, userBaseDeleteById } from '../../api/serverConfig';
import API from '../../api/api';
import $ from 'jquery';
import DeletePopup from '../../component/popup/deletePopup.jsx';

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customerList: [],
    };
    this.handleAddUsers = this.handleAddUsers.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleRetrieveFiles = this.handleRetrieveFiles.bind(this);
    this.handleRetrieveOrders = this.handleRetrieveOrders.bind(this);
    this.handleDeleteCustomer = this.handleDeleteCustomer.bind(this);
  }

  handleAddUsers() {
    const _this = this;
    _this.props.history.push('/manage/users/addNewUser');
  }

  handleRetrieveFiles(e) {
    const customer = JSON.parse(e.target.getAttribute('customer'));
    this.props.history.push('/manage/admin-retrieve-user-files', {
      userId: customer.id,
      isCustomer: true,
      username: customer.username,
    });
  }

  handleRetrieveOrders(e) {
    const customer = JSON.parse(e.target.getAttribute('customer'));
    this.props.history.push('/manage/admin-retrieve-user-orders', {
      userId: customer.id,
      isCustomer: true,
      username: customer.username,
    });
  }

  handleDeleteCustomer(e) {
    const customer = JSON.parse(e.target.getAttribute('customer'));
    this.setState({
      deleteCustomer: customer,
    });
  }

  handleDelete() {
    // we need to delete both userBase and customer instances
    const customer = this.state.deleteCustomer;
    let url = `${userBaseFind}?filter={"where": {"email": "${customer.email}"}}`;
    API.Request(url, 'GET', {}, true)
      .then((res) => {
        const userBaseId = res.data[0].id;
        url = userBaseDeleteById.replace('id', userBaseId);
        API.Request(url, 'DELETE', {}, true)
          .then((res) => {
            url = customerDeleteById.replace('id', customer.id);
            const classSelector = `#customer${customer.id}`;
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

  handleEdit() {
    const customer = JSON.parse(e.target.getAttribute('customer'))
    this.props.history.push('/manage/users/edituser', {
      customerId: customer.id,
      customerInfo: customer,
    });
  }

  componentDidMount() {
    const url = getAllCustomers;
    const params = {};
    API.Request(url, 'GET', params, true)
      .then((res) => {
        this.setState({
          customerList: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <div className="right-route-content">
        <div className="profile-content">
          <h2>All Users</h2>
        </div>
        <div className="content-show-table row">
          <div>
            <button className="btn btn-primary" onClick={this.handleAddUsers}>Add New User</button>
          </div>
          <div className="table-background">
            <table className="table">
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
                {this.state.customerList.map((customer) =>
                  <tr id={`customer${customer.id}`}>
                    <td>{customer.id}</td>
                    <td>{`${customer.firstName} ${customer.lastName}`}</td>
                    <td>{customer.username}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phoneNumber}</td>
                    <td><i className="fa fa-database" customer={JSON.stringify(customer)} onClick={this.handleRetrieveFiles} /></td>
                    <td><i className="fa fa-money" customer={JSON.stringify(customer)} onClick={this.handleRetrieveOrders} /></td>
                    <td><i className="fa fa-edit" customer={JSON.stringify(customer)} onClick={this.handleEdit} /></td>
                    <td><i className="fa fa-trash" customer={JSON.stringify(customer)} data-toggle="modal" data-target="#deleteModal" onClick={this.handleDeleteCustomer} /></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <DeletePopup onDelete={this.handleDelete} />
      </div>
    );
  }
}

Users = withRouter(Users);
export default Users;
