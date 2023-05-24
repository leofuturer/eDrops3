import { api } from '@/api';
import FormGroup from '@/component/form/FormGroup';
import { Address, Customer, DTO } from '@/types';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';

export function CustomerProfile({ customerId }: { customerId: string }) {
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
    Promise.all([api.customer.get(customerId), api.customer.getDefaultAddress(customerId)])
      .then(([customer, address]) => {
        setInitialInfo({
          username: customer.user.username,
          email: customer.user.email,
          phoneNumber: customer.phoneNumber as string,
          firstName: customer.firstName,
          lastName: customer.lastName,
          street: address.street,
          streetLine2: address.streetLine2 as string,
          city: address.city,
          state: address.state as string,
          zipCode: address.zipCode,
          country: address.country,
        });
        setDefaultAddressId(address.id as number);
      })
  }, [])

  return (
    <Formik
      initialValues={initialInfo}
      enableReinitialize={true}
      onSubmit={(values) => {
        const customerData: Partial<DTO<Customer>> = {
          firstName: values.firstName,
          lastName: values.lastName,
          phoneNumber: values.phoneNumber,
        }
        const addressData: Partial<DTO<Address>> = {
          street: values.street,
          streetLine2: values.streetLine2,
          city: values.city,
          state: values.state,
          zipCode: values.zipCode,
          country: values.country,
        }
        Promise.all([api.customer.update(customerId, customerData), api.customer.updateDefaultAddress(customerId, defaultAddressId, addressData)]);
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