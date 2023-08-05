import type { Count, DTO, OrderChip, OrderInfo, OrderMessage, OrderProduct } from "./lib/types";
import { Resource } from "./lib/resource";
import request from "./lib/api";
import type { CheckoutLineItemInput, Product } from "shopify-buy";

class OrderResource extends Resource<OrderInfo> {
  constructor() {
    super('/orders');
  }

  async getMessages(id: number): Promise<DTO<OrderMessage>[]> {
    return request<DTO<OrderMessage>[]>(`${this.baseURL}/${id}/messages`, 'GET', {}).then((res) => res.data);
  }

  async addMessage(id: number, data: DTO<OrderMessage>): Promise<DTO<OrderMessage>> {
    return request<DTO<OrderMessage>>(`${this.baseURL}/${id}/messages`, 'POST', data).then((res) => res.data);
  }

  async addProductOrder(id: number, data: Product & CheckoutLineItemInput): Promise<DTO<OrderProduct>> {
    return request<DTO<OrderProduct>>(`${this.baseURL}/${id}/order-products`, 'POST', data).then((res) => res.data);
  }

  async updateProductOrder(id: number, orderProductId: number, data: DTO<OrderChip>): Promise<Count> {
    return request<Count>(`${this.baseURL}/${id}/order-products/${orderProductId}`, 'PATCH', data).then((res) => res.data);
  }

  async deleteProductOrder(id: number, orderProductId: number): Promise<void> {
    request(`${this.baseURL}/${id}/order-products/${orderProductId}`, 'DELETE', {});
  }

  async getProductOrders(id: number): Promise<DTO<OrderProduct>[]> {
    return request<DTO<OrderProduct>[]>(`${this.baseURL}/${id}/order-products`, 'GET', {}).then((res) => res.data);
  }

  async addChipOrder(id: number, data: Product & CheckoutLineItemInput): Promise<DTO<OrderChip>> {
    return request<DTO<OrderChip>>(`${this.baseURL}/${id}/order-chips`, 'POST', data).then((res) => res.data);
  }

  async updateChipOrder(id: number, orderChipId: number, data: DTO<OrderChip>): Promise<Count> {
    return request<Count>(`${this.baseURL}/${id}/order-chips/${orderChipId}`, 'PATCH', data).then((res) => res.data);
  }

  async deleteChipOrder(id: number, orderChipId: number): Promise<void> {
    request(`${this.baseURL}/${id}/order-chips/${orderChipId}`, 'DELETE', {});
  }

  async getChipOrders(id: number): Promise<DTO<OrderChip>[]> {
    return request<DTO<OrderChip>[]>(`${this.baseURL}/${id}/order-chips`, 'GET', {}).then((res) => res.data);
  }
}

export const order = new OrderResource();