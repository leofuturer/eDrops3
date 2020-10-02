import React from 'react';
import { NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getAllFileInfos, adminDownloadFile } from '../../api/serverConfig';
import API from '../../api/api';

class AllFiles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: []
        };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleDownload = this.handleDownload.bind(this);
    }

    handleDownload(e) {
        let file = this.state.fileList[e.target.parentNode.parentNode.id];
        let fileId = file.id
        let url = adminDownloadFile;
        url += `?access_token=${Cookies.get('access_token')}&fileId=${fileId}`;
        console.log(url);
        window.location = url;
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
                                    <th>Deleted</th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.fileList.length !== 0
                                ?
                                this.state.fileList.map((item, index) => {
                                    return (<tr key={index} id={index}>
                                                <td>{item.uploadTime}</td>
                                                <td>{item.fileName}</td>
                                                <td>{item.uploader}</td>
                                                <td>{item.fileSize}</td>
                                                <td>         
                                                    <i className="fa fa-download" 
                                                        onClick={this.handleDownload}></i>
                                                </td>
                                                <td>{ item.isDeleted ? "Yes" : "No"}</td>
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