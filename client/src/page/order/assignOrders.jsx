import React from 'react';
import { NavLink } from 'react-router-dom';

import { getAllFoundryWorkers, assignOrders } from '../../api/serverConfig';
import API from '../../api/api';

class AssignOrders extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            workerList: [],
            assignId: -1
        };
        this.handleAssign = this.handleAssign.bind(this);
        this.handleAssignId = this.handleAssignId.bind(this);
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

    handleAssignId(e) {
        let _workerId = e.target.parentNode.parentNode.id;
        this.setState({
            assignId: Number(_workerId)
        })
    }

    handleAssign(e) {
        let _workerId = this.state.assignId;
        let _orderId = window._theOrderId;

        let data = {
            orderId: _orderId,
            workerId: _workerId,
        }

        let url = assignOrders;
        API.Request(url, 'POST', data, false)
        .then(res => {
            window.opener.location.href = window.opener.location.href;
            window.close();
        })
        .catch(err => {
            console.log(err);
        });
    }

    render() {
        return (
            <div className="ass-right-route-content">
                <div className="ass-profile-content">
                    <h2>Assign Order</h2>
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
                                            <td id={`file${item.id}`} data-toggle="modal" data-target="#confirm-assign" onClick={this.handleAssignId}>
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
                
                {/*<Model>*/}
                <div className="modal fade" id="confirm-assign" tabIndex="-1" role="dialog" aria-labelledby="assignModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                Edrop
                            </div>
                            <div className="modal-body">
                                Do you want to assign the order to him/her?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                                <a className="btn btn-success btn-ok" onClick={this.handleAssign}>Yes</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default AssignOrders;