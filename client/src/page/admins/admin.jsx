import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import $ from 'jquery';
import Cookies from 'js-cookie';
import { deleteAdminById, userBaseFind, userBaseDeleteById } from '../../api/serverConfig';
import API from '../../api/api';
import DeletePopup from '../../component/popup/deletePopup.jsx';
import './admin.css';

class Admin extends Component {
  constructor(props) {
    super(props);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleEdit() {
    const { admin } = this.props;
    this.props.history.push('/manage/admins/editAdmin', {
      adminId: admin.id,
      adminInfo: admin,
    });
  }

  handleDelete() {
    const { admin } = this.props;
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
    const { admin } = this.props;
    return (
      <tr id={`admin${admin.id}`}>
        <td>{admin.id}</td>
        <td>{admin.phoneNumber}</td>
        <td>{admin.realm == null ? 'Null' : admin.realm}</td>
        <td>{admin.username}</td>
        <td>{admin.email}</td>
        <td>
          <button type="button" className="btn" onClick={this.handleEdit}>
            <i className="fa fa-edit" />
          </button>
        </td>
        {admin.id !== parseInt(Cookies.get('userId'))
          &&
          <td>
            <button type="button" className="btn" data-toggle="modal" data-target="#deleteModal">
              <i className="fa fa-trash" />
            </button>
            <DeletePopup onDelete={this.handleDelete} />
          </td>}
      </tr>
    );
  }
}

Admin = withRouter(Admin);
export default Admin;
