import {CustomerAddress} from '../../models';

export const defaultCustomerAddresses: Partial<CustomerAddress>[] = [
  {
    street: '10988 Ashton Ave',
    streetLine2: '',
    city: 'Los Angeles',
    state: 'California',
    country: 'United States',
    zipCode: '90024',
    isDefault: true,
  },
  {
    street: '1432 Haton Ave',
    streetLine2: '',
    city: 'Los Angeles',
    state: 'California',
    country: 'United States',
    zipCode: '90034',
    isDefault: true,
  },
  {
    street: '1234 Cilas Ave',
    streetLine2: '',
    city: 'Los Angeles',
    state: 'California',
    country: 'United States',
    zipCode: '90067',
    isDefault: false,
  },
  {
    street: '456 Cilas Ave',
    streetLine2: '',
    city: 'Los Angeles',
    state: 'California',
    country: 'United States',
    zipCode: '90067',
    isDefault: false,
  },
];
