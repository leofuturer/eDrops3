import { request } from "./api";
import { DTO, Entity } from "@/types";

export interface ResourceInterface<T> {
  baseURL: string;
  get(id: string | number): Promise<T>;
  getAll(): Promise<T[]>;
  create(data: T): Promise<T>;
  replace(id: string | number, data: T): Promise<T>;
  update(id: string | number, data: T): Promise<T>;
  delete(id: string | number): Promise<T>;
}

export class Resource<T extends Entity> implements ResourceInterface<DTO<T>> {
  public baseURL: string;
  constructor(baseURL: string) { this.baseURL = baseURL; }

  async get(id: string | number): Promise<DTO<T>> {
    return request<DTO<T>>(`${this.baseURL}/${id}`, 'GET', {}).then((res) => {
      return res.data;
    });
  }

  async getAll(): Promise<DTO<T>[]> {
    return request<DTO<T>[]>(this.baseURL, 'GET', {}).then((res) => {
      return res.data;
    });
  }

  async create(data: DTO<T>): Promise<DTO<T>> {
    return request<DTO<T>>(this.baseURL, 'POST', data).then((res) => {
      return res.data;
    });
  }

  async replace(id: string | number, data: DTO<T>): Promise<DTO<T>> {
    return request<DTO<T>>(`${this.baseURL}/${id}`, 'PUT', data).then((res) => {
      return res.data;
    });
  }

  async update(id: string | number, data: Partial<DTO<T>>): Promise<DTO<T>> {
    return request<DTO<T>>(`${this.baseURL}/${id}`, 'PATCH', data).then((res) => {
      return res.data;
    });
  }

  async delete(id: string): Promise<DTO<T>> {
    return request<DTO<T>>(`${this.baseURL}/${id}`, 'DELETE', {}).then((res) => {
      return res.data;
    });
  }
}