import type { Address, Customer, DTO, FileInfo, OrderInfo, User } from "@/types";
import request from "./lib/api";
import { Resource } from "./lib/resource";

class CustomerResource extends Resource<Customer> {
  constructor() {
    super('/customers');
  }

  /*
    @override Resource.create
  */
  async create(data: DTO<Customer & User & Address>): Promise<DTO<Customer>> {
    return request<DTO<Customer>>(this.baseURL, 'POST', data).then((res) => {
      return res.data;
    });
  }

  async getAddresses(id: string): Promise<DTO<Address>[]> {
    return request<DTO<Address>[]>(`${this.baseURL}/${id}/addresses`, 'GET', {}).then((res) => {
      return res.data;
    });
  }

  async getOrders(id: string, completed: boolean = true): Promise<DTO<OrderInfo>[]> {
    return request<DTO<OrderInfo>[]>(`${this.baseURL}/${id}/orders`, 'GET', { where: { orderComplete: completed } }).then((res) => {
      return res.data;
    });
  }

  async getCart(id: string): Promise<DTO<OrderInfo>> {
    return request<DTO<OrderInfo>>(`${this.baseURL}/${id}/cart`, 'GET', {}).then((res) => {
      return res.data;
    });
  }

  async getFiles(id: string): Promise<DTO<FileInfo>[]> {
    return request<DTO<FileInfo>[]>(`${this.baseURL}/${id}/files`, 'GET', {}).then((res) => {
      return res.data;
    });
  }

  async getFile(id: string, fileId: string): Promise<DTO<FileInfo>> {
    return request<DTO<FileInfo>>(`${this.baseURL}/${id}/files/${fileId}`, 'GET', {}).then((res) => {
      return res.data;
    });
  }

  async uploadFile(id: string, file: File): Promise<DTO<FileInfo>> {
    const formData = new FormData();
    formData.append('file', file);
    return request<DTO<FileInfo>>(`${this.baseURL}/${id}/files`, 'POST', formData).then((res) => {
      return res.data;
    });
  }

  async downloadFile(id: string, fileId: string): Promise<DTO<FileInfo>> {
    return request<DTO<FileInfo>>(`${this.baseURL}/${id}/files/${fileId}`, 'GET', {}).then((res) => {
      return res.data;
    });
  }
}

export const customer = new CustomerResource();