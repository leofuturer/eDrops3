import { object, string } from 'yup';

export const AddressSchema = object().shape({
  street: string().required('Street can\'t be blank'),
  streetLine2: string().notRequired(),
  city: string().required('City can\'t be blank'),
  state: string().required('State can\'t be blank'),
  country: string().required('Country can\'t be blank'),
  zipCode: string().required('Zip code can\'t be blank'),
});