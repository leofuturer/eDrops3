import React, { Component } from 'react'
import {findAdminByWhere} from '../../api/serverConfig'
import API from '../../api/api';
import {AdminList} from './adminList.jsx'

class Admins extends Component {
    constructor(props){
        super(props);
        this.state={
            adminList: []
        }
        this.handleAddAdmin = this.handleAddAdmin.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }
    handleAddAdmin(){
        let _this = this;
        _this.props.history.push('/manage/admins/addNewAdmin');
    }
    componentDidMount(){
        let url = findAdminByWhere;
        API.Request(url, 'GET', {}, true)
            .then(response => {
                this.setState({adminList: response.data});
                // conßsole.log(response.data);
            })
            .catch(err => console.log(err));
    }
    render() {
        return (
            <div className="right-route-content">
                <div className="profile-content">
                    <h2>All Admins</h2>
                </div>
                <div className="content-show-table row">
                    <div>
                        <button className="btn btn-primary" onClick={this.handleAddAdmin}>Add New Admin</button>
                    </div>
                    <div className="table-background">
                        <table className="table">
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
                                <AdminList adminArray={this.state.adminList}/>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default Admins;