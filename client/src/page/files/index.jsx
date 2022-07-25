import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import $ from 'jquery';

import API from '../../api/api';
import {
  customerFileRetrieve,
  customerDeleteFile,
  downloadFileById,
  adminDownloadFile,
} from '../../api/serverConfig';

import './index.css';
import SEO from '../../component/header/seo.jsx';
import { metadata } from './metadata.jsx';
import DeletePopup from '../../component/popup/deletePopup.jsx';

function padZeroes(time) {
  /**
     * Function to pad zeroes to timestamps
     * Converts H[H]:M[M]:S[S] to HH:MM:SS, Leaves YYYY:M[M]:D[D] as is
     * Example: 2020-7-2 5:3:2 -> 05:03:02 (5:03 AM, and then 2 seconds)
     * @param {string} time - time of file upload in YYYY:M[M]:D[D] H[H]:M[M]:S[S]
     */
  const timeStart = time.indexOf(' ');
  const firstColon = time.indexOf(':', timeStart);
  const secondColon = time.lastIndexOf(':');
  let hour = time.slice(timeStart + 1, firstColon);
  let min = time.slice(firstColon + 1, secondColon);
  let sec = time.slice(secondColon + 1);
  if (firstColon - timeStart === 2) {
    hour = `0${time.charAt(timeStart + 1)}`;
  }
  if (secondColon - firstColon === 2) {
    min = `0${time.charAt(firstColon + 1)}`;
  }
  if (time.length - secondColon === 2) {
    sec = `0${time.slice(-1)}`;
  }
  return `${time.slice(0, timeStart + 1)}${hour}:${min}:${sec}`;
}

