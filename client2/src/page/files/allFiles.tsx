import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getAllFileInfos, adminDownloadFile } from '../../api/serverConfig';
import API from '../../api/api';
import ManageRightLayout from '../../component/layout/ManageRightLayout';

function AllFiles() {
  const [fileList, setFileList] = useState([]);

  function handleDownload(e) {
    const file = this.state.fileList[e.target.parentNode.parentNode.id];
    const fileId = file.id;
    let url = adminDownloadFile;
    url += `?access_token=${Cookies.get('access_token')}&fileId=${fileId}`;
    // console.log(url);
    window.location = url;
  }

  useEffect(() => {
    const url = getAllFileInfos;
    const data = {};
    API.Request(url, 'GET', data, true)
      .then((res) => {
        setFileList(res.data);
      })
      .catch((err) => {
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
          {fileList.length !== 0 ? fileList.map((item, index) => (
            <tr key={index} id={index}>
              <td>{item.uploadTime}</td>
              <td>{item.fileName}</td>
              <td>{item.uploader}</td>
              <td>{item.fileSize}</td>
              <td>
                <i
                  className="fa fa-download"
                  onClick={handleDownload}
                />
              </td>
              <td>{item.isDeleted ? 'Yes' : 'No'}</td>
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
