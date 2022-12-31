import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../../api/lib/api';
import {
  adminDownloadFile, customerDeleteFile, customerFileRetrieve, downloadFileById
} from '../../api/lib/serverConfig';
import SEO from '../../component/header/seo';
import ManageRightLayout from '../../component/layout/ManageRightLayout';
import DeleteModal from '../../component/modal/DeleteModal.js';
import { FileInfo } from '../../types';
import { padZeroes } from '../../utils/time';
import { metadata } from './metadata';

function Files() {
  const [fileList, setFileList] = useState<FileInfo[]>([]);

  const [custId, setCustId] = useState(0);
  const [isCustomer, setIsCustomer] = useState(false);
  const [username, setUsername] = useState('');
  const [deleteId, setDeleteId] = useState(0);
  const [showDelete, setShowDelete] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const [cookies] = useCookies(['userId', 'userType', 'access_token']);

  useEffect(() => {
    // Extra state if admin is retrieving files for a particular customer
    if (location.pathname === '/manage/admin-retrieve-user-files'
      && cookies.userType === 'admin') {
      setCustId(location.state.userId)
      setIsCustomer(location.state.isCustomer);
      setUsername(location.state.username);
    }
  }, [location.pathname, cookies.userType])


  useEffect(() => {
    // Customer retrieving their files
    let url = '';
    if (location.pathname === '/manage/files' && cookies.userType !== 'admin') {
      // if customer, can see their files
      // foundry workers might use this API path too (not sure)
      url = `${customerFileRetrieve.replace('id', cookies.userId)}?filter={"where":{"isDeleted":false}}`;
    }
    // Admin retrieves files for particular customer
    else if (location.pathname === '/manage/admin-retrieve-user-files'
      && cookies.userType === 'admin'
      && location.state.isCustomer) {
      // get files for either foundry worker or user
      url = customerFileRetrieve.replace('id', location.state.userId);
    }

    API.Request(url, 'GET', {}, true)
      .then((res) => {
        setFileList(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [location.pathname, cookies.userType, cookies.userId]);

  function handleDownload(id: number) {
    let url = '';
    if (location.pathname === '/manage/files' && cookies.userType !== 'admin') {
      // customer downloads a file
      url = `${downloadFileById.replace('id', cookies.userId)}?access_token=${cookies.access_token}&fileId=${id}`;
    }
    // Admin retrieves files for particular customer
    else if (location.pathname === '/manage/admin-retrieve-user-files' && cookies.userType === 'admin' && location.state.isCustomer) {
      url = `${adminDownloadFile}?access_token=${cookies.access_token}&fileId=${id}`;
    }
    window.location.href = url;
  }

  function handleShop(file: FileInfo) {
    navigate('/chipfab', { state: { fileInfo: file } });
  }

  function handleDelete() {
    const fileId = deleteId;
    const url = `${customerDeleteFile.replace('id', cookies.userId)}?fileId=${fileId}`;
    API.Request(url, 'DELETE', {}, true)
      .then((res) => {
        setFileList(fileList.filter((file) => file.id !== fileId));
      })
      .then((res) => {
        setShowDelete(false);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <ManageRightLayout title={location.pathname === '/manage/admin-retrieve-user-files'
      ? `Files for ${username}` : 'Files'}>
      <SEO
        title="eDrops | Files"
        description=""
        metadata={metadata}
      />
      <table className="table-info">
        <thead className="">
          <tr className="border-b-2">
            <th className="p-2">Upload Time</th>
            <th className="p-2">File Name</th>
            {
              cookies.userType !== 'customer' &&
              <th>Uploader</th>
            }
            <th className="p-2">Size</th>
            <th className="p-2">Download</th>
            {
              cookies.userType === 'customer'
              && <>
                <th className="p-2">Foundry Service</th>
                <th className="p-2">Delete</th>
              </>
            }
          </tr>
        </thead>
        <tbody>
          {fileList ? fileList.map((file, index) => (
            <tr key={file.id}>
              <td className="p-2">{padZeroes(file.uploadTime)}</td>
              <td className="p-2">{file.fileName}</td>
              {
                Cookies.get('userType') !== 'customer' &&
                <td className="p-2">{file.uploader}</td>
              }
              <td className="p-2">{file.fileSize}</td>
              {/*
                        Cookies.get('userType') === "customer"
                        ? null
                        : (<td>
                            <a onClick={this.showUserDropdown} style={{cursor: 'pointer'}}>{file.uploader}</a>
                            <div style={{display: "none"}} className="customer-div-drownup">
                                <ul className="customer-list-styled">
                                    <li>{userInfo.username}</li>
                                    <li>{userInfo.address}</li>
                                    <li>{userInfo.email}</li>
                                </ul>
                            </div>
                        </td>)
                      */
              }
              {/*
                        Cookies.get('userType') === "worker"
                        ? null
                        : (<td>
                            <a onClick={this.showUserDropdown} style={{cursor: 'pointer'}}>{file.avtoworkerName}</a>
                            <div style={{display: "none"}} className="customer-div-drownup">
                                <ul className="customer-list-styled">
                                    <li>{userInfo.username}</li>
                                    <li>{userInfo.address}</li>
                                    <li>{userInfo.email}</li>
                                </ul>
                            </div>
                          </td>)
                      */
              }
              <td className="p-2">
                <i className="fa fa-download cursor-pointer" onClick={() => handleDownload(file.id)} />
              </td>
              {
                Cookies.get('userType') === 'customer' &&
                <>
                  <td className="p-2">
                    <i className="fa fa-cart-plus cursor-pointer" onClick={() => handleShop(file)} />
                  </td>
                  <td className="p-2">
                    <i className="fa fa-trash cursor-pointer" onClick={() => { setDeleteId(file.id); setShowDelete(true) }} />
                  </td>
                </>
              }
              {/*
                        Cookies.get('userType') === "worker"
                        ?
                          (
                          <td className="worker-edit-status">
                          {
                              <a onClick={this.showDropdown} style={{cursor: 'pointer'}}>{file.status}</a>
                              <div style={{display: "none"}} className="file-div-drownup">
                                  <ul className="file-list-styled">
                                      <li>Unassigned to Foundry</li>
                                      <li>Assigned to Foundry</li>
                                      <li>Project Started</li>
                                      <li>Project Completed</li>
                                  </ul>
                              </div>
                          }
                              <form className="edit-status-form" method="POST" action={editFileStatus}>
                                  <select name="status" >
                                      <option value="Unassigned to Foundry">Unassigned to Foundry</option>
                                      <option value="Assigned to Foundry">Assigned to Foundry</option>
                                      <option value="Project Started">Project Started</option>
                                      <option value="Project Completed">Project Completed</option>
                                  </select>
                                  <input type="hidden" name="fileId" value={file.id}></input>
                                  <input type="submit" value="Submit Status" ></input>
                              </form>
                          </td>)
                        :
                        null
                        */
              }
            </tr>
          ))
            : (
              <tr>
                <td className="p-2">No files have been uploaded.</td>
              </tr>
            )}
        </tbody>
      </table>
      {showDelete &&
        <DeleteModal handleHide={() => setShowDelete(false)} handleDelete={handleDelete} />
      }
    </ManageRightLayout>
  );
}

export default Files;
