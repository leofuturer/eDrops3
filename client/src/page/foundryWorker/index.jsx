import React from 'react';
import { withRouter } from 'react-router-dom';
import './foundryworker.css';
import API from '../../api/api';
import { getAllFoundryWorkers } from '../../api/serverConfig';
import { WorkerList } from './workerList.jsx';

class FoundryWorker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      workerList: [],
    };
    this.handleAdd = this.handleAdd.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  handleAdd() {
    this.props.history.push('/manage/foundryworkers/addfoundryworker');
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
            <button className="btn btn-primary" onClick={this.handleAdd}>Add New Foundry Worker</button>
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
                <WorkerList workerArray={this.state.workerList} />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

FoundryWorker = withRouter(FoundryWorker);
export default FoundryWorker;