class Files extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      fileId: -1,
    };

    // Extra state if admin is retrieving files for a particular customer
    if (this.props.match.path === '/manage/admin-retrieve-user-files'
            && Cookies.get('userType') === 'admin') {
      Object.assign(this.state, {
        custId: this.props.location.state.userId,
        isCustomer: this.props.location.state.isCustomer,
        username: this.props.location.state.username,
      });
    }
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.handleDeleteId = this.handleDeleteId.bind(this);
    this.handleShop = this.handleShop.bind(this);
    // this.showUserDropdown = this.showUserDropdown.bind(this);
  }

  componentDidMount() {
    // Customer retrieving their files
    let url = '';
    if (this.props.match.path === '/manage/files' && Cookies.get('userType') !== 'admin') {
      // if customer, can see their files
      // foundry workers might use this API path too (not sure)
      url = customerFileRetrieve.replace('id', Cookies.get('userId'));
      url += '?filter={"where":{"isDeleted":false}}';
    }
    // Admin retrieves files for particular customer
    else if (this.props.match.path === '/manage/admin-retrieve-user-files'
                && Cookies.get('userType') === 'admin'
                && this.props.location.state.isCustomer) {
      // get files for either foundry worker or user
      url = customerFileRetrieve.replace('id', this.props.location.state.userId);
    }

    API.Request(url, 'GET', {}, true)
      .then((res) => {
        this.setState({
          fileList: res.data,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  handleDownload(e) {
    let url = '';
    if (this.props.match.path === '/manage/files' && Cookies.get('userType') !== 'admin') {
      // customer downloads a file
      url = downloadFileById.replace('id', Cookies.get('userId'));
      url += `?access_token=${Cookies.get('access_token')}&fileId=${e.target.id}`;
      window.location = url;
    }
    // Admin retrieves files for particular customer
    else if (this.props.match.path === '/manage/admin-retrieve-user-files'
                && Cookies.get('userType') === 'admin'
                && this.props.location.state.isCustomer) {
      url = `${adminDownloadFile}?access_token=${Cookies.get('access_token')}&fileId=${e.target.id}`;
      window.location = url;
    }
  }

  handleShop(e) {
    const fileId = Number(e.target.parentNode.parentNode.id.replace(/[^0-9]/ig, ''));
    let i;
    let file;
    for (i = 0; i < this.state.fileList.length; i++) {
      if (fileId === this.state.fileList[i].id) {
        file = this.state.fileList[i].id;
        this.props.history.push('/chipfab', { fileInfo: this.state.fileList[i] });
      }
    }
  }

  handleDelete(e) {
    const fileId = this.state.deleteId;
    const url = `${customerDeleteFile.replace('id', Cookies.get('userId'))}?fileId=${fileId}`;
    const fileInfoRowId = `fileInfoRow${fileId}`;
    API.Request(url, 'DELETE', {}, true)
      .then((res) => {
        if (document.getElementById(fileInfoRowId)) {
          document.getElementById(fileInfoRowId).remove();
        } else {
          console.error('The element does not exist!');
        }
      })
      .then((res) => {
        $('#deleteModal').modal('hide');
      })
      .catch((err) => {
        console.error(err);
      });
  }

  handleDeleteId(e) {
    const fileIdString = e.target.id;
    const fileId = Number(fileIdString.replace(/[^0-9]/ig, ''));
    this.setState({
      deleteId: fileId,
    });
  }

  render() {
    return (
      <div className="right-route-content">
        <SEO
          title="eDrops | Files"
          description=""
          metadata={metadata}
        />
        <div className="profile-content">
          { this.props.match.path === '/manage/admin-retrieve-user-files'
            ? (
              <h2>
                Files for
                {' '}
                {this.state.username}
              </h2>
            )
            : <h2>Files</h2>}

        </div>
        <div className="content-show-table row">
          <div className="table-background">
            <table className="table">
              <thead>
                <tr>
                  <th>Upload Time</th>
                  <th>File Name</th>
                  {
                    Cookies.get('userType') === 'customer'
                      ? null
                      : <th>Uploader</th>
                  }
                  <th>Size</th>
                  <th>Download</th>
                  {
                    Cookies.get('userType') === 'customer'
                      ? <th>Foundry Service</th>
                      : null
                  }
                  {
                    Cookies.get('userType') === 'customer'
                      ? <th>Delete</th>
                      : null
                  }
                </tr>
              </thead>
              <tbody>
                {this.state.fileList.length !== 0
                  ? this.state.fileList.map((item, index) => (
                    <tr key={item.id} id={`fileInfoRow${item.id}`}>
                      <td>{padZeroes(item.uploadTime)}</td>
                      <td>{item.fileName}</td>
                      {
                        Cookies.get('userType') === 'customer'
                          ? null
                          : <th>{item.uploader}</th>
                      }
                      <td>{item.fileSize}</td>
                      {/*
                        Cookies.get('userType') === "customer"
                        ? null
                        : (<td>
                            <a onClick={this.showUserDropdown} style={{cursor: 'pointer'}}>{item.uploader}</a>
                            <div style={{display: "none"}} className="customer-div-drownup">
                                <ul className="customer-list-styled">
                                    <li>{userInfo.username}</li>
                                    <li>{userInfo.address}</li>
                                    <li>{userInfo.email}</li>
                                </ul>
                            </div>
                        </td>)
                      */
                      }
                      {/*
                        Cookies.get('userType') === "worker"
                        ? null
                        : (<td>
                            <a onClick={this.showUserDropdown} style={{cursor: 'pointer'}}>{item.avtoworkerName}</a>
                            <div style={{display: "none"}} className="customer-div-drownup">
                                <ul className="customer-list-styled">
                                    <li>{userInfo.username}</li>
                                    <li>{userInfo.address}</li>
                                    <li>{userInfo.email}</li>
                                </ul>
                            </div>
                          </td>)
                      */
                      }
                      <td>
                        <i className="fa fa-download" id={item.id} onClick={this.handleDownload} />
                      </td>
                      {
                        Cookies.get('userType') === 'customer'
                          ? (
                            <td>
                              <i className="fa fa-cart-plus" onClick={this.handleShop} />
                            </td>
                          )
                          : null
                      }

                      {/*
                        Cookies.get('userType') === "worker"
                        ?
                          (
                          <td className="worker-edit-status">
                          {
                              <a onClick={this.showDropdown} style={{cursor: 'pointer'}}>{item.status}</a>
                              <div style={{display: "none"}} className="file-div-drownup">
                                  <ul className="file-list-styled">
                                      <li>Unassigned to Foundry</li>
                                      <li>Assigned to Foundry</li>
                                      <li>Project Started</li>
                                      <li>Project Completed</li>
                                  </ul>
                              </div>
                          }
                              <form className="edit-status-form" method="POST" action={editFileStatus}>
                                  <select name="status" >
                                      <option value="Unassigned to Foundry">Unassigned to Foundry</option>
                                      <option value="Assigned to Foundry">Assigned to Foundry</option>
                                      <option value="Project Started">Project Started</option>
                                      <option value="Project Completed">Project Completed</option>
                                  </select>
                                  <input type="hidden" name="fileId" value={item.id}></input>
                                  <input type="submit" value="Submit Status" ></input>
                              </form>
                          </td>)
                        :
                        null
                        */
                      }
                      {
                        Cookies.get('userType') === 'customer'
                          ? (
                            <td>
                              <i className="fa fa-trash" id={`file${item.id}`} data-toggle="modal" data-target="#deleteModal" onClick={this.handleDeleteId} />
                            </td>
                          )
                          : null
                      }
                    </tr>
                  ))
                  : (
                    <tr>
                      <td>No files have been uploaded.</td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        <DeletePopup onDelete={this.handleDelete} />
      </div>
    );
  }
}

Files = withRouter(Files);
export default Files;
