import { ProjectFile } from '../../models';

export const defaultProjectFiles: Partial<ProjectFile>[] = [
  {
    id: 1,
    projectId: 3,
    uploadTime: new Date(Date.now() - 1000 * 60 * 60 * 9).toString(), // TODO: standardize date format across the board
    fileName: 'Project_seed1.dxf',
    containerFileName: 'Project_seed1.dxf',
    userId: 'aaaaaaaa-aaaa-aaaa-eeee-aaaaaaaaaaaa',
    uploader: 'DropGek',
    fileSize: '2.1 KB',
    isDeleted: false,
    container: 'edroplets-files',
    fileType: 'attachment',
    isPublic: true,
  },
  {
    id: 2,
    projectId: 3,
    uploadTime: new Date(Date.now() - 1000 * 60 * 60 * 9).toString(), // TODO: standardize date format across the board
    fileName: 'Project_seed1.jpg',
    containerFileName: 'Project_seed1.jpg',
    userId: 'aaaaaaaa-aaaa-aaaa-eeee-aaaaaaaaaaaa',
    uploader: 'DropGek',
    fileSize: '171 KB',
    isDeleted: false,
    container: 'edroplets-files',
    fileType: 'image',
    isPublic: true,
  },
  {
    id: 3,
    projectId: 4,
    uploadTime: new Date(Date.now() - 1000 * 60 * 60 * 9).toString(), // TODO: standardize date format across the board
    fileName: 'Project_seed2.jpg',
    containerFileName: 'Project_seed2.jpg',
    userId: 'aaaaaaaa-aaaa-aaaa-ffff-aaaaaaaaaaaa',
    uploader: 'Larry',
    fileSize: '216 KB',
    isDeleted: false,
    container: 'edroplets-files',
    fileType: 'image',
    isPublic: true,
  },
  {
    id: 4,
    projectId: 5,
    uploadTime: new Date(Date.now() - 1000 * 60 * 60 * 9).toString(), // TODO: standardize date format across the board
    fileName: 'Project_seed3.jpg',
    containerFileName: 'Project_seed3.jpg',
    userId: 'aaaaaaaa-aaaa-aaaa-gggg-aaaaaaaaaaaa',
    uploader: 'LeoDMF',
    fileSize: '233 KB',
    isDeleted: false,
    container: 'edroplets-files',
    fileType: 'image',
    isPublic: true,
  },
  {
    id: 5,
    projectId: 6,
    uploadTime: new Date(Date.now() - 1000 * 60 * 60 * 9).toString(), // TODO: standardize date format across the board
    fileName: 'Project_seed4.jpg',
    containerFileName: 'Project_seed4.jpg',
    userId: 'aaaaaaaa-aaaa-aaaa-hhhh-aaaaaaaaaaaa',
    uploader: 'EWODisFun',
    fileSize: '337 KB',
    isDeleted: false,
    container: 'edroplets-files',
    fileType: 'image',
    isPublic: true,
  },
  {
    id: 6,
    projectId: 7,
    uploadTime: new Date(Date.now() - 1000 * 60 * 60 * 9).toString(), // TODO: standardize date format across the board
    fileName: 'Project_seed5.jpg',
    containerFileName: 'Project_seed5.jpg',
    userId: 'aaaaaaaa-aaaa-aaaa-iiii-aaaaaaaaaaaa',
    uploader: 'Mark',
    fileSize: '369 KB',
    isDeleted: false,
    container: 'edroplets-files',
    fileType: 'image',
    isPublic: true,
  }
];