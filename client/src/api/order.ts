import { DTO, OrderInfo, OrderMessage } from "@/types";
import { Resource } from "./lib/resource";
import request from "./lib/api";

class OrderResource extends Resource<OrderInfo> {
  constructor() {
    super('/orders');
  }

  async getMessages(id: string): Promise<DTO<OrderMessage>[]> {
    return request<DTO<OrderMessage>[]>(`/orders/${id}/messages`, 'GET', {}).then((res) => res.data);
  }

  async addMessage(id: string, data: OrderMessage): Promise<DTO<OrderMessage>> {
    return request<DTO<OrderMessage>>(`/orders/${id}/messages`, 'POST', data).then((res) => res.data);
  }
}

export const order = new OrderResource();