import { Form, Formik } from 'formik';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../../api/api';
import { addCustomer, updateCustomerProfile, updateUserBaseProfile, userBaseFind, userSignUp } from '../../api/serverConfig';
import ManageRightLayout from '../../component/layout/ManageRightLayout';

function AddOrEditUser() {
  let customerInfo = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    userType: 'person',
    username: '',
    email: '',
  }
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/manage/users/edituser') {
      const { customer } = location.state;
      customerInfo = {
        firstName: customer.firstName,
        lastName: customer.lastName,
        phoneNumber: customer.phoneNumber,
        userType: customer.userType,
        username: customer.username,
        email: customer.email,
      };
    }
  }, []);

  function handleSave() {
    const userMes = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      phoneNumber: this.state.phoneNumber,
      username: this.state.username,
      email: this.state.email,
    };
    if (location.pathname === '/manage/users/edituser') {
      // edit both customer and userBase instances
      const { customerId } = location.state;
      let url = updateCustomerProfile.replace('id', customerId);
      API.Request(url, 'PATCH', userMes, true)
        .then((res) => API.Request(`${userBaseFind}?filter={"where": {"email": "${userMes.email}"}}`, 'GET', {}, true))
        .then((res) => API.Request(updateUserBaseProfile.replace('id', res.data[0].id), 'PATCH', userMes, true))
        .then((res) => navigate('/manage/users'))
        .catch((err) => {
          console.error(err);
        });
    } else { // add new customer (and new userBase)
      Object.assign(userMes, {
        userType: 'person',
        password: this.state.password,
        confirmPassword: this.state.confirmPassword,
      });
      if (userMes.password !== userMes.confirmPassword) {
        alert('Error: Password and Confirm Password fields do not match');
        return;
      }
      API.Request(addCustomer, 'POST', userMes, true).then((res) => {
        const obj = {
          username: this.state.username,
          email: this.state.email,
          userType: 'customer',
          password: this.state.password,
        };
        API.Request(userSignUp, 'POST', obj, false).then((res) => {
          navigate('/manage/users');
        });
      }).catch((error) => {
        console.error(error);
      });
    }
  }


  let profileContent = '';
  if (location.pathname === '/manage/users/edituser') {
    profileContent = 'Edit Customer';
  } else {
    profileContent = 'Add New User';
  }
  return (
    <ManageRightLayout title={profileContent}>
      <Formik initialValues={customerInfo} onSubmit={(values) => { }}>
        <Form>
          <div className="text-left reminder">
            <small className="text-muted">Fields with * are required</small>
          </div>
          <div className="form-group row">
            <label htmlFor="inputEmail" className="col-md-2 col-sm-2 col-xs-2 control-label">
              <span>Email*</span>
            </label>
            <div className="col-md-6 col-sm-6 col-xs-6 text-left">
              <input
                id="inputEmail"
                type="email"
                name="email"
                autoComplete="email"
                className="form-control needValidation"
                placeholder="Email"
              />
            </div>
            <div className="col-md-4 col-sm-4 col-xs-4 messages">
              <small className="text-muted">Valid Email Required</small>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-md-2 col-sm-2 col-xs-2 control-label">
              <span>Username*</span>
            </label>
            <div className="col-md-6 col-sm-6 col-xs-6">
              <input
                type="text"
                id="inputUsername"
                name="username"
                autoComplete="username"
                className="form-control needValidation"
                placeholder="Username"
              />
            </div>
            <div className="col-md-4 col-sm-4 col-xs-4 messages">
              <small className="text-muted">Username must be at least 4 characters and only contain a-zA-Z0-9_</small>
            </div>
          </div>
          {
            location.pathname === '/manage/users/addNewUser'
            && (
              <div>
                <div className="form-group row">
                  <label className="col-md-2 col-sm-2 col-xs-2 control-label">
                    <span>Password*</span>
                  </label>
                  <div className="col-md-6 col-sm-6 col-xs-6 text-left">
                    <input
                      type="password"
                      name="password"
                      className="form-control needValidation"
                      placeholder="Password"
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="col-md-4 col-sm-4 col-xs-4 messages">
                    <small className="text-muted">
                      Password must contain at least a number, capital
                      letter and lowercase letter, and at least 8 characters
                    </small>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-md-2 col-sm-2 col-xs-2 control-label">
                    <span>Confirm Password*</span>
                  </label>
                  <div className="col-md-6 col-sm-6 col-xs-6 text-left">
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control needValidation"
                      placeholder="Confirm Password"
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="col-md-4 col-sm-4 col-xs-4 messages">
                    <small className="text-muted">Please retype your password</small>
                  </div>
                </div>
              </div>
            )
          }
          <div className="form-group row">
            <label className="col-md-2 col-sm-2 col-xs-2 control-label">
              <span>First Name*</span>
            </label>
            <div className="col-md-6 col-sm-6 col-xs-6">
              <input
                type="text"
                className="form-control needValidation"
                name="firstName"
                placeholder="First Name"
                autoComplete="given-name"
              />
            </div>
            {/* does name="firstName" need to be added here? */}
            <div className="col-md-4 col-sm-4 col-xs-4 messages">
              <small className="text-muted" />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-md-2 col-sm-2 col-xs-2 control-label">
              <span>Last Name*</span>
            </label>
            <div className="col-md-6 col-sm-6 col-xs-6">
              <input
                type="text"
                className="form-control needValidation"
                name="lastName"
                placeholder="Last Name"
                autoComplete="family-name"
              />
            </div>
            {/* does name="lastname" need to be added here? */}
            <div className="col-md-4 col-sm-4 col-xs-4 messages">
              <small className="text-muted" />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-md-2 col-sm-2 col-xs-2 control-label">
              <span>Phone Number</span>
            </label>
            <div className="col-md-6 col-sm-6 col-xs-6 text-left">
              <input
                type="text"
                name="phoneNumber"
                className="form-control needValidation"
                placeholder="Phone Number"
                autoComplete="tel"
              />
            </div>
            <div className="col-md-4 col-sm-4 col-xs-4 messages">
              <small className="text-muted">Include area code, and if outside the US, country code</small>
            </div>
            {/* <div className="col-md-4 col-sm-4 col-xs-4 messages-unset"></div> */}
          </div>

          <div className="form-group">
            <div className="col-md-10 col-sd-10 col-xs-10" />
            <div className="btn-group col-md-2 col-sd-2 col-xs-2 text-right" role="group" aria-label="...">
              <button type="button" className="btn btn-success" onClick={handleSave}>Save</button>
            </div>
          </div>
        </Form>
      </Formik>
    </ManageRightLayout>
  );
}

export default AddOrEditUser;
