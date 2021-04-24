import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import {
  addFoundryWorker, editFoundryWorker, userSignUp,
  updateUserBaseProfile, userBaseFind,
} from '../../api/serverConfig';
import API from '../../api/api';

class AddOrEditWorker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      country: '',
      state: '',
      city: '',
      zipCode: '',
      userType: 'person',
      username: '',
      email: '',
      password: '',
      affiliation: '',
      password: '',
      confirmPassword: '',
    };
    this.handleSave = this.handleSave.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    if (this.props.match.path === '/manage/foundryworkers/editworker') {
      const { workerInfo } = this.props.location.state;
      this.setState({
        address: workerInfo.address,
        firstName: workerInfo.firstName,
        lastName: workerInfo.lastName,
        phoneNumber: workerInfo.phoneNumber,
        country: workerInfo.country,
        state: workerInfo.state,
        city: workerInfo.city,
        zipCode: workerInfo.zipCode,
        userType: 'person',
        username: workerInfo.username,
        email: workerInfo.email,
        affiliation: workerInfo.affiliation,
      });
    }
  }

  handleSave() {
    if (this.state.password !== this.state.confirmPassword) {
      alert('Error: Password and Confirm Password fields do not match');
      return;
    }
    const _this = this;
    const data = {
      address: this.state.address,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      phoneNumber: this.state.phoneNumber,
      country: this.state.country,
      state: this.state.state,
      city: this.state.city,
      zipCode: this.state.zipCode,
      userType: 'worker',
      username: this.state.username,
      email: this.state.email,
      affiliation: this.state.affiliation,
    };

    if (this.state.password !== '') {
      Object.assign(data, {
        password: this.state.password,
        confirmPassword: this.state.confirmPassword,
      });
    }

    if (this.props.match.path === '/manage/foundryworkers/addfoundryworker') {
      API.Request(addFoundryWorker, 'POST', data, true)
        .then((res) => {
          console.log(res);
          const obj = {
            email: this.state.email,
            username: this.state.username,
            password: this.state.password,
            userType: 'worker',
          };
          API.Request(userSignUp, 'POST', obj, false)
            .then((res) => {
              _this.props.history.push('/manage/foundryworkers');
            });
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      const { workerId } = this.props.location.state;
      let url = editFoundryWorker.replace('id', workerId);
      API.Request(url, 'PATCH', data, true)
        .then((res) => {
          url = `${userBaseFind}?filter={"where": {"email": "${data.email}"}}`;
          API.Request(url, 'GET', {}, true)
            .then((res) => {
              const userBaseId = res.data[0].id;
              url = updateUserBaseProfile.replace('id', userBaseId);
              API.Request(url, 'PATCH', data, true)
                .then((res) => {
                  _this.props.history.push('/manage/foundryworkers');
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
  }

  handleChange(key, value) {
    this.setState(
      {
        [key]: value,
      },
    );
  }

  render() {
    if (Cookies.get('userId') === undefined) {
      return <Redirect to="/login" />;
    }
    if (this.props.match.path === '/manage/foundryworkers/editworker') {
      var profileContent = 'Edit Foundry Worker Profile';
    } else {
      var profileContent = 'Add new Foundry Worker';
    }
    return (
      <div className="right-route-content">
        <div className="profile-content">
          <h2>{profileContent}</h2>
          <div className="form-div">
            <form action="">
              <div className="form-group">
                <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                  <span>First Name</span>
                </label>
                <div className="col-md-8 col-sm-8 col-xs-8">
                  <input type="text" className="form-control" value={this.state.firstName} onChange={(v) => this.handleChange('firstName', v.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                  <span>Last Name</span>
                </label>
                <div className="col-md-8 col-sm-8 col-xs-8">
                  <input type="text" className="form-control" value={this.state.lastName} onChange={(v) => this.handleChange('lastName', v.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                  <span>Phone Number</span>
                </label>
                <div className="col-md-8 col-sm-8 col-xs-8">
                  <input type="text" className="form-control" value={this.state.phoneNumber} onChange={(v) => this.handleChange('phoneNumber', v.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                  <span>Street Address</span>
                </label>
                <div className="col-md-8 col-sm-8 col-xs-8">
                  <input type="text" className="form-control" value={this.state.address} onChange={(v) => this.handleChange('address', v.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                  <span>City</span>
                </label>
                <div className="col-md-8 col-sm-8 col-xs-8">
                  <input type="text" className="form-control" value={this.state.city} onChange={(v) => this.handleChange('city', v.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                  <span>State or Province</span>
                </label>
                <div className="col-md-8 col-sm-8 col-xs-8">
                  <input type="text" className="form-control" value={this.state.state} onChange={(v) => this.handleChange('state', v.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                  <span>Zip or Postal Code</span>
                </label>
                <div className="col-md-8 col-sm-8 col-xs-8">
                  <input type="text" className="form-control" value={this.state.zipCode} onChange={(v) => this.handleChange('zipCode', v.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                  <span>Country</span>
                </label>
                <div className="col-md-8 col-sm-8 col-xs-8">
                  <input type="text" className="form-control" value={this.state.country} onChange={(v) => this.handleChange('country', v.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                  <span>Username</span>
                </label>
                <div className="col-md-8 col-sm-8 col-xs-8">
                  <input type="text" className="form-control" value={this.state.username} onChange={(v) => this.handleChange('username', v.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                  <span>Email</span>
                </label>
                <div className="col-md-8 col-sm-8 col-xs-8">
                  <input type="text" className="form-control" value={this.state.email} onChange={(v) => this.handleChange('email', v.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                  <span>Affiliation</span>
                </label>
                <div className="col-md-8 col-sm-8 col-xs-8">
                  <input type="text" className="form-control" value={this.state.affiliation} onChange={(v) => this.handleChange('affiliation', v.target.value)} />
                </div>
              </div>
              {
                                this.props.match.path === '/manage/foundryworkers/addfoundryworker'
                                  ? (
                                    <div>
                                      <div className="form-group">
                                        <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                          <span>Password</span>
                                        </label>
                                        <div className="col-md-8 col-sm-8 col-xs-8">
                                          <input type="password" className="form-control" onChange={(v) => this.handleChange('password', v.target.value)} />
                                        </div>
                                      </div>
                                      <div className="form-group">
                                        <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                          <span>Confirm Password</span>
                                        </label>
                                        <div className="col-md-8 col-sm-8 col-xs-8">
                                          <input type="password" className="form-control" onChange={(v) => this.handleChange('confirmPassword', v.target.value)} />
                                        </div>
                                      </div>
                                    </div>
                                  )
                                  : null
                            }
              <div className="form-group">
                <div className="col-md-10 col-sd-10 col-xs-10" />
                <div className="btn-group col-md-2 col-sd-2 col-xs-2 text-right" role="group" aria-label="...">
                  <button type="button" className="btn btn-success" onClick={this.handleSave}>Save</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
AddOrEditWorker = withRouter(AddOrEditWorker);
export default AddOrEditWorker;
