import React from 'react';
import { NavLink } from 'react-router-dom';

import { getAllFileInfos, downloadFileById } from '../../api/serverConfig';
import API from '../../api/api';
import $ from 'jquery';
import parse from 'url-parse';

class AllFiles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: []
        };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleDownload = this.handleDownload.bind(this);
        this.handleAssign = this.handleAssign.bind(this);
    }

    handleDownload(e) {
        let rowToDownload = e.target.parentNode.parentNode;
        let fileIndex = rowToDownload.id;
        let realFilename = this.state.fileList[fileIndex].filename;
        let url = downloadFileById.replace('filename', realFilename)
        window.location = url;
    }

    handleAssign(e) {
        /*
        //Using window.location + query parameters to send data
        let originalFileId = e.target.id;
        let fileId = Number(originalFileId.replace(/[^0-9]/ig, ''));
        let redirectUrl = `/manage/assign?fileId=${fileId}`;
        window.location = redirectUrl;
        */

        /*
        //Using the window.open() method to open a new window and display the page based on the passed in redirectUrl
        let originalFileId = e.target.id;
        let fileId = Number(originalFileId.replace(/[^0-9]/ig, ''));
        let redirectUrl = "/manage/assign";
        let newWindow = window.open(redirectUrl, "_blank", "width=300px, height=300px, top=300px, left=300px", false);
        newWindow._theFileId = fileId;
        */

        //The fourth way to send data as well as to redirect to the '/manage/assign' page
        
        let originalFileId = e.target.id;
        let fileId = Number(originalFileId.replace(/[^0-9]/ig, ''));
        let redirectUrl = "/manage/assign";
        this.props.history.push(redirectUrl, {
            fileId: fileId
        });
        
    }

    componentDidMount() {
        let url = getAllFileInfos;
        let data = {};
        API.Request(url, 'GET', data, true)
        .then((res) => {
            this.setState({
                fileList: res.data
            });
        })
        .catch(err => {
            console.log(err);
        });
    }

    render() {
        return (
            <div className="right-route-content">
                <div className="profile-content">
                    <h2>All Uploaded Files</h2>             
                </div>
                <div className="content-show-table row">
                    <div className="table-background">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Upload Time</th>
                                    <th>File Name</th>
                                    <th>Uploader</th>
                                    <th>File Size</th>
                                    <th>Download</th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.fileList.length !== 0
                                ?
                                this.state.fileList.map((item, index) => {
                                    return (<tr key={index} id={index}>
                                                <td>{item.uploadTime}</td>
                                                <td>{item.filename}</td>
                                                <td>{item.uploader}</td>
                                                <td>{item.fileSize}</td>
                                                <td>         
                                                    <i className="fa fa-download" 
                                                        onClick={this.handleDownload}></i>
                                                </td>
                                            </tr>)
                                })
                                : <tr>
                                    <td>No files have been uploaded.</td>
                                </tr>
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default AllFiles;