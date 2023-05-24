import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { api } from '@/api';
import ManageRightLayout from '../../../component/layout/ManageRightLayout';
import { DTO, FileInfo } from '../../../types';
import { idRoute } from '@/router/routes';

export function AllFiles() {
  const [fileList, setFileList] = useState<DTO<FileInfo>[]>([]);

  const [cookies] = useCookies(['access_token']);

  function handleDownload(file: FileInfo) {
    const fileId = file.id;
    const url = `${adminDownloadFile}?access_token=${cookies.access_token}&fileId=${file.id}`;
    // console.log(url);
    window.location.href = url;
  }

  useEffect(() => {
    api.file.getAll().then((files) => {
      setFileList(files);
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  return (
    <ManageRightLayout title="All Uploaded Files">
      <table className="table-info">
        <thead>
          <tr>
            <th>Upload Time</th>
            <th>File Name</th>
            <th>Uploader</th>
            <th>File Size</th>
            <th>Download</th>
            <th>Deleted</th>
          </tr>
        </thead>
        <tbody>
          {fileList.length !== 0 ? fileList.map((file, index) => (
            <tr key={index}>
              <td>{file.uploadTime}</td>
              <td>{file.fileName}</td>
              <td>{file.uploader}</td>
              <td>{file.fileSize}</td>
              <td>
                <i className="fa fa-download cursor-pointer" onClick={() => handleDownload(file)} />
              </td>
              <td>{file.isDeleted ? 'Yes' : 'No'}</td>
            </tr>
          ))
            : (
              <tr>
                <td>No files have been uploaded.</td>
              </tr>
            )}
        </tbody>
      </table>
    </ManageRightLayout>
  );
}

export default AllFiles;
