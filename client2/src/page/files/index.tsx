import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import $ from 'jquery';

import API from '../../api/api';
import {
  customerFileRetrieve,
  customerDeleteFile,
  downloadFileById,
  adminDownloadFile,
} from '../../api/serverConfig';

import './index.css';
import SEO from '../../component/header/SEO.js';
import { metadata } from './metadata';
import DeleteModal from '../../component/modal/DeleteModal.js';
import { padZeroes } from '../../utils/time';
import { useCookies } from 'react-cookie';

function Files() {
  const [fileList, setFileList] = useState([]);
  const [fileId, setFileId] = useState(-1);

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

  function handleDownload(e) {
    let url = '';
    if (location.pathname === '/manage/files' && cookies.userType !== 'admin') {
      // customer downloads a file
      url = `${downloadFileById.replace('id', cookies.userId)}?access_token=${cookies.access_token}&fileId=${e.target.id}`;
      window.location = url;
    }
    // Admin retrieves files for particular customer
    else if (location.pathname === '/manage/admin-retrieve-user-files'
      && Cookies.get('userType') === 'admin'
      && location.state.isCustomer) {
      url = `${adminDownloadFile}?access_token=${cookies.access_token}&fileId=${e.target.id}`;
      window.location = url;
    }
  }

  function handleShop(e) {
    const fileId = Number(e.target.parentNode.parentNode.id.replace(/[^0-9]/ig, ''));
    let i;
    let file;
    for (i = 0; i < fileList.length; i++) {
      if (fileId === fileList[i].id) {
        file = fileList[i].id;
        navigate('/chipfab', { state: { fileInfo: fileList[i] } });
      }
    }
  }

  function handleDelete() {
    const fileId = deleteId;
    const url = `${customerDeleteFile.replace('id', cookies.userId)}?fileId=${fileId}`;
    const fileInfoRowId = `fileInfoRow${fileId}`;
    API.Request(url, 'DELETE', {}, true)
      .then((res) => {
        if (document.getElementById(fileInfoRowId)) {
          document.getElementById(fileInfoRowId).remove();
        } else {
          console.error('The element does not exist!');
        }
      })
      .then((res) => {
        setShowDelete(false);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <SEO
        title="eDrops | Files"
        description=""
        metadata={metadata}
      />
      <div className="w-full border-b-2 border-primary_light flex justify-center py-8">
        {location.pathname === '/manage/admin-retrieve-user-files'
          ? <h2 className="text-2xl">Files for {username}</h2>
          : <h2 className="text-2xl">Files</h2>}
      </div>
      <div className="w-full py-8">
        <table className="rounded-md shadow-box w-full border-collapse table-auto">
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
            {fileList
              ? fileList.map((item, index) => (
                <tr key={item.id}>
                  <td className="p-2">{padZeroes(item.uploadTime)}</td>
                  <td className="p-2">{item.fileName}</td>
                  {
                    Cookies.get('userType') !== 'customer' &&
                    <td className="p-2">{item.uploader}</td>
                  }
                  <td className="p-2">{item.fileSize}</td>
                  {/*
                        Cookies.get('userType') === "customer"
                        ? null
                        : (<td>
                            <a onClick={this.showUserDropdown} style={{cursor: 'pointer'}}>{item.uploader}</a>
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
                            <a onClick={this.showUserDropdown} style={{cursor: 'pointer'}}>{item.avtoworkerName}</a>
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
                    <i className="fa fa-download" onClick={handleDownload} />
                  </td>
                  {
                    Cookies.get('userType') === 'customer' &&
                    <>
                      <td className="p-2">
                        <i className="fa fa-cart-plus" onClick={handleShop} />
                      </td>
                      <td className="p-2">
                        <i className="fa fa-trash" data-toggle="modal" data-target="#deleteModal" onClick={() => setDeleteId(item.id)} />
                      </td>
                    </>
                  }
                  {/*
                        Cookies.get('userType') === "worker"
                        ?
                          (
                          <td className="worker-edit-status">
                          {
                              <a onClick={this.showDropdown} style={{cursor: 'pointer'}}>{item.status}</a>
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
                                  <input type="hidden" name="fileId" value={item.id}></input>
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
      </div>
      {showDelete &&
        <DeleteModal handleHide={() => setShowDelete(false)} handleDelete={handleDelete} />
      }
    </div>
  );
}

export default Files;
