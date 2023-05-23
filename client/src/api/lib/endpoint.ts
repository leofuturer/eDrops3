import { request } from "@/api";
import { DTO, Entity } from "@/types";

export class Resource<T extends Entity> {
  constructor(protected baseURL: string) { }

  async get(id: string | number): Promise<DTO<T>> {
    return request<T>(`${this.baseURL}/${id}`, 'GET', {}, true).then((res) => {
      return res.data as DTO<T>;
    });
  }

  async getAll(): Promise<DTO<T>[]> {
    return request<T[]>(this.baseURL, 'GET', {}, true).then((res) => {
      return res.data as DTO<T>[];
    });
  }

  async create(data: DTO<T>): Promise<DTO<T>> {
    return request<DTO<T>>(this.baseURL, 'POST', data, true).then((res) => {
      return res.data as T;
    });
  }

  async replace(id: string | number, data: DTO<T>): Promise<DTO<T>> {
    return request<DTO<T>>(`${this.baseURL}/${id}`, 'PUT', data, true).then((res) => {
      return res.data as DTO<T>;
    });
  }

  async update(id: string | number, data: Partial<DTO<T>>): Promise<DTO<T>> {
    return request<DTO<T>>(`${this.baseURL}/${id}`, 'PATCH', data, true).then((res) => {
      return res.data as DTO<T>;
    });
  }

  async delete(id: string): Promise<DTO<T>> {
    return request<DTO<T>>(`${this.baseURL}/${id}`, 'DELETE', {}, true).then((res) => {
      return res.data as DTO<T>;
    });
  }
}