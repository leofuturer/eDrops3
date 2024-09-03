import { api, FileInfo, DTO } from '@edroplets/api';
import FileList from '@/component/files/FileList';
import SEO from '@/component/header/seo';
import ManageRightLayout from '@/component/layout/ManageRightLayout';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { metadata } from './metadata';

export function Files() {
  const [fileList, setFileList] = useState<DTO<FileInfo>[]>([]);

  const [cookies] = useCookies(['userId', 'userType', 'access_token']);

  function handleDelete(deleteId: number) {
    return api.customer.deleteFile(cookies.userId, deleteId).then((res) => {
      setFileList(fileList.filter((file) => file.id !== deleteId));
    }).catch((err) => {
      console.error(err);
    });
  }

  useEffect(() => {
    api.customer.getFiles(cookies.userId)
      .then((files) => {
        setFileList(files);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [cookies.userType, cookies.userId]);

  return (
    <ManageRightLayout title={'Files'}>
      <SEO
        title="eDroplets | Files"
        description=""
        metadata={metadata}
      />
      <FileList fileList={fileList} handleDelete={handleDelete} />
    </ManageRightLayout>
  );
}