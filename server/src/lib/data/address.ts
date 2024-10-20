import { Address } from '../../models';

export const defaultAddresses: Partial<Address>[] = [
  {
    id: 1,
    street: '10988 Ashton Ave',
    streetLine2: '',
    city: 'Los Angeles',
    state: 'California',
    country: 'United States',
    zipCode: '90024',
    isDefault: true,
    userId: 'aaaaaaaa-bbbb-aaaa-aaaa-aaaaaaaaaaaa',
  },
  {
    id: 2,
    street: '1432 Haton Ave',
    streetLine2: '',
    city: 'Los Angeles',
    state: 'California',
    country: 'United States',
    zipCode: '90034',
    isDefault: false,
    userId: 'aaaaaaaa-bbbb-aaaa-aaaa-aaaaaaaaaaaa',
  },
  // {
  //   id: 3,
  //   street: '1234 Cilas Ave',
  //   streetLine2: '',
  //   city: 'Los Angeles',
  //   state: 'California',
  //   country: 'United States',
  //   zipCode: '90067',
  //   isDefault: true,
  //   userId: 'aaaaaaaa-cccc-aaaa-aaaa-aaaaaaaaaaaa',
  // },
  // {
  //   id: 4,
  //   street: '456 Cilas Ave',
  //   streetLine2: '',
  //   city: 'Los Angeles',
  //   state: 'California',
  //   country: 'United States',
  //   zipCode: '90067',
  //   isDefault: false,
  //   userId: 'aaaaaaaa-cccc-aaaa-aaaa-aaaaaaaaaaaa',
  // },
];