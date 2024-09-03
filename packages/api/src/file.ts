import { FileInfo } from "./lib/types";
import { Resource } from "./lib/resource";
import { request } from "./lib/api";
import { download } from "./lib/download";

class FileResource extends Resource<FileInfo>{
  constructor() {
    super('/files');
  }

  async download(id: number): Promise<void> {
    request<string>(`${this.baseURL}/${id}/download`, 'GET', {}).then((res) => {
      download(res);
    })
  }
}

export const file = new FileResource();