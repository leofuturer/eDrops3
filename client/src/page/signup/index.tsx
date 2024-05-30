import { ErrorMessage, Field, Form, Formik, FormikConfig } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ValidationError } from 'yup';
import { api, Address, Customer, User, DTO } from '@edroplets/api';
import FormGroup from '@/component/form/FormGroup';
import SEO from '@/component/header/seo';
import { CustomerSchema, CustomerSubmitSchema } from '@edroplets/schemas';
import { metadata } from './metadata';
import { ROUTES } from '@/router/routes';

export function Register() {
  const [initialInfo, setInitialInfo] = useState({
    street: '',
    streetLine2: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    country: '',
    state: '',
    city: '',
    zipCode: '',
    customerType: 'person',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    isDefault: true,
  });

  const [requestInProgress, setRequestInProgress] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  function handleRegister(customerData: DTO<Customer & User & Address>) {
    api.customer.create(customerData).then(() => {
      navigate(ROUTES.CheckEmail);
      setErrorMessage('');
    }).catch((error) => {
      console.error(error);
      setRequestInProgress(false);
      setErrorMessage('There was an error when registering your account. Please try again.');
    });
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <SEO
        title="eDroplets | Register"
        description=""
        metadata={metadata}
      />
      <div className="flex flex-col items-center outline outline-1 outline-gray-300 shadow-xl rounded-md pt-4 pb-10 w-1/2 bg-white">
        
        <h3 className="text-primary text-2xl text-center font-medium border-b-2 pb-2 border-primary">Sign Up</h3>
        <Formik
          validationSchema={CustomerSchema}
          initialValues={initialInfo}
          onSubmit={(values, actions) =>
            CustomerSubmitSchema.validate(values, { abortEarly: false })
              .then(() => {
                handleRegister({ ...values } as DTO<Customer & User & Address>)
              })
              .catch((err: ValidationError) => {
                const errors = err.inner.reduce((acc: object, curr: ValidationError) => {
                  return {
                    ...acc,
                    [curr.path as string]: curr.message,
                  };
                }, {});
                actions.setErrors(errors);
              })
          }
        >
          <Form className="flex flex-col space-y-2">
            <p className="text-xs text-gray-500">Fields with * are required</p>
            <FormGroup name="email" required type="email" autoComplete="email"/>
            <FormGroup name="username" required autoComplete="username" />
            <FormGroup name="password" required type="password" autoComplete="new-password" />
            <FormGroup name="confirmPassword" required type="password" autoComplete="new-password" />
            <FormGroup name="firstName" required autoComplete="given-name" />
            <FormGroup name="lastName" required autoComplete="family-name" />
            <div className="grid grid-cols-4 gap-4 items-center">
              <label htmlFor="customerType" className="text-sm font-bold">User Type*</label>
              <Field id="customerType" name="customerType" as="select" className="outline outline-1 shadow-inner focus:shadow-box-sm rounded px-1 py-1 col-span-2 outline-gray-400 focus:shadow-primary_light focus:outline-primary_light">
                <option value="person">Person</option>
                <option value="business">Company</option>
              </Field>
              <ErrorMessage name="customerType" component="p" className="text-red-700 text-xs w-36 text-center" />
            </div>
            <FormGroup name="phoneNumber" autoComplete="tel-national" />
            <FormGroup name="street" autoComplete="address-line1" />
            <FormGroup name="streetLine2" autoComplete="address-line2" />
            <FormGroup name="city" autoComplete="address-level2" />
            <FormGroup name="state" displayName="State or Province" autoComplete="address-level1" />
            <FormGroup name="zipCode" displayName="Zip or Postal Code" autoComplete="postal-code" />
            <FormGroup name="country" autoComplete="country" />
            <button type="submit" className="w-full h-16 bg-primary text-white text-lg rounded-md mt-8">Submit</button>
          </Form>
        </Formik>
        <div className="form-group">
          <small className="text-muted text-center text-danger w-100">
            {errorMessage}
          </small>
        </div>
      </div>
    </div>
  );
}
