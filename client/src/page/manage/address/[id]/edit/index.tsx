import FormGroup from '@/component/form/FormGroup';
import ManageRightLayout from '@/component/layout/ManageRightLayout';
import { ROUTES } from '@/router/routes';
import { Address, api, DTO } from '@edroplets/api';
import { AddressSchema } from '@edroplets/schemas';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';

export function UpdateAddress() {
  const [initialInfo, setInitialInfo] = useState<DTO<Address>>({} as DTO<Address>);
  const navigate = useNavigate();
  const { id } = useParams();

  const [cookies] = useCookies(['userId'])

  useEffect(() => {
    const addressId = parseInt(id as string, 10);
    if (Number.isNaN(addressId)) navigate(ROUTES.ManageAddress);
    api.customer.getAddress(cookies.userId, addressId).then((addressInfo) => {
      setInitialInfo(addressInfo);
    }).catch((error) => {
      console.error(error);
      navigate(ROUTES.ManageAddress)
    });
  }, [id]);

  function handleUpdateAddress(address: DTO<Address>) {
    api.customer.updateAddress(cookies.userId, address.id as number, address).then(() => {
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
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg w-max">Update Address</button>
        </Form>
      </Formik>
    </ManageRightLayout >
  );
}
