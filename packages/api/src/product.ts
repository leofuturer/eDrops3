import type { Product } from "shopify-buy";
import { request } from "./lib/api";
import { ResourceInterface } from "./lib/resource";

class ProductResource implements Omit<ResourceInterface<Product>, 'create' | 'replace' | 'update' | 'delete'>{
  public baseURL;
  constructor() {
    this.baseURL = '/products';
  }

  async getAll(): Promise<Product[]> {
    return request<Product[]>(`${this.baseURL}`, 'GET', {}).then((res) => res.data);
  }

  async get(id: string): Promise<Product> {
    return request<Product>(`${this.baseURL}/${id}`, 'GET', {}).then((res) => res.data);
  }
}

export const product = new ProductResource();