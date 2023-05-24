import { FileInfo } from "@/types";
import { Resource } from "./lib/resource";

class FileResource extends Resource<FileInfo>{
  constructor() {
    super('/files');
  }
}

export const file = new FileResource();