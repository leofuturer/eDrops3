import React from 'react';
import { withRouter } from 'react-router-dom';
import $ from 'jquery';
import { customerDeleteById, userBaseFind, userBaseDeleteById } from '../../api/serverConfig';
import API from '../../api/api';
import './user.css';

class Customer extends React.Component {
  constructor(props) {
    super(props);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleRetrieveFiles = this.handleRetrieveFiles.bind(this);
    this.handleRetrieveOrders = this.handleRetrieveOrders.bind(this);
  }

  handleRetrieveFiles() {
    const customerId = this.props.customer.id;
    this.props.history.push('/manage/admin-retrieve-user-files', {
      userId: customerId,
      isCustomer: true,
      username: this.props.customer.username,
    });
  }

  handleRetrieveOrders() {
    const customerId = this.props.customer.id;
    this.props.history.push('/manage/admin-retrieve-user-orders', {
      userId: customerId,
      isCustomer: true,
      username: this.props.customer.username,
    });
  }

  handleDelete() {
    // we need to delete both userBase and customer instances
    const { customer } = this.props;
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
    const { customer } = this.props;
    this.props.history.push('/manage/users/edituser', {
      customerId: customer.id,
      customerInfo: customer,
    });
  }

  render() {
    const { customer } = this.props;
    return (
      <tr id={`customer${customer.id}`}>
        <td>{customer.id}</td>
        <td>{`${customer.firstName} ${customer.lastName}`}</td>
        <td>{customer.username}</td>
        <td>{customer.email}</td>
        <td>{customer.phoneNumber}</td>
        <td><i className="fa fa-database" onClick={this.handleRetrieveFiles} /></td>
        <td><i className="fa fa-money" onClick={this.handleRetrieveOrders} /></td>
        <td><i className="fa fa-edit" onClick={this.handleEdit} /></td>
        <td><i className="fa fa-trash" onClick={this.handleDelete} /></td>
      </tr>
    );
  }
}

Customer = withRouter(Customer);
export default Customer;
