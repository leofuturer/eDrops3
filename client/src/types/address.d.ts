export interface Address {
    id: string;
    street: string;
    streetLine2: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    isDefault: boolean;
}

export interface DisplayAddress extends Omit<Address, 'id' | 'isDefault'> {
    type: string;
    name: string
}