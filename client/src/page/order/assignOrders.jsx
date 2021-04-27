import React from 'react';
import { NavLink } from 'react-router-dom';
import OrderItem, { orderItem } from './orderItem.jsx';
import { getAllFoundryWorkers, assignOrders } from '../../api/serverConfig';
import API from '../../api/api';

class AssignOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      workerList: [],
      assignId: -1,
      chipOrder: undefined,
    };
    this.handleAssign = this.handleAssign.bind(this);
    this.handleAssignId = this.handleAssignId.bind(this);
  }

  componentDidMount() {
    const url = getAllFoundryWorkers;
    API.Request(url, 'GET', {}, true)
      .then((res) => {
        this.setState({
          workerList: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleAssignId(e) {
    this.setState({
      assignId: Number(e.target.id.replace(/[^0-9]/ig, '')),
    });
  }

  handleAssign(e) {
    const data = {
      workerId: this.state.assignId,
    };

    const url = assignOrders.replace('id', window._order.id);
    API.Request(url, 'PATCH', data, true)
      .then((res) => {
        window.opener.location.href = window.opener.location.href;
        window.close();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const order = window._order;
    return (
      <div className="ass-right-route-content">
        <div className="ass-profile-content">
          <h2>Assign Order</h2>
        </div>
        <div className="ass-content-show-table row">
          <OrderItem info={order} adminAssignOrderDisplay />
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
                {this.state.workerList.map((item, index) => (
                  <tr key={index} id={item.id}>
                    <td>{`${item.firstName} ${item.lastName}`}</td>
                    <td>{item.username}</td>
                    <td>{item.email}</td>
                    <td>{item.phoneNumber}</td>
                    <td>{item.affiliation}</td>
                    <td id={`file${item.id}`} data-toggle="modal" data-target="#confirm-assign" onClick={this.handleAssignId}>
                      <NavLink id={`file${item.id}`} to="#">
                        Assign to Him/Her
                      </NavLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* <Modal> */}
        <div className="modal fade" id="confirm-assign" tabIndex="-1" role="dialog" aria-labelledby="assignModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                eDrops
              </div>
              <div className="modal-body">
                Do you want to assign the order to this worker?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                <a className="btn btn-success btn-ok" onClick={this.handleAssign}>Yes</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AssignOrders;
