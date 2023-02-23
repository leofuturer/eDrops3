interface Order {
  id: number;
  productIdShopify: string;
  variantIdShopify: string;
  lineItemIdShopify: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  otherDetails?: string;
  orderInfoId?: number;
}

export interface ProductOrder extends Order {

}

export interface ChipOrder extends Order {
  process: string;
  coverPlate: string;
  lastUpdated: string;
  status: string;
  fileInfoId: number;
  workerId: string;
  customerName?: string;
  workerName?: string;
}

export interface OrderInfo {
  id: number; 
  checkoutIdClient: string; 
  checkoutToken: string; 
  checkoutLink: string; 
  orderInfoId?: string; 
  createdAt: string; 
  lastModifiedAt: string; 
  orderStatusURL?: string; 
  orderComplete: boolean; 
  status: string; 
  fees_and_taxes?: string; 
  subtotal_cost?: string; 
  total_cost?: string; 
  user_email?: string; 
  sa_name?: string; 
  sa_address1?: string; 
  sa_address2?: string; 
  sa_city?: string; 
  sa_province?: string; 
  sa_zip?: string; 
  sa_country?: string; 
  ba_name?: string; 
  ba_address1?: string; 
  ba_address2?: string; 
  ba_city?: string; 
  ba_province?: string; 
  ba_zip?: string; 
  ba_country?: string; 
  otherDetails?: string; 
  customerId?: string; 
  billingAddressId?: number; 
  shippingAddressId?: number;
  orderProducts?: ProductOrder[];
  orderChips?: ChipOrder[];
  // orderMessages: OrderMessage[];
}