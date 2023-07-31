import type { DTO, FileInfo, Post, Project, ProjectFile, User } from "./types/models";
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

  async uploadProjectFile(id: string, formData: FormData): Promise<DTO<ProjectFile>> {
    return request<DTO<ProjectFile>>(`${this.baseURL}/${id}/project-files`, 'POST', formData, {
      'Content-Type': 'multipart/form-data'
    }).then((res) => {
      return res.data;
    });
  }

  async getPosts(id: string): Promise<DTO<Post>[]> {
    return request<DTO<Post>[]>(`${this.baseURL}/${id}/posts`, 'GET', {}).then((res) => {
      return res.data;
    });
  }

  async getLikedPosts(id: string): Promise<DTO<Post>[]> {
    return request<DTO<Post>[]>(`${this.baseURL}/${id}/liked-posts`, 'GET', {}).then((res) => {
      return res.data;
    });
  }

  async getSavedPosts(id: string): Promise<DTO<Post>[]> {
    return request<DTO<Post>[]>(`${this.baseURL}/${id}/saved-posts`, 'GET', {}).then((res) => {
      return res.data;
    });
  }

  async getProjects(id: string): Promise<DTO<Project>[]> {
    return request<DTO<Project>[]>(`${this.baseURL}/${id}/projects`, 'GET', {}).then((res) => {
      return res.data;
    });
  }

  async getLikedProjects(id: string): Promise<DTO<Project>[]> {
    return request<DTO<Project>[]>(`${this.baseURL}/${id}/liked-projects`, 'GET', {}).then((res) => {
      return res.data;
    });
  }

  async getSavedProjects(id: string): Promise<DTO<Project>[]> {
    return request<DTO<Project>[]>(`${this.baseURL}/${id}/saved-projects`, 'GET', {}).then((res) => {
      return res.data;
    });
  }

  async getFollowers(id: string): Promise<DTO<User>[]> {
    return request<DTO<User>[]>(`${this.baseURL}/${id}/followers`, 'GET', {}).then((res) => {
      return res.data;
    });
  }

}

export const user = new UserResource();