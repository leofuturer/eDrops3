import { api } from '@edroplets/api';
import FormGroup from '@/component/form/FormGroup';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';

export function WorkerProfile({ workerId }: { workerId: string }) {
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

  useEffect(() => {
    api.worker.get(workerId).then((worker) => {
      setInitialInfo({
        username: worker.user.username,
        email: worker.user.email,
        phoneNumber: worker.phoneNumber,
        firstName: worker.firstName,
        lastName: worker.lastName,
        street: worker.street as string,
        streetLine2: worker.streetLine2 as string,
        city: worker.city as string,
        state: worker.state as string,
        zipCode: worker.zipCode as string,
        country: worker.country as string,
        affiliation: worker.affiliation,
      });
    })
  }, [])

  return (
    <Formik
      initialValues={initialInfo}
      enableReinitialize={true}
      onSubmit={(values) => {
        api.worker.update(workerId, values);
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