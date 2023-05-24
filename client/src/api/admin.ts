import { Admin, DTO, User } from "@/types";
import { Resource } from "./lib/resource";
import request from "./lib/api";

class AdminResource extends Resource<Admin> {
  constructor() {
    super('/admins');
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