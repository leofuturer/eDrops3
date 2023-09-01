import { Formik, Form } from 'formik';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '@/api';
import FormGroup from '@/component/form/FormGroup';
import ManageRightLayout from '@/component/layout/ManageRightLayout';
import { AddressSchema } from '@/schemas/shopify';
import { Address } from '@/types';
import { ROUTES } from '@/router/routes';

export function UpdateAddress() {
  const [initialInfo, setInitialInfo] = useState<Address>({} as Address);
  const location = useLocation();
  const navigate = useNavigate();

  const [cookies] = useCookies(['userId'])

  useEffect(() => {
    const { addressInfo } = location.state;
    setInitialInfo(addressInfo);
  }, []);

  function handleUpdateAddress(address: Address) {
    const { addressId } = location.state;
    api.customer.updateAddress(cookies.userId, addressId, address).then(() => {
      navigate(ROUTES.ManageAddress);
    }).catch((error) => {
      console.error(error);
    });
  }

  return (
    <ManageRightLayout title="Update Address">
      <Formik
        initialValues={initialInfo}
        enableReinitialize={true}
        validationSchema={AddressSchema}
        onSubmit={handleUpdateAddress}
      >
        <Form className="flex flex-col space-y-2">
          <FormGroup type="text" name="street" required autoComplete="address-line1" />
          <FormGroup type="text" name="streetLine2" autoComplete="address-line2" />
          <FormGroup type="text" name="city" required autoComplete="address-level2" />
          <FormGroup type="text" name="state" displayName="State or Province" required autoComplete="address-level1" />
          <FormGroup type="text" name="zipCode" displayName="Zip or Postal Code" required autoComplete="postal-code" />
          <FormGroup type="text" name="country" required autoComplete="country-name" />
          <button data-cy="address-update-save" type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg w-max">Update Address</button>
        </Form>
      </Formik>
    </ManageRightLayout >
  );
}
