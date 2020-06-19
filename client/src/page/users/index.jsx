import React from 'react';
import { getAllCustomers } from '../../api/serverConfig';
import API from '../../api/api';
import { CustomerList } from './customerList.jsx';

class Users extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            customerList: []
        }
        this.handleAddUsers = this.handleAddUsers.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }
    handleAddUsers() {
        let _this = this;
        _this.props.history.push('/manage/users/addNewUser')
    }
    componentDidMount() {
        let url = getAllCustomers;
        let params = {};
        API.Request(url, 'GET', params, true)
           .then( res => {
              this.setState({
                  customerList: res.data
                });
           })
           .catch(err => {
               console.log(err);
           })
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
                                <CustomerList customerArray={this.state.customerList}/>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default Users;