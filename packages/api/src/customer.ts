import type { Address, Count, Customer, DTO, FileInfo, IncludeAddress, IncludeUser, OrderInfo, User, OrderChip } from "./lib/types";
import { request } from "./lib/api";
import { Resource } from "./lib/resource";
import { download } from "./lib/download";

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
  async create(data: DTO<Customer & User & Address>, query?: string): Promise<DTO<Customer>> {
    const url = query ? `${this.baseURL}?fileTransfer=${query}` : this.baseURL;
    return request<DTO<Customer>>(url, 'POST', data).then((res) => {
      return res.data;
    });
  }

  async getAddress(id: typeof Customer.prototype.id, addressId: typeof Address.prototype.id): Promise<DTO<Address>> {
    return request<DTO<Address>>(`${this.baseURL}/${id}/addresses/${addressId}`, 'GET', {}).then((res) => {
      return res.data;
    });
  }

  async getAddresses(id: typeof Customer.prototype.id): Promise<DTO<Address>[]> {
    return request<DTO<Address>[]>(`${this.baseURL}/${id}/addresses`, 'GET', {}).then((res) => {
      return res.data;
    });
  }

  async getDefaultAddress(id: typeof Customer.prototype.id): Promise<DTO<Address> | null> {
    return request<DTO<Address>[]>(`${this.baseURL}/${id}/addresses`, 'GET', { where: { isDefault: true } }).then((res) => {
      return res.data.length > 0 ? res.data[0] : null;
    });
  }

  async setDefaultAddress(id: typeof Customer.prototype.id, addressId: typeof Address.prototype.id): Promise<DTO<Address>> {
    return request<DTO<Address>>(`${this.baseURL}/${id}/addresses/${addressId}/default`, 'POST', {}).then((res) => {
      return res.data;
    });
  }

  async createAddress(id: typeof Customer.prototype.id, data: DTO<Address>): Promise<DTO<Address>> {
    return request<DTO<Address>>(`${this.baseURL}/${id}/addresses`, 'POST', data).then((res) => {
      return res.data;
    });
  }

  async updateAddress(id: typeof Customer.prototype.id, addressId: typeof Address.prototype.id, data: Partial<DTO<Address>>): Promise<Count> {
    return request<Count>(`${this.baseURL}/${id}/addresses/${addressId}`, 'PATCH', data).then((res) => {
      return res.data;
    });
  }

  async deleteAddress(id: typeof Customer.prototype.id, addressId: typeof Address.prototype.id): Promise<Count> {
    return request<Count>(`${this.baseURL}/${id}/addresses`, 'DELETE', { where: { id: addressId } }).then((res) => {
      return res.data;
    });
  }

  async getOrders(id: typeof Customer.prototype.id, completed: boolean = true): Promise<DTO<OrderInfo>[]> {
    return request<DTO<OrderInfo>[]>(`${this.baseURL}/${id}/orders`, 'GET', { filter: { where: { orderComplete: completed } } }).then((res) => {
      return res.data;
    });
  }

  // async createCart(id: typeof Customer.prototype.id): Promise<DTO<OrderInfo>> {
  //   return request<DTO<OrderInfo>>(`${this.baseURL}/${id}/orders`, 'POST', {}).then((res) => {
  //     return res.data;
  //   });
  // }

  async getCart(id: typeof Customer.prototype.id): Promise<DTO<OrderInfo>> {
    return request<DTO<OrderInfo>>(`${this.baseURL}/${id}/cart`, 'GET', {}).then((res) => {
      return res.data;
    });
  }

  async checkoutCart(id: typeof Customer.prototype.id, orderId: number, address?: DTO<Address>): Promise<DTO<OrderInfo>> {
    return request<DTO<OrderInfo>>(`${this.baseURL}/${id}/orders/${orderId}/checkout`, 'POST', address ?? {}).then((res) => {
      return res.data;
    });
  }

  async getFiles(id: typeof Customer.prototype.id): Promise<DTO<FileInfo>[]> {
    return request<DTO<FileInfo>[]>(`${this.baseURL}/${id}/files`, 'GET', {}).then((res) => {
      return res.data;
    });
  }

  async getFile(id: typeof Customer.prototype.id, fileId: typeof FileInfo.prototype.id): Promise<DTO<FileInfo>> {
    return request<DTO<FileInfo>>(`${this.baseURL}/${id}/files/${fileId}`, 'GET', {}).then((res) => {
      return res.data;
    });
  }

  async uploadFile(id: typeof Customer.prototype.id, formData: FormData): Promise<DTO<FileInfo>> {
    return request<DTO<FileInfo>>(`${this.baseURL}/${id}/files`, 'POST', formData, {
      'Content-Type': 'multipart/form-data'
    }).then((res) => {
      return res.data;
    });
  }

  async guestUploadFile(formData: FormData): Promise<DTO<FileInfo>> {
    const url = this.baseURL.replace('/customers', '');
    return request<DTO<FileInfo>>(`${url}/guest/files`, 'POST', formData, {
      'Content-Type': 'multipart/form-data'
    }).then((res) => {
      return res.data;
    });
  }

  async guestGetFile(fileId: typeof FileInfo.prototype.id): Promise<DTO<FileInfo>> {
    const url = this.baseURL.replace('/customers', '');
    return request<DTO<FileInfo>>(`${url}/guest/files/${fileId}`, 'GET', {}).then((res) => {
      return res.data;
    });
  }

  async guestTransferFile(id: typeof Customer.prototype.id, fileId: typeof FileInfo.prototype.id): Promise<string> {
    return request<string>(`${this.baseURL}/${id}/guestTransfer/${fileId}`, 'PATCH', {}, {
      'Content-Type': 'multipart/form-data'
    }).then((res) => {
      return res.data;
    });
  }

  async downloadFile(id: typeof Customer.prototype.id, fileId: typeof FileInfo.prototype.id, save: boolean = false): Promise<string> {
    return request<string>(`${this.baseURL}/${id}/files/${fileId}/download`, 'GET', {}).then(async (res) => {
      const data = res.data as string;
      // console.log(res);
      if (save) {
        download(res);
      }
      return data;
    });
  }

  async guestDownloadFile(fileId: typeof FileInfo.prototype.id, save: boolean = false): Promise<string> {
    const url = this.baseURL.replace('/customers', '');
    return request<string>(`${url}/guest/files/${fileId}/download`, 'GET', {}).then(async (res) => {
      const data = res.data as string;
      // console.log(res);
      if (save) {
        download(res);
      }
      return data;
    });
  }

  async deleteFile(id: typeof Customer.prototype.id, fileId: typeof FileInfo.prototype.id): Promise<Count> {
    return request<Count>(`${this.baseURL}/${id}/files/${fileId}`, 'DELETE', {}).then((res) => {
      return res.data;
    });
  }

  async getChipOrders(id: typeof Customer.prototype.id): Promise<DTO<OrderChip>[]> {
    return request<DTO<OrderChip>[]>(`${this.baseURL}/${id}/order-chips`, 'GET', {}).then((res) => {
      return res.data;
    });
  }
}

export const customer = new CustomerResource();