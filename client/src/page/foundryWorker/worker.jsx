import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';

import API from '../../api/api';
import { editFoundryWorker, userBaseFind, userBaseDeleteById } from '../../api/serverConfig';
import $ from 'jquery';

class Worker extends React.Component {
    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleRetrieveFiles = this.handleRetrieveFiles.bind(this);
    }
    
    handleRetrieveFiles() {
        let workerId = this.props.worker.id;
        this.props.history.push('/manage/admin-retrieve-user-files', {
            userId: workerId,
            isCustomer: false
        });
    }

    handleEdit() {
        let worker = this.props.worker;
        this.props.history.push('/manage/foundryworkers/editworker', {
            workerId: worker.id,
            workerInfo: worker
        })
    }

    handleDelete() {
        // we need to delete both userBase and worker instances
        let worker = this.props.worker;
        let url = userBaseFind + `?filter={"where": {"email": "${worker.email}"}}`
        API.Request(url, 'GET', {}, true)
        .then((res) => {
            let userBaseId = res.data[0].id;
            url = userBaseDeleteById.replace('id', userBaseId);
            API.Request(url, 'DELETE', {}, true)
            .then((res) => {
                url = editFoundryWorker.replace('id', worker.id);
                let classSelector = `#worker${worker.id}`;
                API.Request(url, 'DELETE', {}, true)
                .then((res) => {
                    // console.log(res);
                    $(classSelector).remove();
                })
                .catch((err) => {
                    console.error(err);
                })
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
        let worker = this.props.worker;
        return (
            <tr id={`worker${worker.id}`}>
                <td>{worker.firstName + ' ' + worker.lastName}</td>
                <td>{worker.username}</td>
                <td>{worker.email}</td>
                <td>{worker.phoneNumber}</td>
                <td>{worker.affiliation}</td>
                <td>
                    <i className="fa fa-database" onClick={this.handleRetrieveFiles}></i>
                </td>
                <td><i className="fa fa-edit" onClick={this.handleEdit}></i></td>
                <td><i className="fa fa-trash" onClick={this.handleDelete}></i></td>
            </tr>
        );
    }
}

Worker = withRouter(Worker);
export default Worker;