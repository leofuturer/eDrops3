import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { customerAddresses, customerGetProfile, request, updateCustomerProfile } from '../../../api'
import FormGroup from '../../../component/form/FormGroup';

function CustomerProfile() {
  const [initialInfo, setInitialInfo] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    firstName: '',
    lastName: '',
    street: '',
    streetLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const [cookies] = useCookies(['userId']);
  const [defaultAddressId, setDefaultAddressId] = useState(-1);

  useEffect(() => {
    Promise.all([request(customerGetProfile.replace('id', cookies.userId), 'GET', {}, true),
    request(`${customerAddresses.replace('id', cookies.userId)}?filter={"where":{"isDefault":true}}`, 'GET', {}, true)
    ])
      .then(([res1, res2]) => {
        setInitialInfo({
          username: res1.data.user.username,
          email: res1.data.user.email,
          phoneNumber: res1.data.phoneNumber,
          firstName: res1.data.firstName,
          lastName: res1.data.lastName,
          street: res2.data[0].street,
          streetLine2: res2.data[0].streetLine2,
          city: res2.data[0].city,
          state: res2.data[0].state,
          zipCode: res2.data[0].zipCode,
          country: res2.data[0].country,
        });
        setDefaultAddressId(res2.data[0].id);
      })
  }, [])

  return (
    <Formik
      initialValues={initialInfo}
      enableReinitialize={true}
      onSubmit={(values) => {
        const customerData = {
          firstName: values.firstName,
          lastName: values.lastName,
          phoneNumber: values.phoneNumber,
        }
        const addressData = {
          street: values.street,
          streetLine2: values.streetLine2,
          city: values.city,
          state: values.state,
          zipCode: values.zipCode,
          country: values.country,
        }
        Promise.all([request(updateCustomerProfile.replace('id', cookies.userId), 'PATCH', customerData, true),
        request(`${customerAddresses.replace('id', cookies.userId)}/${defaultAddressId}`, 'PATCH', addressData, true)
        ])
      }}>
      <Form className="flex flex-col space-y-2">
        <FormGroup name="username" disabled />
        <FormGroup name="email" disabled />
        <FormGroup name="phoneNumber" />
        <FormGroup name="firstName" />
        <FormGroup name="lastName" />
        <FormGroup name="street" />
        <FormGroup name="streetLine2" />
        <FormGroup name="city" />
        <FormGroup name="state" />
        <FormGroup name="zipCode" />
        <FormGroup name="country" />
        <button type="submit" className="w-max bg-green-600 text-white rounded-md px-4 py-2">Save</button>
      </Form>
    </Formik>
  )
}

export default CustomerProfile