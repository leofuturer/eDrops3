import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';

import $ from 'jquery';
import API from '../../api/api';
import { editFoundryWorker, userBaseFind, userBaseDeleteById } from '../../api/serverConfig';

class Worker extends React.Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleRetrieveChipOrders = this.handleRetrieveChipOrders.bind(this);
  }

  handleRetrieveChipOrders() {
    const workerId = this.props.worker.id;
    this.props.history.push('/manage/admin-retrieve-worker-orders', {
      workerId: workerId,
      isCustomer: false,
    });
  }

  handleEdit() {
    const { worker } = this.props;
    this.props.history.push('/manage/foundryworkers/editworker', {
      workerId: worker.id,
      workerInfo: worker,
    });
  }

  handleDelete() {
    // we need to delete both userBase and worker instances
    const { worker } = this.props;
    let url = `${userBaseFind}?filter={"where": {"email": "${worker.email}"}}`;
    API.Request(url, 'GET', {}, true)
      .then((res) => {
        const userBaseId = res.data[0].id;
        url = userBaseDeleteById.replace('id', userBaseId);
        API.Request(url, 'DELETE', {}, true)
          .then((res) => {
            url = editFoundryWorker.replace('id', worker.id);
            const classSelector = `#worker${worker.id}`;
            API.Request(url, 'DELETE', {}, true)
              .then((res) => {
                // console.log(res);
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
    const { worker } = this.props;
    return (
      <tr id={`worker${worker.id}`}>
        <td>{`${worker.firstName} ${worker.lastName}`}</td>
        <td>{worker.username}</td>
        <td>{worker.email}</td>
        <td>{worker.phoneNumber}</td>
        <td>{worker.affiliation}</td>
        <td>
          <i className="fa fa-microchip" onClick={this.handleRetrieveChipOrders} />
        </td>
        <td><i className="fa fa-edit" onClick={this.handleEdit} /></td>
        <td><i className="fa fa-trash" onClick={this.handleDelete} /></td>
      </tr>
    );
  }
}

Worker = withRouter(Worker);
export default Worker;
