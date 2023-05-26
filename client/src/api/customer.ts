import type { Address, Count, Customer, DTO, FileInfo, IncludeAddress, IncludeUser, OrderInfo, User, Response, OrderChip } from "@/types";
import request from "./lib/api";
import { Resource } from "./lib/resource";

class CustomerResource extends Resource<Customer> {
  constructor() {
    super('/customers');
  }
  /*
    @override Resource.get
  */
  async get(id: string): Promise<DTO<IncludeAddress<IncludeUser<Customer>>>> {
    return request<DTO<IncludeAddress<IncludeUser<Customer>>>>(`${this.baseURL}/${id}`, 'GET', {}).then((res) => {
      return res.data;
    });
  }

  /*
    @override Resource.getAll
  */
  async getAll(): Promise<DTO<IncludeAddress<IncludeUser<Customer>>>[]> {
    return request<DTO<IncludeAddress<IncludeUser<Customer>>>[]>(this.baseURL, 'GET', {}).then((res) => {
      return res.data;
    });
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

  async getDefaultAddress(id: string): Promise<DTO<Address> | null> {
    return request<DTO<Address>[]>(`${this.baseURL}/${id}/addresses`, 'GET', { where: { isDefault: true } }).then((res) => {
      return res.data.length > 0 ? res.data[0] : null;
    });
  }

  async createAddress(id: string, data: DTO<Address>): Promise<DTO<Address>> {
    return request<DTO<Address>>(`${this.baseURL}/${id}/addresses`, 'POST', data).then((res) => {
      return res.data;
    });
  }

  async updateAddress(id: string, addressId: number, data: Partial<DTO<Address>>): Promise<Count> {
    return request<Count>(`${this.baseURL}/${id}/addresses/${addressId}`, 'PATCH', data).then((res) => {
      return res.data;
    });
  }

  async deleteAddress(id: string, addressId: number): Promise<Count> {
    return request<Count>(`${this.baseURL}/${id}/addresses`, 'DELETE', { where: { id: addressId } }).then((res) => {
      return res.data;
    });
  }

  async getOrders(id: string, completed: boolean = true): Promise<DTO<OrderInfo>[]> {
    return request<DTO<OrderInfo>[]>(`${this.baseURL}/${id}/orders`, 'GET', { filter: { where: { orderComplete: completed } } }).then((res) => {
      return res.data;
    });
  }

  async createCart(id: string): Promise<DTO<OrderInfo>> {
    return request<DTO<OrderInfo>>(`${this.baseURL}/${id}/orders`, 'POST', {}).then((res) => {
      return res.data;
    });
  }

  async getCart(id: string): Promise<DTO<OrderInfo> | null> {
    return request<DTO<OrderInfo>>(`${this.baseURL}/${id}/cart`, 'GET', {}).then((res) => {
      return res.data ? res.data : null;
    });
  }

  async checkoutCart(id: string, orderId: number, address: DTO<Address>): Promise<DTO<OrderInfo>> {
    return request<DTO<OrderInfo>>(`${this.baseURL}/${id}/orders/${orderId}/checkout`, 'POST', address).then((res) => {
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

  async uploadFile(id: string, formData: FormData): Promise<DTO<FileInfo>> {
    return request<DTO<FileInfo>>(`${this.baseURL}/${id}/files`, 'POST', formData, {
      'Content-Type': 'multipart/form-data'
    }).then((res) => {
      return res.data;
    });
  }

  async downloadFile(id: string, fileId: number): Promise<void> {
    request<string>(`${this.baseURL}/${id}/files/${fileId}/download`, 'GET', {}).then((res) => {
      const data = res.data as string;
      console.log(res);
      // const blob = new Blob([data], { type: 'application/dxf' });
      // const blobUrl = window.URL.createObjectURL(blob);
      // window.location.href = blobUrl;
    });

    // window.location.href = `/api/customers/${id}/files/${fileId}/download`;
  }

  async deleteFile(id: string, fileId: number): Promise<Count> {
    return request<Count>(`${this.baseURL}/${id}/files/${fileId}`, 'DELETE', {}).then((res) => {
      return res.data;
    });
  }

  async getChipOrders(id: string): Promise<DTO<OrderChip>[]> {
    return request<DTO<OrderChip>[]>(`${this.baseURL}/${id}/order-chips`, 'GET', {}).then((res) => {
      return res.data;
    });
  }
}

export const customer = new CustomerResource();