import { User } from "@/types";
import request from "./lib/api";
import { Resource } from "./lib/resource";

class UserResource extends Resource<User> {
  constructor() {
    super('/users');
  }

  async login(username: string, password: string): Promise<{
    token: string;
    username: string;
    userId: string;
    userType: string;
  }> {
    const data = (/@/.test(username)) ? {
      email: username,
      password: password,
    } : {
      username: username,
      password: password,
    };
    return request<{
      token: string;
      username: string;
      userId: string;
      userType: string;
    }>(`${this.baseURL}/login`, 'POST', data).then((res) => {
      return res.data;
    });
  }

  async credsTaken(username: string, email: string): Promise<{ usernameTaken: boolean; emailTaken: boolean }> {
    return request<{ usernameTaken: boolean; emailTaken: boolean }>(`${this.baseURL}/creds-taken`, 'POST', { username: username, email: email }).then((res) => {
      return res.data;
    });
  }

  async verifyEmail(email: string): Promise<void> {
    request(`${this.baseURL}/verify-email`, 'POST', { email: email });
  }

  async getAPIToken(): Promise<{
    key: string;
  }> {
    return request<{ key: string }>(`${this.baseURL}/api-token`, 'GET', {}).then((res) => {
      return res.data;
    });
  }

  async resetPassword(newPassword: string, resetToken: string): Promise<void> {
    request(`${this.baseURL}/reset-password`, 'POST', { newPassword: newPassword, accessToken: resetToken });
  }

  async forgotPassword(email: string): Promise<void> {
    request(`${this.baseURL}/forgot-password`, 'POST', { email: email });
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    request(`${this.baseURL}/change-password`, 'POST', { oldPassword: oldPassword, newPassword: newPassword });
  }
}

export const user = new UserResource();