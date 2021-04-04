import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { deleteAdminById, userBaseFind, userBaseDeleteById } from '../../api/serverConfig';
import $ from 'jquery';
import Cookies from 'js-cookie';
import API from '../../api/api';

class Admin extends Component {
    constructor(props){
        super(props);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }
    
    handleEdit(){
        let admin = this.props.admin;
        this.props.history.push('/manage/admins/editAdmin',{
            adminId: admin.id,
            adminInfo: admin
        });
    }

    handleDelete(){
        let admin = this.props.admin;
        let url = userBaseFind + `?filter={"where": {"email": "${admin.email}"}}`
        API.Request(url, 'GET', {}, true)
        .then((res) => {
            let userBaseId = res.data[0].id;
            url = userBaseDeleteById.replace('id', userBaseId);
            API.Request(url, 'DELETE', {}, true)
            .then((res) => {
                let url = deleteAdminById.replace('id', admin.id);
                let classSelector = `#admin${admin.id}`;
                API.Request(url, 'DELETE', {}, true)
                .then((response) =>{
                    $(classSelector).remove();
                })
                .catch((err) => {
                    console.error(err);
                });
            })
            .catch((err) => {
                console.error(err);
            })
        })
        .catch((err) => {
            console.error(err);
        });
    }

    render() {
        let admin = this.props.admin;
        return (
            <tr id={`admin${admin.id}`}>
                <td>{admin.id}</td>
                <td>{admin.phoneNumber}</td>
                <td>{admin.realm==null?"Null":admin.realm}</td>
                <td>{admin.username}</td>
                <td>{admin.email}</td>
                <td><i className="fa fa-edit" onClick={this.handleEdit}></i></td>
                {admin.id !== parseInt(Cookies.get('userId')) && 
                    <td><i className="fa fa-trash" onClick={this.handleDelete}></i></td>
                }
                
            </tr>
        );
    }
}

Admin = withRouter(Admin);
export default Admin;
