import SEO from '@/component/header/seo';
import TwoChoiceModal from '@/component/modal/TwoChoiceModal';
import { ROUTES, idRoute } from '@/router/routes';
import { DTO, FileInfo, api } from '@edroplets/api';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { FileRejection, useDropzone } from 'react-dropzone';
import { redirect, useNavigate } from 'react-router-dom';
import { metadata } from './metadata';

function Upload() {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [fileInfo, setFileInfo] = useState<DTO<FileInfo>>({} as DTO<FileInfo>);
  const [originalName, setOriginalName] = useState('');
  const [progress, setProgress] = useState(0);

  type p = 'private' | 'public';
  type u = 'mm' | 'cm' | 'in';
  const pTypes: p[] = ['private', 'public'];
  const uTypes: u[] = ['mm', 'cm', 'in'];
  const [pType, setPType] = useState<p>('private');
  const [uType, setUType] = useState<u>('mm');
  const [checked, setChecked] = useState(false);

  const [showUpload, setShowUpload] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const [cookies, setCookie, removeCookie] = useCookies(['userId']);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted(files, event) {
      onFileAccept(files);
    },
    onDropRejected(fileRejections, event) {
      onFileReject(fileRejections);
    },
    accept: {
      "application/dxf": ['.dxf']
    },
    maxFiles: 1,
    maxSize: 30 * 1000 * 1000, // file size limit in bytes (30 MB)
    multiple: false,
  })

  function onFileAccept(acceptedFiles: File[]) {
    // console.log(acceptedFiles);
    setFile(acceptedFiles[0]);
  }

  function onFileReject(rejectedFiles: FileRejection[]) {
    rejectedFiles.map((rejFile) => {
      rejFile.errors.map((err) => {
        alert(`Upload error:\nFor file ${rejFile.file.name}: ${err.message}`);
      });
    });
  }

  function onFileUpload() {
    file && api.customer.getFiles(cookies.userId).then((files) => {
      // console.log(res);
      const noDuplicate = files.every((f: DTO<FileInfo>) => !(f.fileName === file.name && !f.isDeleted && !checked));
      noDuplicate ? handleFileUpload({
        isPublic: pType,
        unit: uType,
      }) : setShowConfirm(true);
    }).catch((err) => {
      console.error(err);
    });
  }

  useEffect(() => {
    if (progress > 100) {
      setTimeout(() => {
        setProgress(0);
        setShowUpload(true);
      }, 1000);
    }
  }, [progress])

  function handleFileUpload(extraFields: object) {
    for (let i = 0; i <= 70; i += 1) {
      setTimeout(() => {
        setProgress(i);
      }, i * 10);
    }
    const formData = new FormData();
    formData.append('www', file as File);
    formData.append('fields', JSON.stringify(extraFields));
    api.customer.uploadFile(cookies.userId, formData).then((fileInfo) => {
      // console.log(res);
      setShowConfirm(false);
      setFileInfo(fileInfo);
      for (let i = 70; i <= 101; i += 1) {
        if (i <= 100) {
          setTimeout(() => {
            setProgress(i)
          }, 10 * i);
        } else {
          setTimeout(() => {
            setProgress(101);
          }, 10 * i + 1000);
        }
      }
    }).catch((err) => {
      console.error(err);
    });
  }

  function handleShopping() {
    setShowUpload(false);
    navigate(idRoute(ROUTES.ChipFab, fileInfo.id as number));
  }

  function handleLibrary() {
    navigate(ROUTES.ManageFiles);
  }

  function handleRename() {
    const ind = originalName.lastIndexOf('.');
    const oriname = originalName;
    setChecked(true);
    const date = new Date().toISOString().replace(/[^a-zA-Z0-9 ]/g, '');
    handleFileUpload({
      isPublic: pType,
      unit: uType,
      newName: `${oriname.slice(0, ind)}(${date})${oriname.slice(ind)}`,
    });
  }

  function handleCancel() {
    setShowConfirm(false);
  }

  useEffect(() => {
    if (!cookies.userId) {
      redirect('/login');
    }
  }, [cookies.userId])

  const ptypeList = pTypes.map((p, i) => {
    return (
      <div
        key={i}
        className={`${pType === p && 'bg-primary_light text-white'} border py-2 w-full text-center cursor-pointer`}
        onClick={() => setPType(p)}
      >
        {p}
      </div>
    );
  })

  const utypeList = uTypes.map((u, i) => {
    return (
      <div
        key={i}
        className={`${uType === u && 'bg-primary_light text-white'} border py-2 w-full text-center cursor-pointer`}
        onClick={() => setUType(u)}
      >
        {u}
      </div>
    );
  })

  return (
    <div className="flex flex-col items-center">
      <SEO
        title="eDroplets | Upload"
        description=""
        metadata={metadata}
      />
      <div className="w-2/3 text-center flex flex-col items-center space-y-4 py-10">
        <h1 className="text-4xl">File Upload</h1>
        {/* <div className="grid grid-cols-2 justify-items-center gap-8 w-full">
          <div className="flex flex-col space-y-2 w-full max-w-sm">
            <h4 className="text-lg">Visibility</h4>
            <div className="grid grid-cols-2 gap-4 text-sm w-full">
              {ptypeList}
            </div>
            <div className="flex flex-row space-x-2 justify-center items-center">
              <input type="checkbox" id="copyLink" className="" />
              <label htmlFor="copyLink" className="text-sm">Let people copy this design with a link</label>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-2 w-full max-w-sm">
            <h4 className="text-lg">Units</h4>
            <div className="grid grid-cols-3 gap-4 text-sm w-full">
              {utypeList}
            </div>
          </div>
        </div> */}
        <div {...getRootProps({
          className: 'border-2 border-dashed border-black cursor-pointer w-full px-10 py-24',
        })}>
          <input {...getInputProps()} />
          {progress > 0 ? (
            <div className="progressContainer">
              <h3>{progress < 101 ? 'Uploading...' : 'Completed!'}</h3>
              <div className="uploadProgressBar">
                <Progress now={progress} />
              </div>
            </div>
          )
            : (
              <div className="">
                <p className="text-xl">
                  Drag and drop file here, or click to select file
                </p>
                <p className="text-sm text-gray-500">File types accepted: .dxf</p>
                {file && <p>{file.name}</p>}
              </div>
            )}
        </div>
        {file !== undefined &&
          <button type="button" className="bg-secondary rounded-md py-4 px-8 text-white text-xl w-max" onClick={onFileUpload} >
            Upload File
          </button>}
      </div>
      {showUpload && <TwoChoiceModal
        content="The file has been uploaded to your library successfully!"
        affirmativeText="Proceed to fabrication"
        negativeText="Go to file library"
        handleAffirmative={handleShopping}
        handleNegative={handleLibrary} />
      }
      {showConfirm && <TwoChoiceModal
        content="Duplicate file name. Would you like to upload another file or continue uploading this file? (It would be advisable to change the file name to avoid confusion)."
        affirmativeText="Upload this file"
        negativeText="Change file"
        handleAffirmative={handleRename}
        handleNegative={handleCancel} />
      }
    </div>
  );
}

export default Upload;

function Progress({ now }: { now: number }) {
  return (
    // TODO: work on progress bar CSS
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div
        className={`h-2.5 rounded-full ${now < 100 ? `bg-blue-600 w-[${now}%]` : 'bg-green-500 w-full'}`} />
    </div>
  );
};