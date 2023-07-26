import { api } from '@/api';
import FormGroup from '@/component/form/FormGroup';
import ManageRightLayout from '@/component/layout/ManageRightLayout';
import { AddressSchema } from '@/schemas/shopify';
import { Address, DTO } from '@/types';
import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';

function AddAddress({ userId, onAdd }: { userId: string, onAdd?: (addr: DTO<Address>) => void }) {

  function handleSaveAddress(address: DTO<Address>) {
    const addressData = {
      street: address.street,
      streetLine2: address.streetLine2,
      city: address.city,
      state: address.state,
      country: address.country,
      zipCode: address.zipCode,
      isDefault: address.isDefault,
    };
    api.customer.createAddress(userId, addressData).then((address) => {
      onAdd && onAdd(address);
    }).catch((error) => {
      console.error(error);
    });
  }

  return (
    <Formik
      initialValues={{
        street: '',
        streetLine2: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
        isDefault: false
      }}
      validationSchema={AddressSchema}
      onSubmit={(values) => {
        handleSaveAddress(values);
      }}>
      <Form className="flex flex-col space-y-2">
        <FormGroup type="text" name="street" required autoComplete="address-line1" />
        <FormGroup type="text" name="streetLine2" autoComplete="address-line2" />
        <FormGroup type="text" name="city" required autoComplete="address-level2" />
        <FormGroup type="text" name="state" displayName="State or Province" required autoComplete="address-level1" />
        <FormGroup type="text" name="zipCode" displayName="Zip or Postal Code" required autoComplete="postal-code" />
        <FormGroup type="text" name="country" required autoComplete="country-name" />
        <div className="grid grid-cols-4 gap-4 w-full">
          <Field id="isDefault"
            name="isDefault"
          >
            {({
              field,
            }: FieldProps) => (
              <>
                <label
                  htmlFor="isDefault"
                  className={`text-sm font-bold`}
                >Default</label>
                <div className="flex justify-start">
                <input
                  type="checkbox"
                  {...field}
                  className="" />
                </div>
                
              </>
            )}
          </Field>
        </div >
        <button type="submit" className="w-max bg-green-600 text-white rounded-md px-4 py-2">Add Address</button>
      </Form>
    </Formik>
  );
}

export default AddAddress