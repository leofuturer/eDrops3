import React, { useEffect, useState } from 'react';
import { redirect, useLocation } from 'react-router-dom';
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
import SEO from '../../component/header/SEO.js';
import { metadata } from './metadata.jsx';
import { useCookies } from 'react-cookie';

function Profile() {
  const [street, setStreet] = useState('');
  const [streetLine2, setStreetLine2] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [userType, setUserType] = useState('person');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [affiliation, setAffiliation] = useState('');

  const [cookies] = useCookies(['userType', 'userId']);

  const location = useLocation();

  let defaultAddressId = -1;

  useEffect(() => {
    let initUrl;
    switch (cookies.userType) {
      default:
      case 'customer':
        initUrl = customerGetProfile;
        break;
      case 'admin':
        initUrl = adminGetProfile;
        break;
      case 'worker':
        initUrl = foundryWorkerGetProfile;
        break;
    }
    const url = initUrl.replace('id', cookies.userId);
    API.Request(url, 'GET', {}, true)
      .then((res) => {
        if (userType === 'admin') {
          setPhoneNumber(res.data.phoneNumber);
          setUserType('person');
          setUsername(res.data.username);
          setEmail(res.data.email);
        } else if (userType === 'worker') {
          // console.log(res.data);
          setStreet(res.data.street);
          setStreetLine2(res.data.streetLine2);
          setFirstName(res.data.firstName);
          setLastName(res.data.lastName);
          setPhoneNumber(res.data.phoneNumber);
          setCountry(res.data.country);
          setState(res.data.state);
          setCity(res.data.city);
          setZipCode(res.data.zipCode);
          setUserType(res.data.userType);
          setUsername(res.data.username);
          setEmail(res.data.email);
          setAffiliation(res.data.affiliation);
        } else {
          const url2 = `${customerAddresses.replace('id', cookies.userId)}?filter={"where":{"isDefault":true}}`;
          API.Request(url2, 'GET', {}, true)
            .then((res2) => {
              defaultAddressId = res2.data[0].id; // for later use with saving
              setFirstName(res.data.firstName);
              setLastName(res.data.lastName);
              setPhoneNumber(res.data.phoneNumber);
              setUserType(res.data.userType);
              setUsername(res.data.username);
              setEmail(res.data.email);
              setStreet(res2.data[0].street);
              setStreetLine2(res2.data[0].streetLine2);
              setCountry(res2.data[0].country);
              setState(res2.data[0].state);
              setCity(res2.data[0].city);
              setZipCode(res2.data[0].zipCode);
            });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [cookies.userId, cookies.userType]);

  function handleSave() {
    const userType = cookies.userType;
    const userMes = {
      // we keep address info in here for the foundry workers
      // sending this data to customer will automatically discard it
      street: street,
      streetLine2: streetLine2,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      country: country,
      state: state,
      city: city,
      zipCode: zipCode,
      userType: 'person',
      // username: username,
      // email: email
    };
    if (Cookies.get('userType') === 'admin') {
      // only admin can change username or email
      Object.assign(userMes, {
        username: username,
        email: email,
      });
    }
    const addressData = {
      // in case customer accidentally leaves it blank
      street: street || 'N/A',
      streetLine2: streetLine2 || 'N/A',
      country: country || 'N/A',
      state: state || 'N/A',
      city: city || 'N/A',
      zipCode: zipCode || 'N/A',
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
          API.Request(addressUrl, 'PATCH', addressData, true)
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

  let profileContent = 'Profile';
  // These codes are of no use at this time, but maybe useful when we plan to
  // implement that using this file to complete the function that add/edit customer/worker information
  if (cookies.userType === 'admin') {
    switch (location.pathname) {
      case '/manage/users/addNewUsers':
        profileContent = 'Add new Customer';
        break;
      case '/manage/users/updateuser':
        profileContent = 'Edit Customer Profile';
        break;
      case '/manage/foundryworker/addfoundryworker':
        profileContent = 'Add new Foundry Worker';
        break;
      case '/manage/foundryworker/updateworker':
        profileContent = 'Edit Foundry Worker Profile';
        break;
      default:
        profileContent = 'Profile';
    }
  }
  return (
    <div className="flex flex-col items-center justify-center">
      <SEO
        title="eDrops | Profile"
        description=""
        metadata={metadata}
      />
      <div className="w-full border-b-2 border-primary_light flex justify-center py-8">
        <h2 className="text-2xl">{profileContent}</h2>
      </div>
      <div className="w-full py-8">
        <form>
          <div className="form-group">
            <label className="col-md-4 col-sm-4 col-xs-4 control-label">
              <span>Username</span>
            </label>
            <div className="col-md-8 col-sm-8 col-xs-8">
              <input type="text" className="form-control" readOnly value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-4 col-sm-4 col-xs-4 control-label">
              <span>Email</span>
            </label>
            <div className="col-md-8 col-sm-8 col-xs-8">
              <input type="text" className="form-control" readOnly value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-4 col-sm-4 col-xs-4 control-label">
              <span>Phone Number</span>
            </label>
            <div className="col-md-8 col-sm-8 col-xs-8">
              <input type="text" className="form-control" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
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
                      <input type="text" className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                      <span>Last Name</span>
                    </label>
                    <div className="col-md-8 col-sm-8 col-xs-8">
                      <input type="text" className="form-control" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                      <span>Street</span>
                    </label>
                    <div className="col-md-8 col-sm-8 col-xs-8">
                      <input type="text" className="form-control" value={street} onChange={(e) => setStreet(e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                      <span>Street Line 2</span>
                    </label>
                    <div className="col-md-8 col-sm-8 col-xs-8">
                      <input type="text" className="form-control" value={streetLine2} onChange={(e) => setStreetLine2(e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                      <span>City</span>
                    </label>
                    <div className="col-md-8 col-sm-8 col-xs-8">
                      <input type="text" className="form-control" value={city} onChange={(e) => setCity(e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                      <span>State or Province</span>
                    </label>
                    <div className="col-md-8 col-sm-8 col-xs-8">
                      <input type="text" className="form-control" value={state} onChange={(e) => setState(e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                      <span>Zip or Postal Code</span>
                    </label>
                    <div className="col-md-8 col-sm-8 col-xs-8">
                      <input type="text" className="form-control" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                      <span>Country</span>
                    </label>
                    <div className="col-md-8 col-sm-8 col-xs-8">
                      <input type="text" className="form-control" value={country} onChange={(e) => setCountry(e.target.value)} />
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
                    <input type="text" className="form-control" value={affiliation} onChange={(e) => setAffiliation(e.target.value)} />
                  </div>
                </div>
              )
              : null
          }

          <div className="form-group">
            <div className="col-md-10 col-sd-10 col-xs-10" />
            <div className="btn-group col-md-2 col-sd-2 col-xs-2 text-right" role="group" aria-label="...">
              <button type="button" className="btn btn-success" onClick={handleSave}>Save</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
