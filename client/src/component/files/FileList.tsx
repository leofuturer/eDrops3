import { ROLES } from '@/lib/constants/roles';
import { useCookies } from 'react-cookie';
import { DTO, FileInfo } from '@/types';
import { padZeroes } from '@/lib/time';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, idRoute } from '@/router/routes';
import { api } from '@/api';
import DeleteModal from '../modal/DeleteModal';
import { ArrowDownTrayIcon, ShoppingCartIcon, TrashIcon } from '@heroicons/react/24/solid';

export function FileList({ fileList, handleDelete }: { fileList: DTO<FileInfo>[], handleDelete: (deleteId: number) => void }) {
  const [cookies] = useCookies(['userType', 'userId'])
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(0);

  const navigate = useNavigate();

  function handleDownload(fileId: number) {
    switch (cookies.userType) {
      case ROLES.Customer:
        // for customer, `id` is file ID
        api.customer.downloadFile(cookies.userId, fileId, true);
        break;
      case ROLES.Worker:
        // for worker, `id` is chipOrder ID (associated with that file)
        // api.worker.downloadFile(cookies.userId, fileId);
        break;
      case ROLES.Admin:
        // for admin, `id` is file ID
        api.file.download(fileId);
    }
  }

  // Customer only
  function handleShop(fileId: number) {
    navigate(idRoute(ROUTES.ChipFab, fileId));
  }

  return (
    <>
      <table className="table-info">
        <thead className="">
          <tr className="border-b-2">
            <th className="">Upload Time</th>
            <th className="">File Name</th>
            {
              cookies.userType !== ROLES.Customer &&
              <th>Uploader</th>
            }
            <th className="">Size</th>
            <th className="">Download</th>
            {
              cookies.userType === ROLES.Customer
              && <>
                <th className="">Foundry Service</th>
                <th className="">Delete</th>
              </>
            }
          </tr>
        </thead>
        <tbody>
          {fileList && fileList.length > 0 ? fileList.map((file, index) => (
            <tr key={file.id}>
              <td className="">{padZeroes(file.uploadTime)}</td>
              <td className="">{file.fileName}</td>
              {cookies.userType !== ROLES.Customer && <td className="">{file.uploader}</td>}
              <td className="">{file.fileSize}</td>
              <td className="">
                <ArrowDownTrayIcon className="w-5 cursor-pointer mx-auto" onClick={() => handleDownload(file.id as number)} />
              </td>
              {cookies.userType === ROLES.Customer &&
                <>
                  <td className="">
                    <ShoppingCartIcon className="w-5 cursor-pointer mx-auto" onClick={() => handleShop(file.id as number)} />
                  </td>
                  <td className="">
                    <TrashIcon className="w-5 cursor-pointer mx-auto" onClick={() => { setDeleteId(file.id as number); setShowDelete(true) }} />
                  </td>
                </>}
            </tr>
          )) : (
            <tr>
              <td className="" colSpan={9}>No files have been uploaded.</td>
            </tr>
          )}
        </tbody>
      </table>
      {showDelete &&
        <DeleteModal handleHide={() => setShowDelete(false)} handleDelete={() => handleDelete(deleteId)} />
      }
    </>
  )
}

export default FileList