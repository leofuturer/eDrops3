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
    customerId: 'aaaa-bbbb-cccc-dddd',
  },
  {
    street: '1432 Haton Ave',
    streetLine2: '',
    city: 'Los Angeles',
    state: 'California',
    country: 'United States',
    zipCode: '90034',
    isDefault: true,
    customerId: 'aaaa-bbbb-cccc-eeee',
  },
  {
    street: '1234 Cilas Ave',
    streetLine2: '',
    city: 'Los Angeles',
    state: 'California',
    country: 'United States',
    zipCode: '90067',
    isDefault: false,
    customerId: 'aaaa-bbbb-cccc-dddd',
  },
  {
    street: '456 Cilas Ave',
    streetLine2: '',
    city: 'Los Angeles',
    state: 'California',
    country: 'United States',
    zipCode: '90067',
    isDefault: false,
    customerId: 'aaaa-bbbb-cccc-eeee',
  },
];
