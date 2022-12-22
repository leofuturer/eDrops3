import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useLocation } from 'react-router-dom';
import API from '../../api/api';
import {
  adminGetProfile, customerAddresses, customerGetProfile, foundryWorkerGetProfile, updateAdminProfile, updateCustomerProfile,
  updateWorkerProfile
} from '../../api/serverConfig';
import FormGroup from '../../component/form/FormGroup';
import SEO from '../../component/header/SEO';
import ManageRightLayout from '../../component/layout/ManageRightLayout';
import { metadata } from './metadata';

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
    if (cookies.userType === 'admin') {
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
    const url = InitUrl.replace('id', cookies.userId);

    API.Request(url, 'PATCH', userMes, true)
      .then((res) => {
        // console.log(res);
        // _this.props.history.push('/manage/profile')
        if (userType === 'customer') {
          // need to update address separately
          let addressUrl = customerAddresses.replace('id', cookies.userId);
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
    <ManageRightLayout title={profileContent}>
      <SEO
        title="eDrops | Profile"
        description=""
        metadata={metadata}
      />
      <Formik initialValues={{}} onSubmit={handleSave}>
        <Form className="flex flex-col space-y-2">
          <FormGroup name="username" />
          <FormGroup name="email" />
          <FormGroup name="phoneNumber" />
          {cookies.userType !== 'admin' &&
            <>
              <FormGroup name="firstName" />
              <FormGroup name="lastName" />
              <FormGroup name="street" />
              <FormGroup name="streetLine2" />
              <FormGroup name="city" />
              <FormGroup name="state" />
              <FormGroup name="zipCode" />
              <FormGroup name="country" />
            </>
          }
          {cookies.userType === 'worker' &&
            <FormGroup name="affiliation" />
          }
          <button type="submit" className="w-max bg-green-600 text-white rounded-md px-4 py-2">Save</button>
        </Form>
      </Formik>
    </ManageRightLayout>
  );
}

export default Profile;
