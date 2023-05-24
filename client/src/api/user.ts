import { User } from "@/types";
import request from "./lib/api";
import { Resource } from "./lib/resource";

class UserResource extends Resource<User> {
  constructor() {
    super('/users');
  }

  async login(username: string, password: string): Promise<boolean> {
    const data = (/@/.test(username)) ? {
      email: username,
      password: password,
    } : {
      username: username,
      password: password,
    };
    return request(`${this.baseURL}/login`, 'POST', data)
      .then((res) => {
        return res.status === 200;
      }).catch((err) => {
        // console.error(err);
        if (err.response.status === 401) {
        }
        return false;
      });
  }

  async signup(username: string, password: string, email: string): Promise<boolean> {
    const data = {
      username: username,
      password: password,
      email: email,
    };
    return false;
    // request(customer.get, 'POST', data, false)
    //   .then((res) => {
    //     return res.status === 200;
    //   }).catch((err) => {
    //     // console.error(err);
    //     if (err.response.status === 401) {
    //     }
    //     return false;
    //   });
  }

  async credsTaken(username: string, email: string): Promise<boolean> {
    return request<boolean>(`${this.baseURL}/creds-taken`, 'POST', { username: username, email: email }).then((res) => {
      return res.data;
    });
  }

  async verifyEmail(): Promise<void> {
     request(`${this.baseURL}/verify-email`, 'POST', {});
  }
}

export const user = new UserResource();