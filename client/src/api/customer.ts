import type { Customer, DTO, OrderInfo } from "@/types";
import request from "./lib/api";
import { customer } from "./lib/newServerConfig";

// Get customer info
export function getCustomerInfo(customerId: string): Promise<DTO<Customer>> {
  return request(customer.getById(customerId), 'GET', {}, true)
    .then((res) => {
      return res.data as DTO<Customer>;
    });
}

export function getCustomerOrders(customerId: string, completed: boolean = true): Promise<DTO<OrderInfo>[]> {
  return request(customer.getOrdersById(customerId), 'GET', { where: { orderComplete: completed } }, true)
    .then((res) => {
      // console.log(res.data)
      return res.data as OrderInfo[];
    })
}
// Get customer 