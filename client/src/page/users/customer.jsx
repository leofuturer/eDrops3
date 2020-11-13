import React from 'react';
import { withRouter } from 'react-router-dom';
import { customerDeleteById } from '../../api/serverConfig';
import $ from 'jquery';
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
        let customerId = this.props.customer.id;
        this.props.history.push('/manage/admin-retrieve-user-files', {
            userId: customerId,
            isCustomer: true,
            username: this.props.customer.username
        });
    }

    handleRetrieveOrders(){
        let customerId = this.props.customer.id;
        this.props.history.push('/manage/admin-retrieve-user-orders', {
            userId: customerId,
            isCustomer: true,
            username: this.props.customer.username
        })
    }

    handleDelete() {
        let customer = this.props.customer;
        let data = {};
        let url = customerDeleteById.replace('id', customer.id);
        let classSelector = `#customer${customer.id}`;
        API.Request(url, 'DELETE', data, true)
        .then((res) => {
            console.log(res);
            $(classSelector).remove();
        })
        .catch((err) => {
            console.log(err);
        });
    }

    handleEdit() {
        let customer = this.props.customer;
        this.props.history.push('/manage/users/edituser', {
            customerId: customer.id,
            customerInfo: customer
        });
    }

    render() {
        let customer = this.props.customer;
        return (
            <tr id={`customer${customer.id}`}>
                <td>{customer.id}</td>
                <td>{customer.firstName + ' ' + customer.lastName}</td>
                <td>{customer.username}</td>
                <td>{customer.email}</td>
                <td>{customer.phoneNumber}</td>
                <td><i className="fa fa-database" onClick={this.handleRetrieveFiles}></i></td>
                <td><i className="fa fa-money" onClick={this.handleRetrieveOrders}></i></td>
                <td><i className="fa fa-edit" onClick={this.handleEdit}></i></td>
                <td><i className="fa fa-trash" onClick={this.handleDelete}></i></td>
            </tr>
        );
    }
}

Customer = withRouter(Customer);
export default Customer;
