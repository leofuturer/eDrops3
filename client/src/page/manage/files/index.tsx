import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { api } from '@/api';
import SEO from '@/component/header/seo';
import ManageRightLayout from '@/component/layout/ManageRightLayout';
import DeleteModal from '@/component/modal/DeleteModal';
import { FileInfo } from '@/types';
import { padZeroes } from '@/lib/time';
import { metadata } from './metadata';
import { ROLES } from '@/lib/constants/roles';
import { ROUTES } from '@/router/routes';

export function Files() {
  const [fileList, setFileList] = useState<FileInfo[]>([]);

  const [custId, setCustId] = useState(0);
  const [isCustomer, setIsCustomer] = useState(false);
  const [username, setUsername] = useState('');
  const [deleteId, setDeleteId] = useState(0);
  const [showDelete, setShowDelete] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const [cookies] = useCookies(['userId', 'userType', 'access_token']);

  // Get user id param from url if exists
  if (cookies.userType === ROLES.Admin) {
    const { id } = useParams();
    if (!id) {
      // Admin is viewing files with no customer id path param
      if (location.pathname === ROUTES.ManageFiles) {

      }
    }
  }

  useEffect(() => {
    // Extra state if admin is retrieving files for a particular customer
    if (location.pathname === '/manage/admin-retrieve-user-files'
      && cookies.userType === ROLES.Admin) {
      setCustId(location.state.userId)
      setIsCustomer(location.state.isCustomer);
      setUsername(location.state.username);
    }
  }, [location.pathname, cookies.userType])


  useEffect(() => {
    // Customer retrieving their files
    let url = '';
    if (location.pathname === '/manage/files' && cookies.userType !== ROLES.Admin) {
      // if customer, can see their files
      // foundry workers might use this API path too (not sure)
      url = `${customerFileRetrieve.replace('id', cookies.userId)}?filter={"where":{"isDeleted":false}}`;
    }
    // Admin retrieves files for particular customer
    else if (location.pathname === '/manage/admin-retrieve-user-files'
      && cookies.userType === ROLES.Admin
      && location.state.isCustomer) {
      // get files for either foundry worker or user
      url = customerFileRetrieve.replace('id', location.state.userId);
    }

    request(url, 'GET', {}, true)
      .then((res) => {
        setFileList(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [location.pathname, cookies.userType, cookies.userId]);

  function handleDownload(id: number) {
    let url = '';
    if (location.pathname === '/manage/files' && cookies.userType !== ROLES.Admin) {
      // customer downloads a file
      url = `${downloadFileById.replace('id', cookies.userId)}?access_token=${cookies.access_token}&fileId=${id}`;
    }
    // Admin retrieves files for particular customer
    else if (location.pathname === '/manage/admin-retrieve-user-files' && cookies.userType === ROLES.Admin && location.state.isCustomer) {
      url = `${adminDownloadFile}?access_token=${cookies.access_token}&fileId=${id}`;
    }
    window.location.href = url;
  }

  function handleShop(file: FileInfo) {
    navigate(ROUTES.ChipFab, { state: { fileInfo: file } });
  }

  function handleDelete() {
    const fileId = deleteId;
    const url = `${customerDeleteFile.replace('id', cookies.userId)}?fileId=${fileId}`;
    request(url, 'DELETE', {}, true)
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
        title="eDroplets | Files"
        description=""
        metadata={metadata}
      />
      <table className="table-info">
        <thead className="">
          <tr className="border-b-2">
            <th className="p-2">Upload Time</th>
            <th className="p-2">File Name</th>
            {
              cookies.userType !== ROLES.Customer &&
              <th>Uploader</th>
            }
            <th className="p-2">Size</th>
            <th className="p-2">Download</th>
            {
              cookies.userType === ROLES.Customer
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
              {cookies.userType !== ROLES.Customer && <td className="p-2">{file.uploader}</td>}
              <td className="p-2">{file.fileSize}</td>
              <td className="p-2">
                <i className="fa fa-download cursor-pointer" onClick={() => handleDownload(file.id)} />
              </td>
              {cookies.userType === ROLES.Customer &&
                <>
                  <td className="p-2">
                    <i className="fa fa-cart-plus cursor-pointer" onClick={() => handleShop(file)} />
                  </td>
                  <td className="p-2">
                    <i className="fa fa-trash cursor-pointer" onClick={() => { setDeleteId(file.id); setShowDelete(true) }} />
                  </td>
                </>}
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
          )) : (
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