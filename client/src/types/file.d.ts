export interface FileInfo {
  id: number;
  fileName: string;
  fileSize: number;
  uploadTime: string;
  uploader: string;
  container: string;
  containerFileName: string;
  customerId: string;
  isDeleted: boolean;
  isPublic: boolean;
  unit: string;
}