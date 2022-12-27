import * as Yup from 'yup';

export const AddressSchema = Yup.object().shape({
  street: Yup.string().required('Street can\'t be blank'),
  streetLine2: Yup.string().notRequired(),
  city: Yup.string().required('City can\'t be blank'),
  state: Yup.string().required('State can\'t be blank'),
  country: Yup.string().required('Country can\'t be blank'),
  zipCode: Yup.string().required('Zip code can\'t be blank'),
});