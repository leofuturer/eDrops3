import type { Address, Customer, OrderInfo } from "@/types";
import request from "./lib/api";
import { Resource } from "./lib/endpoint";

class Cust extends Resource<Customer> {
  constructor() {
    super('/customers');
  }

  getAddresses(id: string): Promise<Address[]> {
    return request<Address[]>(`${this.baseURL}/${id}/addresses`, 'GET', {}, true).then((res) => {
      return res.data as Address[];
    });
  }

  getOrders(id: string, completed: boolean = true): Promise<OrderInfo[]> {
    return request<OrderInfo[]>(`${this.baseURL}/${id}/orders`, 'GET', { where: { orderComplete: completed } }, true).then((res) => {
      return res.data as OrderInfo[];
    });
  }

  getCart(id: string): Promise<OrderInfo> {
    return request<OrderInfo>(`${this.baseURL}/${id}/cart`, 'GET', {}, true).then((res) => {
      return res.data as OrderInfo;
    });
  }
}

export const customer = new Cust();