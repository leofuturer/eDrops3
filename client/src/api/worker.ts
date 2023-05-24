import { DTO, FoundryWorker, User } from "@/types";
import { Resource } from "./lib/resource";
import request from "./lib/api";

class WorkerResource extends Resource<FoundryWorker> {
  constructor() {
    super('/workers');
  }

  /*
    @override Resource.create
  */
  async create(data: DTO<FoundryWorker & User>): Promise<DTO<FoundryWorker>> {
    return request<DTO<FoundryWorker>>(this.baseURL, 'POST', data).then((res) => {
      return res.data;
    });
  }

}

export const worker = new WorkerResource();