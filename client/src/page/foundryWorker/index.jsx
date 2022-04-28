import React from 'react';
import { withRouter } from 'react-router-dom';
import './foundryworker.css';
import API from '../../api/api';
import { getAllFoundryWorkers, editFoundryWorker, userBaseFind, userBaseDeleteById } from '../../api/serverConfig';
import DeletePopup from '../../component/popup/deletePopup.jsx';
import $ from 'jquery';

class FoundryWorker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      workerList: [],
    };
    this.handleAddWorker = this.handleAddWorker.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleDeleteWorker = this.handleDeleteWorker.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEditWorker = this.handleEditWorker.bind(this);
    this.handleRetrieveChipOrders = this.handleRetrieveChipOrders.bind(this);
  }

  handleAddWorker() {
    this.props.history.push('/manage/foundryworkers/addfoundryworker');
  }

  handleRetrieveChipOrders(e) {
    const worker = JSON.parse(e.target.getAttribute('worker'));
    const workerId = worker.id;
    this.props.history.push('/manage/admin-retrieve-worker-orders', {
      workerId: workerId,
      isCustomer: false,
    });
  }

  handleEditWorker(e) {
    const worker = JSON.parse(e.target.getAttribute('worker'));
    this.props.history.push('/manage/foundryworkers/editworker', {
      workerId: worker.id,
      workerInfo: worker,
    });
  }

  handleDeleteWorker(e) {
    const worker = e.target.getAttribute('worker');
    this.setState({ deleteWorker: JSON.parse(worker) });
  }

  handleDelete() {
    // we need to delete both userBase and worker instances
    const worker = this.state.deleteWorker
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

  componentDidMount() {
    const _this = this;
    const url = getAllFoundryWorkers;
    const param = {};
    API.Request(url, 'GET', param, true)
      .then((res) => {
        _this.setState({
          workerList: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <div className="right-route-content">
        <div className="profile-content">
          <h2>All Foundry Workers</h2>
        </div>
        <div className="content-show-table row">
          <div>
            <button className="btn btn-primary" onClick={this.handleAddWorker}>Add New Foundry Worker</button>
          </div>
          <div className="table-background">
            <table className="table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Login Username</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Affiliation</th>
                  <th>Chip Orders</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {this.state.workerList.map((worker, index) =>
                  <tr id={`worker${worker.id}`} key={index}>
                    <td>{`${worker.firstName} ${worker.lastName}`}</td>
                    <td>{worker.username}</td>
                    <td>{worker.email}</td>
                    <td>{worker.phoneNumber}</td>
                    <td>{worker.affiliation}</td>
                    <td>
                      <i className="fa fa-microchip" worker={JSON.stringify(worker)} onClick={this.handleRetrieveChipOrders} />
                    </td>
                    <td>
                      <i className="fa fa-edit" worker={JSON.stringify(worker)} onClick={this.handleEditWorker} />
                    </td>
                    <td>
                      <i className="fa fa-trash" worker={JSON.stringify(worker)} data-toggle="modal" data-target="#deleteModal" onClick={this.handleDeleteWorker}/>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <DeletePopup onDelete={this.handleDelete} />
      </div>
    );
  }
}

FoundryWorker = withRouter(FoundryWorker);
export default FoundryWorker;
