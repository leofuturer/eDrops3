import { Form, Formik } from 'formik';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../../api/api';
import { customerAddresses, getCustomerCart } from '../../api/serverConfig';
import ManageRightLayout from '../../component/layout/ManageRightLayout';
import FormGroup from '../../component/form/FormGroup';
import { Address } from '../../types';
import { AddressSchema } from '../../schemas/shopify';

function AddNewAddress({ addOnClick }: { addOnClick?: (addr: Address) => void }) {
  const [cartId, setCartId] = useState('');
  const [shopifyCheckoutId, setShopifyCheckoutId] = useState('');
  const [shopifyCheckoutLink, setShopifyCheckoutLink] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const [cookies] = useCookies(['userId'])

  function handleSaveAddress(address: Omit<Address, 'id' | 'isDefault'>) {
    const addressMes = {
      street: address.street,
      streetLine2: address.streetLine2,
      city: address.city,
      state: address.state,
      country: address.country,
      zipCode: address.zipCode,
      isDefault: false,
    };
    // if (!addressMes.street || !addressMes.city || !addressMes.state
    //   || !addressMes.country || !addressMes.zipCode) {
    //   alert('Error: All fields must be filled');
    if (location.pathname === '/beforeCheckout') {
      API.Request(getCustomerCart.replace('id', cookies.userId), 'GET', {}, true)
        .then((res) => {
          if (res.data.id) {
            setCartId(res.data.id);
            setShopifyCheckoutId(res.data.checkoutIdClient);
            setShopifyCheckoutLink(res.data.checkoutLink);
          }
          else {
            throw new Error('Error: No cart found');
          }
        })
        .then(() => API.Request(customerAddresses.replace('id', cookies.userId), 'POST', addressMes, true))
        .then((res) => {
          // console.log(res);
          navigate('/beforeCheckout', {
            state: {
              cartId: cartId,
              shopifyCheckoutId: shopifyCheckoutId,
              shopifyCheckoutLink: shopifyCheckoutLink,
            }
          });
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      API.Request(customerAddresses.replace('id', cookies.userId), 'POST', addressMes, true)
        .then((res) => {
          // console.log(res);
          navigate('/manage/address');
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  return (
    <ManageRightLayout title="Add New Address">
      <Formik
        initialValues={{
          street: '',
          streetLine2: '',
          city: '',
          state: '',
          country: '',
          zipCode: '',
        }}
        validationSchema={AddressSchema}
        onSubmit={(values) => {
          addOnClick && addOnClick(values);
          handleSaveAddress(values);
        }}>
        <Form className="flex flex-col space-y-2">
          <FormGroup name="street" />
          <FormGroup name="streetLine2" />
          <FormGroup name="city" />
          <FormGroup name="state" displayName="State or Province" />
          <FormGroup name="zipCode" displayName="Zip or Postal Code" />
          <FormGroup name="country" />
          <button type="submit" className="w-max bg-green-600 text-white rounded-md px-4 py-2">Add Address</button>
        </Form>
      </Formik>
    </ManageRightLayout>
  );
}

export default AddNewAddress;
