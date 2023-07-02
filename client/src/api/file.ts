import { FileInfo } from "@/types";
import { Resource } from "./lib/resource";
import request from "./lib/api";

class FileResource extends Resource<FileInfo>{
  constructor() {
    super('/files');
  }

  async download(id: number): Promise<void> {
    // request(`${this.baseURL}/${id}/download`, 'GET', {});

    window.location.href = `/api/${this.baseURL}/${id}/download`;
  }
}

export const file = new FileResource();