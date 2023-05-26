import { ROLES } from '@/lib/constants/roles';
import { useCookies } from 'react-cookie';
import { DTO, FileInfo } from '@/types';
import { padZeroes } from '@/lib/time';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, idRoute } from '@/router/routes';
import { api } from '@/api';
import DeleteModal from '../modal/DeleteModal';

export function FileList({ fileList }: { fileList: DTO<FileInfo>[] }) {
  const [displayList, setDisplayList] = useState<DTO<FileInfo>[]>(fileList);
  const [cookies] = useCookies(['userType', 'userId'])
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(0);

  const navigate = useNavigate();

  function handleDownload(fileId: number) {
    switch (cookies.userType) {
      case ROLES.Customer:
        // for customer, `id` is file ID
        api.customer.downloadFile(cookies.userId, fileId);
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

  // Customer only
  function handleDelete() {
    api.customer.deleteFile(cookies.userId, deleteId).then((res) => {
      setDisplayList(displayList.filter((file) => file.id !== deleteId));
      setShowDelete(false);
    }).catch((err) => {
      console.error(err);
    });
  }

  return (
    <>
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
          {displayList && displayList.length > 0 ? displayList.map((file, index) => (
            <tr key={file.id}>
              <td className="p-2">{padZeroes(file.uploadTime)}</td>
              <td className="p-2">{file.fileName}</td>
              {cookies.userType !== ROLES.Customer && <td className="p-2">{file.uploader}</td>}
              <td className="p-2">{file.fileSize}</td>
              <td className="p-2">
                <i className="fa fa-download cursor-pointer" onClick={() => handleDownload(file.id as number)} />
              </td>
              {cookies.userType === ROLES.Customer &&
                <>
                  <td className="p-2">
                    <i className="fa fa-cart-plus cursor-pointer" onClick={() => handleShop(file.id as number)} />
                  </td>
                  <td className="p-2">
                    <i className="fa fa-trash cursor-pointer" onClick={() => { setDeleteId(file.id as number); setShowDelete(true) }} />
                  </td>
                </>}
            </tr>
          )) : (
            <tr>
              <td className="p-2" colSpan={9}>No files have been uploaded.</td>
            </tr>
          )}
        </tbody>
      </table>
      {showDelete &&
        <DeleteModal handleHide={() => setShowDelete(false)} handleDelete={handleDelete} />
      }
    </>
  )
}

export default FileList