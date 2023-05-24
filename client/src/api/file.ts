import { FileInfo } from "@/types";
import { Resource } from "./lib/resource";
import request from "./lib/api";

class FileResource extends Resource<FileInfo>{
  constructor() {
    super('/files');
  }

  async download(id: string): Promise<void> {
    request(`${this.baseURL}/${id}/download`, 'GET', {});
  }
}

export const file = new FileResource();