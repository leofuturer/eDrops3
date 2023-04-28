import { Form, Formik } from 'formik'
import React, { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { foundryWorkerGetProfile, request, updateWorkerProfile } from '../../../api';
import FormGroup from '../../../component/form/FormGroup'

function WorkerProfile() {
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
    affiliation: '',
  });

  const [cookies] = useCookies(['userId']);

  useEffect(() => {
    request(foundryWorkerGetProfile.replace('id', cookies.userId), 'GET', {}, true)
      .then((res) => {
        setInitialInfo({
          username: res.data.user.username,
          email: res.data.user.email,
          phoneNumber: res.data.phoneNumber,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          street: res.data.street,
          streetLine2: res.data.streetLine2,
          city: res.data.city,
          state: res.data.state,
          zipCode: res.data.zipCode,
          country: res.data.country,
          affiliation: res.data.affiliation,
        });
      })
  }, [])

  return (
    <Formik
      initialValues={initialInfo}
      enableReinitialize={true}
      onSubmit={(values) => {
        request(updateWorkerProfile.replace('id', cookies.userId), 'PATCH', values, true)
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
        <FormGroup name="affiliation" />
        <button type="submit" className="w-max bg-green-600 text-white rounded-md px-4 py-2">Save</button>
      </Form>
    </Formik>
  )
}

export default WorkerProfile