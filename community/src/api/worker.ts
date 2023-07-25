import type { DTO, FoundryWorker, IncludeUser, OrderChip, User } from "./lib/models";
import { Resource } from "./lib/resource";
import request from "./lib/api";

class WorkerResource extends Resource<FoundryWorker> {
  constructor() {
    super('/foundry-workers');
  }

  /*
    @override Resource.get
  */
  async get(id: string): Promise<DTO<IncludeUser<FoundryWorker>>> {
    return request<DTO<IncludeUser<FoundryWorker>>>(`${this.baseURL}/${id}`, 'GET', {}).then((res) => {
      return res.data;
    });
  }

  /*
    @override Resource.getAll
  */
  async getAll(): Promise<DTO<IncludeUser<FoundryWorker>>[]> {
    return request<DTO<IncludeUser<FoundryWorker>>[]>(this.baseURL, 'GET', {}).then((res) => {
      return res.data;
    });
  }

  /*
    @override Resource.create
  */
  async create(data: DTO<FoundryWorker & User>): Promise<DTO<FoundryWorker>> {
    return request<DTO<FoundryWorker>>(this.baseURL, 'POST', data).then((res) => {
      return res.data;
    });
  }

  async updateChip(id: string, chipOrderId: number, data: Partial<DTO<OrderChip>>): Promise<void> {
    request(`${this.baseURL}/${id}/order-chips/${chipOrderId}`, 'PATCH', data);
  }

  async getChipOrders(id: string): Promise<DTO<OrderChip>[]> {
    return request<DTO<OrderChip>[]>(`${this.baseURL}/${id}/order-chips`, 'GET', {}).then((res) => {
      return res.data;
    });
  }

}

export const worker = new WorkerResource();