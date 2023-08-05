import { DTO, FileInfo, Post, Project, ProjectFile, User } from "./lib/types";
import request from "./lib/api";
import { Resource } from "./lib/resource";
import { download } from "./lib/download";

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

  async credsTaken(username: typeof User.prototype.username, email: typeof User.prototype.email): Promise<{ usernameTaken: boolean; emailTaken: boolean }> {
    return request<{ usernameTaken: boolean; emailTaken: boolean }>(`${this.baseURL}/creds-taken`, 'POST', { username: username, email: email }).then((res) => {
      return res.data;
    });
  }

  async verifyEmail(email: typeof User.prototype.email): Promise<void> {
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

  async uploadProjectFile(id: typeof User.prototype.id, formData: FormData): Promise<DTO<ProjectFile>> {
    return request<DTO<ProjectFile>>(`${this.baseURL}/${id}/project-files`, 'POST', formData, {
      'Content-Type': 'multipart/form-data'
    }).then((res) => {
      return res.data;
    });
  }

  async getPosts(id: typeof User.prototype.id): Promise<DTO<Post>[]> {
    return request<DTO<Post>[]>(`${this.baseURL}/${id}/posts`, 'GET', {}).then((res) => {
      return res.data;
    });
  }

  async createPost(id: typeof User.prototype.id, post: Post): Promise<DTO<Post>> {
    return request<DTO<Post>>(`${this.baseURL}/${id}/posts`, 'POST', post).then((res) => {
      return res.data;
    });
  }

  async getLikedPosts(id: typeof User.prototype.id): Promise<DTO<Post>[]> {
    return request<DTO<Post>[]>(`${this.baseURL}/${id}/liked-posts`, 'GET', {}).then((res) => {
      return res.data;
    });
  }

  async getLikedPost(id: typeof User.prototype.id, postId: typeof Post.prototype.id): Promise<DTO<Post>> {
    return request<DTO<Post>>(`${this.baseURL}/${id}/liked-posts/${postId}`, 'GET', {}).then((res) => {
      return res.data;
    });
  }

  async likePost(id: typeof User.prototype.id, postId: typeof Post.prototype.id): Promise<boolean> {
    return request<Post>(`${this.baseURL}/${id}/liked-posts/${postId}`, 'GET', {}).then((res) => {
      if(res.data) {
        return request(`${this.baseURL}/${id}/liked-posts/${postId}`, 'DELETE', {}).then(() => false);
      }
      else {
        return request(`${this.baseURL}/${id}/liked-posts/${postId}`, 'POST', {}).then(() => true);
      }
    });
  }

  async getSavedPosts(id: typeof User.prototype.id): Promise<DTO<Post>[]> {
    return request<DTO<Post>[]>(`${this.baseURL}/${id}/saved-posts`, 'GET', {}).then((res) => {
      return res.data;
    });
  }

  async getSavedPost(id: typeof User.prototype.id, postId: typeof Post.prototype.id): Promise<DTO<Post>> {
    return request<DTO<Post>>(`${this.baseURL}/${id}/saved-posts/${postId}`, 'GET', {}).then((res) => {
      return res.data;
    });
  }

  async savePost(id: typeof User.prototype.id, postId: typeof Post.prototype.id): Promise<boolean> {
    return request<Post>(`${this.baseURL}/${id}/saved-posts/${postId}`, 'GET', {}).then((res) => {
      if(res.data) {
        return request(`${this.baseURL}/${id}/saved-posts/${postId}`, 'DELETE', {}).then(() => false);
      }
      else {
        return request(`${this.baseURL}/${id}/saved-posts/${postId}`, 'POST', {}).then(() => true);
      }
    });
  }

  async getProjects(id: typeof User.prototype.id): Promise<DTO<Project>[]> {
    return request<DTO<Project>[]>(`${this.baseURL}/${id}/projects`, 'GET', {}).then((res) => {
      return res.data;
    });
  }

  async createProject(id: typeof User.prototype.id, project: Project): Promise<DTO<Project>> {
    return request<DTO<Project>>(`${this.baseURL}/${id}/projects`, 'POST', project).then((res) => {
      return res.data;
    });
  }

  async getLikedProjects(id: typeof User.prototype.id): Promise<DTO<Project>[]> {
    return request<DTO<Project>[]>(`${this.baseURL}/${id}/liked-projects`, 'GET', {}).then((res) => {
      return res.data;
    });
  }

  async getLikedProject(id: typeof User.prototype.id, projectId: typeof Project.prototype.id): Promise<DTO<Project>> {
    return request<DTO<Project>>(`${this.baseURL}/${id}/liked-projects/${projectId}`, 'GET', {}).then((res) => {
      return res.data;
    });
  }

  async likeProject(id: typeof User.prototype.id, projectId: typeof Project.prototype.id): Promise<boolean> {
    return request<Project>(`${this.baseURL}/${id}/liked-projects/${projectId}`, 'GET', {}).then((res) => {
      if(res.data) {
        return request(`${this.baseURL}/${id}/liked-projects/${projectId}`, 'DELETE', {}).then(() => false);
      }
      else {
        return request(`${this.baseURL}/${id}/liked-projects/${projectId}`, 'POST', {}).then(() => true);
      }
    });
  }

  async getSavedProjects(id: typeof User.prototype.id): Promise<DTO<Project>[]> {
    return request<DTO<Project>[]>(`${this.baseURL}/${id}/saved-projects`, 'GET', {}).then((res) => {
      return res.data;
    });
  }

  async getSavedProject(id: typeof User.prototype.id, projectId: typeof Project.prototype.id): Promise<DTO<Project>> {
    return request<DTO<Project>>(`${this.baseURL}/${id}/saved-projects/${projectId}`, 'GET', {}).then((res) => {
      return res.data;
    });
  }

  async saveProject(id: typeof User.prototype.id, projectId: typeof Project.prototype.id): Promise<boolean> {
    return request<Project>(`${this.baseURL}/${id}/saved-projects/${projectId}`, 'POST', {}).then((res) => {
      if(res.data) {
        return request(`${this.baseURL}/${id}/saved-projects/${projectId}`, 'DELETE', {}).then(() => false);
      }
      else {
        return request(`${this.baseURL}/${id}/saved-projects/${projectId}`, 'POST', {}).then(() => true);
      }
    });
  }

  async getFollowers(id: typeof User.prototype.id): Promise<DTO<User>[]> {
    return request<DTO<User>[]>(`${this.baseURL}/${id}/followers`, 'GET', {}).then((res) => {
      return res.data;
    });
  }

  // This request checks if the user is followed first or not, then follows or unfollows accordingly
  async follow(userId: typeof User.prototype.id, followerId: typeof User.prototype.id): Promise<boolean> {
    return request<User>(`${this.baseURL}/${userId}/followers/${followerId}`, 'GET', {}).then((res) => {
      if (res.data) {
        return request(`${this.baseURL}/${userId}/followers/${followerId}`, 'DELETE', {}).then(() => false);
      } else {
        return request(`${this.baseURL}/${userId}/followers/${followerId}`, 'POST', {}).then(() => true);
      }
    });
  }

  async downloadProjectFile(id: typeof User.prototype.id, projectFileId: typeof ProjectFile.prototype.id): Promise<void> {
    request<string>(`${this.baseURL}/${id}/projects/${projectFileId}/download`, 'GET', {}).then((res) => {
      download(res);
    });
  }

  async getUserProfile(id: typeof User.prototype.id) {
    return request<DTO<User>>(`${this.baseURL}/${id}/user-profile`, 'GET', {}).then((res) => {
      return res.data;
    });
  }
}

export const user = new UserResource();