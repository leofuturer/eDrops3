import { Form, Formik } from 'formik';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import { request, customerAddresses, getCustomerCart } from '../../../../api';
import ManageRightLayout from '../../../../component/layout/ManageRightLayout';
import FormGroup from '../../../../component/form/FormGroup';
import { Address } from '../../../../types';
import { AddressSchema } from '../../../../schemas/shopify';
import { ROUTES } from '@/router/routes';

export function AddNewAddress({ addOnClick }: { addOnClick?: (addr: Address) => void }) {
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
    if (location.pathname === '/before-checkout') {
      request(getCustomerCart.replace('id', cookies.userId), 'GET', {}, true)
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
        .then(() => request(customerAddresses.replace('id', cookies.userId), 'POST', addressMes, true))
        .then((res) => {
          // console.log(res);
          navigate(ROUTES.BeforeCheckout, {
            state: {
              cartId: cartId,
              shopifyCheckoutId: shopifyCheckoutId,
              shopifyCheckoutLink: shopifyCheckoutLink,
            }
          }); // TODO: I think we can replace navigation state with query params (allows users to refresh page/use back button)
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      request(customerAddresses.replace('id', cookies.userId), 'POST', addressMes, true)
        .then((res) => {
          // console.log(res);
          navigate(ROUTES.ManageAddress);
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
          // @ts-expect-error
          addOnClick && addOnClick(values);
          handleSaveAddress(values);
        }}>
        <Form className="flex flex-col space-y-2">
          <FormGroup type="text" name="street" required autoComplete="address-line1" />
          <FormGroup type="text" name="streetLine2" autoComplete="address-line2" />
          <FormGroup type="text" name="city" required autoComplete="address-level2" />
          <FormGroup type="text" name="state" displayName="State or Province" required autoComplete="address-level1" />
          <FormGroup type="text" name="zipCode" displayName="Zip or Postal Code" required autoComplete="postal-code" />
          <FormGroup type="text" name="country" required autoComplete="country-name" />
          <button type="submit" className="w-max bg-green-600 text-white rounded-md px-4 py-2">Add Address</button>
        </Form>
      </Formik>
    </ManageRightLayout>
  );
}
