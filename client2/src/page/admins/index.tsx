import React, { Component } from 'react';
import $ from 'jquery';
import Cookies from 'js-cookie';
import {
  deleteAdminById, userBaseFind, userBaseDeleteById, findAdminByWhere,
} from '../../api/serverConfig';
import API from '../../api/api';
import DeleteModal from '../../component/modal/DeleteModal';

class Admins extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adminList: [],
    };
    this.handleAddAdmin = this.handleAddAdmin.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleEditAdmin = this.handleEditAdmin.bind(this);
    this.handleDeleteAdmin = this.handleDeleteAdmin.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleAddAdmin() {
    const _this = this;
    _this.props.history.push('/manage/admins/addNewAdmin');
  }

  componentDidMount() {
    const url = findAdminByWhere;
    API.Request(url, 'GET', {}, true)
      .then((response) => {
        this.setState({ adminList: response.data });
      })
      .catch((err) => console.log(err));
  }

  handleEditAdmin(e) {
    const admin = JSON.parse(e.target.getAttribute('admin'));
    this.props.history.push('/manage/admins/editAdmin', {
      adminId: admin.id,
      adminInfo: admin,
    });
  }

  handleDeleteAdmin(e) {
    const admin = JSON.parse(e.target.getAttribute('admin'));
    this.setState({ deleteAdmin: admin });
  }

  handleDelete() {
    const admin = this.state.deleteAdmin;
    let url = `${userBaseFind}?filter={"where": {"email": "${admin.email}"}}`;
    API.Request(url, 'GET', {}, true)
      .then((res) => {
        const userBaseId = res.data[0].id;
        url = userBaseDeleteById.replace('id', userBaseId);
        API.Request(url, 'DELETE', {}, true)
          .then((res) => {
            const url = deleteAdminById.replace('id', admin.id);
            const classSelector = `#admin${admin.id}`;
            API.Request(url, 'DELETE', {}, true)
              .then((response) => {
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
                {this.state.adminList.map((admin) => (
                  <tr id={`admin${admin.id}`} key={admin.id}>
                    <td>{admin.id}</td>
                    <td>{admin.phoneNumber}</td>
                    <td>{admin.realm == null ? 'Null' : admin.realm}</td>
                    <td>{admin.username}</td>
                    <td>{admin.email}</td>
                    <td>
                      <i className="fa fa-edit" admin={JSON.stringify(admin)} onClick={this.handleEditAdmin} />
                    </td>
                    {admin.id !== parseInt(Cookies.get('userId'))
                      && (
                      <td>
                        <i className="fa fa-trash" admin={JSON.stringify(admin)} data-toggle="modal" data-target="#deleteModal" onClick={this.handleDeleteAdmin} />
                      </td>
                      )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <DeleteModal handleHide={() => {}} handleDelete={this.handleDelete} />
      </div>
    );
  }
}

export default Admins;
