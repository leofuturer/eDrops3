import { Order, OrderInfo } from "@/types";
import request from "./lib/api";
import { customer } from "./lib/newServerConfig";

// Get customer info
export function getCustomerInfo(customerId: string) {

}


export function getCutomerOrders(customerId: string, completed: boolean = true): Promise<OrderInfo[]> {
  return request(customer.getOrdersById(customerId), 'GET', { where: { orderComplete: completed } }, true)
    .then((res) => {
      // console.log(res.data)
      return res.data as OrderInfo[];
    })
}
// Get customer 