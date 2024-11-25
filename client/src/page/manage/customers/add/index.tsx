import { api, Address, Customer, DTO, User } from '@edroplets/api';
import FormGroup from '@/component/form/FormGroup';
import ManageRightLayout from '@/component/layout/ManageRightLayout';
import { formatPhoneNumber } from '@/lib/phone';
import { ROUTES } from '@/router/routes';
import { UserSchema, UserSubmitSchema } from '@edroplets/schemas';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ValidationError } from 'yup';

export function AddCustomer() {
  const [initialInfo, setInitialInfo] = useState<DTO<Customer & User & Address> & {
    confirmPassword: string;
  }>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    customerType: 'person',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    street: '',
    streetLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    isDefault: true,
  });

  const navigate = useNavigate();

  function handleAdd(customer: DTO<Customer & User & Address>) {
    api.customer.create(customer).then((res) => {
      navigate(ROUTES.ManageCustomers);
    }).catch((error) => {
      console.error(error);
    });
  }

  return (
    <ManageRightLayout title='Add New User'>
      <Formik
        initialValues={initialInfo}
        enableReinitialize={true}
        validationSchema={UserSchema}
        onSubmit={(values, actions) => UserSubmitSchema.validate(values, { abortEarly: false }).then(() => {
          handleAdd({ ...values, phoneNumber: formatPhoneNumber(values.phoneNumber as string) });
        }).catch((err: ValidationError) => {
          const errors = err.inner.reduce((acc: object, curr: ValidationError) => {
            return {
              ...acc,
              [curr.path as string]: curr.message,
            };
          }, {});
          actions.setErrors(errors);
        })}>
        <Form className="flex flex-col space-y-2">
          <small className="">Fields with * are required</small>
          <FormGroup name="email" type="email" required autoComplete="email" />
          <FormGroup name="username" type="text" required autoComplete="username" />
          <FormGroup name="password" type="password" required autoComplete="new-password" />
          <FormGroup name="confirmPassword" type="password" required autoComplete="new-password" />
          <FormGroup name="firstName" type="text" required autoComplete="given-name" />
          <FormGroup name="lastName" type="text" required autoComplete="family-name" />
          <FormGroup name="phoneNumber" type="text" required autoComplete="tel-national" />
          <FormGroup name="street" autoComplete="address-line1" />
          <FormGroup name="streetLine2" autoComplete="address-line2" />
          <FormGroup name="city" autoComplete="address-level2" />
          <FormGroup name="state" displayName="State or Province" autoComplete="address-level1" />
          <FormGroup name="zipCode" displayName="Zip or Postal Code" autoComplete="postal-code" />
          <FormGroup name="country" autoComplete="country" />
          <div className="flex items-center space-x-4">
            <NavLink to={ROUTES.ManageCustomers} className="bg-primary-light text-white px-4 py-2 w-max rounded-lg">Cancel</NavLink>
            <button type="submit" className="bg-green-500 text-white px-4 py-2 w-max rounded-lg">Add</button>
          </div>
        </Form>
      </Formik>
    </ManageRightLayout >
  );
}

export default AddCustomer
