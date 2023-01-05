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