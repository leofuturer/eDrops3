import { Admin, DTO, IncludeUser, User } from "@/types";
import { Resource } from "./lib/resource";
import request from "./lib/api";

class AdminResource extends Resource<Admin> {
  constructor() {
    super('/admins');
  }

  /*
    @override Resource.get
  */
  async get(id: string): Promise<DTO<IncludeUser<Admin>>> {
    return request<DTO<IncludeUser<Admin>>>(`${this.baseURL}/${id}`, 'GET', {}).then((res) => {
      return res.data;
    });
  }

  /*
    @override Resource.getAll
  */
  async getAll(): Promise<DTO<IncludeUser<Admin>>[]> {
    return request<DTO<IncludeUser<Admin>>[]>(this.baseURL, 'GET', {}).then((res) => {
      return res.data;
    });
  }

  /*
    @override Resource.create
  */
  async create(data: DTO<Admin & User>): Promise<DTO<Admin>> {
    return request<DTO<Admin>>(this.baseURL, 'POST', data).then((res) => {
      return res.data;
    });
  }

}

export const admin = new AdminResource();