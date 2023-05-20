import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { customerAddresses, customerGetProfile, request, updateCustomerProfile } from '../../../api'
import FormGroup from '../../../component/form/FormGroup';
import { customer } from '@/api/lib/newServerConfig';
import { getCustomerInfo } from '@/api/customer';

function CustomerProfile({ userId }: { userId: string }) {
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

  const [defaultAddressId, setDefaultAddressId] = useState(-1);

  useEffect(() => {
    getCustomerInfo(userId).then((customer) => {
      const defaultAddress = customer.customerAddresses.find((address) => address.isDefault);
      setInitialInfo({
        username: customer.user.username,
        email: customer.user.email,
        phoneNumber: customer.phoneNumber,
        firstName: customer.firstName,
        lastName: customer.lastName,
        street: defaultAddress?.street || '',
        streetLine2: defaultAddress?.streetLine2 || '',
        city: defaultAddress?.city || '',
        state: defaultAddress?.state || '',
        zipCode: defaultAddress?.zipCode || '',
        country:  defaultAddress?.country || '',
      });
      setDefaultAddressId(defaultAddress?.id || -1);
    })
  }, [userId])

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
        Promise.all([request(updateCustomerProfile.replace('id', userId), 'PATCH', customerData, true),
        request(`${customerAddresses.replace('id', userId)}/${defaultAddressId}`, 'PATCH', addressData, true)
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