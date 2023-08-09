import { request } from "./api";
import type { Count, DTO } from "./types/index";

export interface ResourceInterface<T> {
  baseURL: string;
  get(id: string | number): Promise<T>;
  getAll(): Promise<T[]>;
  create(data: T): Promise<T>;
  replace(id: string | number, data: T): Promise<void>;
  update(id: string | number, data: T): Promise<void>;
  delete(id: string | number): Promise<void>;
}

export class Resource<T extends object> implements ResourceInterface<DTO<T>> {
  public baseURL: string;
  constructor(baseURL: string) { this.baseURL = baseURL; }

  async get(id: string | number, params: object = {}): Promise<DTO<T>> {
    return request<DTO<T>>(`${this.baseURL}/${id}`, 'GET', params).then((res) => {
      return res.data;
    });
  }

  async getAll(params: object = {}): Promise<DTO<T>[]> {
    return request<DTO<T>[]>(this.baseURL, 'GET', params).then((res) => {
      return res.data;
    });
  }

  async create(data: DTO<T>): Promise<DTO<T>> {
    return request<DTO<T>>(this.baseURL, 'POST', data).then((res) => {
      return res.data;
    });
  }

  async replace(id: string | number, data: DTO<T>): Promise<void> {
    request<DTO<T>>(`${this.baseURL}/${id}`, 'PUT', data);
  }

  async update(id: string | number, data: Partial<DTO<T>>): Promise<void> {
    request<DTO<T>>(`${this.baseURL}/${id}`, 'PATCH', data);
  }

  async delete(id: string): Promise<void> {
    request<Count>(`${this.baseURL}/${id}`, 'DELETE', {});
  }
}