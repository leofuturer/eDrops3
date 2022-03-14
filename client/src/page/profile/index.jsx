import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import './profile.css';
import Cookies from 'js-cookie';
import {
  customerGetProfile,
  customerAddresses,
  adminGetProfile,
  foundryWorkerGetProfile,
  updateCustomerProfile,
  updateWorkerProfile,
  updateAdminProfile,
} from '../../api/serverConfig';
import API from '../../api/api';
import SEO from '../../component/header/seo.jsx';
import { metadata } from './metadata.jsx';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      street: '',
      streetLine2: '',
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
      affiliation: '',
    };
    this.handleSave = this.handleSave.bind(this);
    this.defaultAddressId = -1;
  }

  componentDidMount() {
    const _this = this;
    const userType = Cookies.get('userType');
    let InitUrl;
    if (userType === 'customer') {
      InitUrl = customerGetProfile;
    } else if (userType === 'admin') {
      InitUrl = adminGetProfile;
    } else {
      InitUrl = foundryWorkerGetProfile;
    }
    const url = InitUrl.replace('id', Cookies.get('userId'));
    const data = {};
    API.Request(url, 'GET', {}, true)
      .then((res) => {
        if (userType === 'admin') {
          this.setState(
            {
              phoneNumber: res.data.phoneNumber,
              userType: 'person',
              username: res.data.username,
              email: res.data.email,
            },
          );
        } else if (userType === 'worker') {
          // console.log(res.data);
          this.setState({
            street: res.data.street,
            streetLine2: res.data.streetLine2,
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            phoneNumber: res.data.phoneNumber,
            country: res.data.country,
            state: res.data.state,
            city: res.data.city,
            zipCode: res.data.zipCode,
            userType: res.data.userType,
            username: res.data.username,
            email: res.data.email,
            affiliation: res.data.affiliation,
          });
        } else {
          // More modern syntax, but not supported by Edge so we won't use it for now
          // data = {...data, ...newData}

          Object.assign(data, {
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            phoneNumber: res.data.phoneNumber,
            userType: res.data.userType,
            username: res.data.username,
            email: res.data.email,
          });
          let url2 = customerAddresses.replace('id', Cookies.get('userId'));
          url2 = `${url2}?filter={"where":{"isDefault":true}}`;
          API.Request(url2, 'GET', {}, true)
            .then((res) => {
              // console.log(res.data);
              Object.assign(data, {
                street: res.data[0].street,
                streetLine2: res.data[0].streetLine2,
                country: res.data[0].country,
                state: res.data[0].state,
                city: res.data[0].city,
                zipCode: res.data[0].zipCode,
              });
              this.defaultAddressId = res.data[0].id; // for later use with saving
              // console.log(data);
              this.setState({
                street: data.street,
                streetLine2: data.streetLine2,
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber: data.phoneNumber,
                country: data.country,
                state: data.state,
                city: data.city,
                zipCode: data.zipCode,
                userType: data.userType,
                username: data.username,
                email: data.email,
              });
            });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  handleSave() {
    const _this = this;
    const userType = Cookies.get('userType');
    const userMes = {
      // we keep address info in here for the foundry workers
      // sending this data to customer will automatically discard it
      street: this.state.street,
      streetLine2: this.state.streetLine2,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      phoneNumber: this.state.phoneNumber,
      country: this.state.country,
      state: this.state.state,
      city: this.state.city,
      zipCode: this.state.zipCode,
      userType: 'person',
      // username: this.state.username,
      // email: this.state.email
    };
    if (Cookies.get('userType') === 'admin') {
      // only admin can change username or email
      Object.assign(userMes, {
        username: this.state.username,
        email: this.state.email,
      });
    }
    const addressData = {
      // in case customer accidentally leaves it blank
      street: this.state.street || 'N/A',
      streetLine2: this.state.streetLine2 || 'N/A',
      country: this.state.country || 'N/A',
      state: this.state.state || 'N/A',
      city: this.state.city || 'N/A',
      zipCode: this.state.zipCode || 'N/A',
    };
    if (userType === 'customer') {
      var InitUrl = updateCustomerProfile;
    } else if (userType === 'admin') {
      var InitUrl = updateAdminProfile;
    } else {
      var InitUrl = updateWorkerProfile;
    }
    const url = InitUrl.replace('id', Cookies.get('userId'));

    API.Request(url, 'PATCH', userMes, true)
      .then((res) => {
        // console.log(res);
        // _this.props.history.push('/manage/profile')
        if (userType === 'customer') {
          // need to update address separately
          let addressUrl = customerAddresses.replace('id', Cookies.get('userId'));
          addressUrl += `/${this.defaultAddressId}`;
          API.Request(addressUrl, 'PUT', addressData, true)
            .then((res) => {
              // console.log("Updated address");
              alert('Profile saved successfully!');
              document.location.reload(true);
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          alert('Profile saved successfully!');
          document.location.reload(true);
        }
      })
      .catch((error) => {
        console.error(error);
      });
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
    let profileContent;
    // These codes are of no use at this time, but maybe useful when we plan to
    // implement that using this file to complete the function that add/edit customer/worker information
    if (Cookies.get('userType') === 'admin') {
      if (this.props.match.path === '/manage/foundryworker/addfoundryworker') {
        profileContent = 'Add new Foundry Worker';
      } else if (this.props.match.path === '/manage/foundryworker/updateworker') {
        profileContent = 'Edit Foundry Worker Profile';
      } else if (this.props.match.path === '/manage/users/updateuser') {
        profileContent = 'Edit Customer Profile';
      } else if (this.props.match.path === '/manage/users/addNewUsers') {
        profileContent = 'Add new Customer';
      } else {
        profileContent = 'Profile';
      }
    } else {
      profileContent = 'Profile';
    }
    return (
      <div className="right-route-content">
        <SEO title="eDrops | Profile"
              description="" 
              metadata={ metadata }/>
        <div className="profile-content">
          <h2>{profileContent}</h2>
          <div className="form-div">
            <form action="">
              {/* <div> */}
              <div className="form-group">
                <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                  <span>Username</span>
                </label>
                <div className="col-md-8 col-sm-8 col-xs-8">
                  <input type="text" className="form-control" readOnly value={this.state.username} onChange={(v) => this.handleChange('username', v.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                  <span>Email</span>
                </label>
                <div className="col-md-8 col-sm-8 col-xs-8">
                  <input type="text" className="form-control" readOnly value={this.state.email} onChange={(v) => this.handleChange('email', v.target.value)} />
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
              {/* </div> */}
              {
                                Cookies.get('userType') === 'admin'
                                  ? null
                                  : (
                                    <div>
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
                                          <span>Street</span>
                                        </label>
                                        <div className="col-md-8 col-sm-8 col-xs-8">
                                          <input type="text" className="form-control" value={this.state.street} onChange={(v) => this.handleChange('street', v.target.value)} />
                                        </div>
                                      </div>
                                      <div className="form-group">
                                        <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                          <span>Street Line 2</span>
                                        </label>
                                        <div className="col-md-8 col-sm-8 col-xs-8">
                                          <input type="text" className="form-control" value={this.state.streetLine2} onChange={(v) => this.handleChange('streetLine2', v.target.value)} />
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

                                    </div>
                                  )
                            }
              {
                                Cookies.get('userType') === 'worker'
                                  ? (
                                    <div className="form-group">
                                      <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                        <span>Affiliation</span>
                                      </label>
                                      <div className="col-md-8 col-sm-8 col-xs-8">
                                        <input type="text" className="form-control" value={this.state.affiliation} onChange={(v) => this.handleChange('affiliation', v.target.value)} />
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
Profile = withRouter(Profile);
export default Profile;
