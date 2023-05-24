import { DTO, OrderChip, OrderInfo, OrderMessage, OrderProduct } from "@/types";
import { Resource } from "./lib/resource";
import request from "./lib/api";

class OrderResource extends Resource<OrderInfo> {
  constructor() {
    super('/orders');
  }

  async getMessages(id: number): Promise<DTO<OrderMessage>[]> {
    return request<DTO<OrderMessage>[]>(`/orders/${id}/messages`, 'GET', {}).then((res) => res.data);
  }

  async addMessage(id: number, data: DTO<OrderMessage>): Promise<DTO<OrderMessage>> {
    return request<DTO<OrderMessage>>(`/orders/${id}/messages`, 'POST', data).then((res) => res.data);
  }

  async getProductOrders(id: number): Promise<DTO<OrderProduct>[]> {
    return request<DTO<OrderProduct>[]>(`/orders/${id}/order-products`, 'GET', {}).then((res) => res.data);
  }

  async getChipOrders(id: number): Promise<DTO<OrderChip>[]> {
    return request<DTO<OrderChip>[]>(`/orders/${id}/order-chips`, 'GET', {}).then((res) => res.data);
  }
}

export const order = new OrderResource();