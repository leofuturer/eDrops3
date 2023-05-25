import { ROLES } from '@/lib/constants/roles';
import { useCookies } from 'react-cookie';
import { DTO, FileInfo } from '@/types';
import { padZeroes } from '@/lib/time';

function FileList({ fileList }: { fileList: DTO<FileInfo>[] }) {
  const [cookies] = useCookies(['userType'])

  return (
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
          </tr>
        )) : (
          <tr>
            <td className="p-2">No files have been uploaded.</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

export default FileList