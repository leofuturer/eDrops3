import React from 'react';
import { NavLink } from 'react-router-dom';

import { getAllFoundryWorkers, assignFile } from '../../api/serverConfig';
import API from '../../api/api';
import './assign.css';

class AssignFile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            workerList: []
        };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleAssign = this.handleAssign.bind(this);
    }

    componentDidMount() {
        let url = getAllFoundryWorkers;
        let data = {};
        API.Request(url, 'GET', data, true)
        .then(res => {
            this.setState({
                workerList: res.data
            });
            console.log(res.data);
        })
        .catch(err => {
            console.log(err);
        })
    }

    handleAssign(e) {
        let url = assignFile;
        let _workerId = e.target.parentNode.parentNode.id;
        _workerId = Number(_workerId);

        /*
        //First way to receive data from '/manage/allfiles' page
        let parsedUrl = new URL(window.location);
        let _fileId = parsedUrl.searchParams.get("fileId");
        */

        //Second Way
        /*
        let parsedUrl = new URL(window.location);
        let _fileId = parsedUrl.searchParams.get("fileId");
        */

        /*
        //Second way to receive data from '/manage/allfiles' page
        let _fileId = window._theFileId;
        */

        //Third way to receive data
        let _fileId = this.props.location.state.fileId;

        let data = {
            fileId: _fileId,
            workerId: _workerId,
        }

        API.Request(url, 'POST', data, false)
        .then(res => {
            console.log(res);
            alert("The file has been assigned!");
            this.props.history.push('/manage/allfiles');
        })
        .catch(err => {
            console.log(err);
        });
    }

    render() {
        return (
            <div className="ass-right-route-content">
                <div className="ass-profile-content">
                    <h2>Assign File</h2>
                </div>
                <div className="ass-content-show-table row">
                    <div className="table-background">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Full Name</th>
                                    <th>Username</th>
                                    <th>E-mail</th>
                                    <th>Phone</th>
                                    <th>Affiliation</th>
                                    <th>Assign</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.workerList.map((item, index) => {
                                    return (
                                        <tr key={index} id={item.id}>
                                            <td>{item.firstName + item.lastName}</td>
                                            <td>{item.username}</td>
                                            <td>{item.email}</td>
                                            <td>{item.phoneNumber}</td>
                                            <td>{item.affiliation}</td>
                                            <td onClick={this.handleAssign}>
                                                <NavLink to="#">
                                                    Assign to Him/Her   
                                                </NavLink>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default AssignFile;