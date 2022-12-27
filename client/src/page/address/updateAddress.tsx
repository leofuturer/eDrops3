import { Formik, Form } from 'formik';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../../api/lib/api';
import FormGroup from '../../component/form/FormGroup';
import ManageRightLayout from '../../component/layout/ManageRightLayout';
import { AddressSchema } from '../../schemas/shopify';
import { Address } from '../../types';

function UpdateAddress() {
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
    API.Request(`customerAddresses.replace('id', cookies.userId)/${addressId}`, 'PATCH', address, true)
      .then((res) => {
        navigate('/manage/address');
      })
      .catch((error) => {
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
          <FormGroup type="text" name="street" required />
          <FormGroup type="text" name="streetLine2" />
          <FormGroup type="text" name="city" required />
          <FormGroup type="text" name="state" required />
          <FormGroup type="text" name="zipCode" required />
          <FormGroup type="text" name="country" required />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg w-max">Update Address</button>
        </Form>
      </Formik>
    </ManageRightLayout >
  );
}

export default UpdateAddress;
