import { api, DTO, FoundryWorker, User } from '@edroplets/api';
import FormGroup from '@/component/form/FormGroup';
import ManageRightLayout from '@/component/layout/ManageRightLayout';
import { formatPhoneNumber } from '@/lib/phone';
import { ROUTES } from '@/router/routes';
import { WorkerSchema } from '@edroplets/schemas';
import { AddressSchema } from '@edroplets/schemas';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export function AddWorker() {
  const [initialInfo, setInitialInfo] = useState<DTO<FoundryWorker & User> & {
    confirmPassword: string;
  }>({
    street: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    country: '',
    state: '',
    city: '',
    zipCode: '',
    username: '',
    email: '',
    affiliation: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  function handleAdd(worker: DTO<FoundryWorker & User>) {
    api.worker.create(worker).then((res) => {
      navigate(ROUTES.ManageWorkers);
    }).catch((error) => {
      console.error(error);
    });
  }

  return (
    <ManageRightLayout title='Edit Foundry Worker'>
      <Formik
        initialValues={initialInfo}
        enableReinitialize={true}
        validationSchema={WorkerSchema.concat(AddressSchema)}
        onSubmit={(values) => {
          handleAdd({ ...values, phoneNumber: formatPhoneNumber(values.phoneNumber as string) as string })
        }}
      >
        <Form className="flex flex-col space-y-2">
          <small className="">Fields with * are required</small>
          <FormGroup name="email" type="email" required autoComplete="email" />
          <FormGroup name="username" type="text" required autoComplete="username" />
          <FormGroup name="password" type="password" required autoComplete="new-password" />
          <FormGroup name="confirmPassword" type="password" required autoComplete="new-password" />
          <FormGroup name="firstName" type="text" required autoComplete="given-name" />
          <FormGroup name="lastName" type="text" required autoComplete="family-name" />
          <FormGroup name="phoneNumber" type="text" required autoComplete="tel-national" />
          <FormGroup name="affiliation" type="text" required autoComplete="organization" />
          <FormGroup name="street" type="text" required autoComplete="address-line1" />
          <FormGroup name="city" type="text" required autoComplete="address-level2" />
          <FormGroup name="state" displayName="State or Province" type="text" required autoComplete="address-level1" />
          <FormGroup name="zipCode" displayName="Zip or Postal Code" type="text" required autoComplete="postal-code" />
          <FormGroup name="country" type="text" required autoComplete="country-name" />
          <div className="flex items-center space-x-4">
            <NavLink to={ROUTES.ManageWorkers} className="bg-primary-light text-white px-4 py-2 w-max rounded-lg">Cancel</NavLink>
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg w-max">Add</button>
          </div>
        </Form>
      </Formik>
    </ManageRightLayout >
  );
}

export default AddWorker