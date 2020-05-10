import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import $ from 'jquery';
import notify from 'bootstrap-notify';

import API from '../../api/api';
import { adminRetrieveUserFiles, customerFileRetrieve, customerDeleteFile, downloadFileById, editFileStatus, findCustomerByWhere, findOneWorkerByWhere } from '../../api/serverConfig';
import './index.css'

class Files extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
            fileId: -1
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleDownload = this.handleDownload.bind(this);
        this.handleDeleteId = this.handleDeleteId.bind(this);
        this.hanldeShop = this.hanldeShop.bind(this);
        //this.showUserDropdown = this.showUserDropdown.bind(this);
    }

    componentDidMount() {
        if (this.props.match.path === '/manage/files') {
            var url = customerFileRetrieve.replace('id', Cookies.get('userId'));
            var data = {};
            var method = 'GET';
        } else {
            var url = adminRetrieveUserFiles;
            var data = {
                userId: this.props.location.state.userId,
                isCustomer: this.props.location.state.isCustomer
            }
            var method = 'POST';
        }

        // this line is broken
        API.Request(url, method, data, true)
        .then(res => {
            this.setState({
                fileList: res.data
            });
        })
        .catch(err => {
            console.error(err);
        });
    }

    handleDownload(e) {
        /* Method One ---- open another window and then redirect back to the current page
        let downloadId = e.target.id;
        let fileIndex = Number(downloadId.replace(/[^0-9]/ig, ''));
        let realFileName = this.state.fileList[fileIndex].filename;
        let url = downloadFileById.replace('filename', realFileName)
        window.open(url)
        */

        //Method Two(better) ---- download the file without opening another window
        let realFileName = e.target.parentNode.parentNode.childNodes[1].innerHTML;
        let url = downloadFileById.replace('filename', realFileName);
        window.location = url;

        /* The request sent by API.Request is useless
        let downloadId = e.target.id;
        let fileIndex = Number(downloadId.replace(/[^0-9]/ig, ''));
        let realFileName = this.state.fileList[fileIndex].filename;
        let url = downloadFileById.replace('filename', realFileName)
        let data = {};
        API.Request(url, 'GET', data, true)
        .then(res => {
            //console.log(res);
            window.open(url);
        })
        .catch(err => {
            console.error(err);
        });
        */
    }

    hanldeShop(e) {
        let _fileName = e.target.parentNode.parentNode.childNodes[1].innerHTML;
        this.props.history.push('/shop', {fileName: _fileName});
    }

    handleDelete(e) {
        let fileId = this.state.deleteId;
        let url = customerDeleteFile.replace('id', Cookies.get('userId')).replace('fk', fileId);
        let fileInfoRowId = `fileInfoRow${fileId}`;
        let data = {};
        API.Request(url, 'DELETE', data, true)
        .then(res => {
            if(document.getElementById(fileInfoRowId)) {
                document.getElementById(fileInfoRowId).remove();
            } else {
                console.log('The element does not exist!');
            }
            return 
        })
        .then(res => {
            $('#confirm-delete').modal('hide');
            $.notify({
                // options
                    message: 'The file has been deleted!' 
                },{
                    // settings
                    placement: {
                        from: "bottom",
                        align: "center"
                    },
                    type: 'success',
                    animate: {
                        enter: 'animated fadeInDown',
                        exit: 'animated fadeOutUp'
                    }
                });
        })
        .catch(err => {
            console.error(err);
        });
    }

    handleDeleteId(e) {
        let fileIdString = e.target.id;
        let fileId = Number(fileIdString.replace(/[^0-9]/ig, ''));
        this.setState({
            deleteId: fileId
        });
        console.log(fileId);
    }

    /*
    showDropdown(e) {
        let clickedDiv = e.target.nextSibling;
        if(clickedDiv.style.display === "none") {
            clickedDiv.style.display = "block";
        } else {
            clickedDiv.style.display = "none";
        }
    }
    */
    
    /*
    showUserDropdown(e) {
        let clickedDiv = e.target.nextSibling;
        if(clickedDiv.style.display === "none") {
            let userName = e.target.innerHTML;
            let url = (Cookies.get('userType') === "customer"
            ? `${findOneWorkerByWhere}?filter={"where": {"username": "${userName}"}}`
            : `${findCustomerByWhere}?filter={"where": {"username": "${userName}"}}`)
            let data = {};
            API.Request(url, 'GET', data, false)
            .then(res => {
                this.setState({
                    userInfo: res.data[0]
                });
                console.log(res.data[0]);
            })
            .catch(err => {
                console.log(err);
            });
            clickedDiv.style.display = "block";
        } else {
            clickedDiv.style.display = "none";
        }
    }
    */

    render() {
        return (
            <div className="right-route-content">
                <div className="profile-content">
                    <h2>Files</h2>
                </div>
                <div className="content-show-table row">
                    <div className="table-background">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Upload Time</th>
                                    <th>File Name</th>
                                    {
                                        Cookies.get('userType') === "customer"
                                        ? null
                                        : <th>Uploader</th>
                                    }
                                    <th>Size</th>
                                    <th>Download</th>
                                    {
                                        Cookies.get('userType') === "customer"
                                        ? <th>Foundry Service</th>
                                        : null
                                    }
                                    {
                                        Cookies.get('userType') === "customer"
                                        ? <th>Delete</th>
                                        : null
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.fileList.map((item, index) => {
                                        return (
                                            <tr key={index} id={`fileInfoRow${item.id}`}>
                                                <td>{item.uploadTime}</td>
                                                <td>{item.filename}</td>
                                                {
                                                    Cookies.get('userType') === "customer"
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
                                                */}
                                                <td>
                                                    <i className="fa fa-download" onClick={this.handleDownload}></i>
                                                </td>
                                                {
                                                    Cookies.get('userType') === "customer"
                                                    ?
                                                        (
                                                            <td>
                                                                <i className="fa fa-cart-plus" onClick={this.hanldeShop}></i>
                                                            </td>
                                                        )
                                                    :   null
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
                                                    */}
                                                {
                                                    Cookies.get('userType') === "customer"
                                                    ? 
                                                    <td>
                                                        <i className="fa fa-trash" id={`file${item.id}`} data-toggle="modal" data-target="#confirm-delete" onClick={this.handleDeleteId}></i>
                                                    </td>
                                                    : null
                                                }
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

                {/*Modal*/}
                <div className="modal fade" id="confirm-delete" tabIndex="-1" role="dialog" aria-labelledby="deleteModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                Edrop
                            </div>
                            <div className="modal-body">
                                Do you want to delete this file?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                                <a className="btn btn-danger btn-ok" onClick={this.handleDelete}>Delete</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Files = withRouter(Files);
export default Files;
 