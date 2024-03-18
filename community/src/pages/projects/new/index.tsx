import { Project, ProjectFile, api } from '@edroplets/api';
import {
  LinkIcon,
  PaperClipIcon,
  PhotoIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ImageUpload from '@/components/project/ImageUpload';
import FileUpload from '@/components/project/FileUpload';
import AddLink from '@/components/project/AddLink';

export function NewProject() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [modalType, setModalType] = useState<typeof ProjectFile.prototype.fileType | 'link'>('attachment');
  const [showModal, setShowModal] = useState(false);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [links, setLinks] = useState<string[]>([]);
  const [cookies] = useCookies(['userId']);
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('edit')) {
      console.log("editing");
      const idStr = searchParams.get('id');
      if (idStr == null) {
        navigate('/forum/new');
        return;
      }
      const id = parseInt(idStr);
      api.project.get(id).then((res) => {
        if (cookies.userId !== res.userId) {
          navigate('/forum');
          return;
        }
        setContent(res.content);
        setTitle(res.title);
      });
    }
  }, []);

  useEffect(() => {
    if (!cookies.userId) {
      navigate('/login');
    }
  }, [cookies.userId]);

  function handlePost() {
    const data: Partial<Project> = {
      title,
      content,
      author: '',
      datetime: new Date(),
      likes: 0,
      comments: 0,
      // dislikes: 0,
    };

    if (searchParams.get('edit')) {
      // request a PATCH endpoint for project (not created yet)
      navigate(`/project/${searchParams.get('id')}`);
      return;
    }

    // console.log(data);
    api.user.createProject(cookies.userId as string, data).then(async (res) => {
      // console.log(res);
      // Link ProjectFile instances to Project
      const projectId = res.id;
      const filePromises = files.map((file) => {
        api.project.linkProjectFile(cookies.userId as string, projectId as number, file.id as number);
      });
      await Promise.all(filePromises);
      // Add links to Project using ProjectLink
      const linkPromises = links.map((link) => {
        api.project.addProjectLink(projectId as number, link);
      });
      await Promise.all(linkPromises);
      // Navigate to project page
      navigate(`/project/${res.id}`);
    })
      .catch((err: AxiosError) => {
        if (err.response?.status === 401) {
          navigate('/login');
        }
        console.log(err);
      });
  }

  function handleImage() {
    setModalType('image');
    setShowModal(true);
  }

  function handleVideo() { }

  // Since the project hasn't been created yet, we should upload the files, then link them to the project after creation?
  function handleFile() {
    setModalType('attachment');
    setShowModal(true);
  }

  function handleAddFiles(newFiles: ProjectFile[]) {
    // console.log(newFiles)
    const union = [...new Set([...files, ...newFiles])];
    // const union = [...files, ...newFiles];
    setFiles(union);
  }

  function handleLink() {
    setModalType('link');
    setShowModal(true);
  }

  function handleAddLinks(newLinks: string[]) {
    const union = [...new Set([...links, ...newLinks])];
    setLinks(union);
  }

  function handleDownload(file: ProjectFile) {
    api.projectFile.download(file.id as number);
  }

  return (
    <>
      <section className="bg-slate-200 h-[calc(100vh-80px)] py-20 px-40 grid grid-rows-4 space-y-4">
        <div className="flex flex-col space-y-4 row-span-3">
          <input
            type="text"
            value={title}
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            className="p-2 rounded-lg shadow-lg"
          />
          <textarea
            placeholder="Description"
            value={content}
            className="p-2 rounded-lg shadow-lg resize-none h-full"
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <ul className="flex flex-col space-y-4 min-h-fit py-4 max-h-40 pr-4 overflow-y-auto">
          {files.map((file) => (
            <li
              className="bg-white rounded-lg flex flex-row justify-between p-2"
              key={file.id}
            >
              <div
                className="flex flex-row space-x-2 cursor-pointer"
                onClick={() => handleDownload(file)}
              >
                <PaperClipIcon className="h-6 w-6" />
                <p>{file.fileName}</p>
              </div>
              <XMarkIcon
                className="h-6 w-6 cursor-pointer"
                onClick={() => setFiles(files.filter((f) => f !== file))}
              />
            </li>
          ))}
          {links.map((link) => (
            <li
              className="bg-white rounded-lg flex flex-row justify-between p-2"
              key={link}
            >
              <div className="flex flex-row space-x-2 cursor-pointer">
                <LinkIcon className="h-6 w-6" />
                <a
                  href={link}
                  className="text-sky-700"
                  target="_blank"
                  rel="noreferrer"
                >
                  {link}
                </a>
              </div>
              <XMarkIcon
                className="h-6 w-6 cursor-pointer"
                onClick={() => setLinks(links.filter((l) => l !== link))}
              />
            </li>
          ))}
        </ul>
        <div className="grid grid-cols-6 gap-2">
          <button
            type="button"
            className="bg-slate-400 text-black rounded-lg shadow-lg flex flex-row space-x-2 justify-center items-center p-4"
            onClick={handleImage}
          >
            <PhotoIcon className="h-6 w-6" />
            <p>Image</p>
          </button>
          {/* <button
						type="button"
						className="bg-slate-400 text-black rounded-lg shadow-lg flex flex-row space-x-2 justify-center items-center p-4"
						onClick={handleVideo}
					>
						<VideoCameraIcon className="h-6 w-6" />
						<p>Video</p>
					</button> */}
          <button
            type="button"
            className="bg-slate-400 text-black rounded-lg shadow-lg flex flex-row space-x-2 justify-center items-center p-4"
            onClick={handleFile}
          >
            <PaperClipIcon className="h-6 w-6" />
            <p>File</p>
          </button>
          <button
            type="button"
            className="bg-slate-400 text-black rounded-lg shadow-lg flex flex-row space-x-2 justify-center items-center p-4"
            onClick={handleLink}
          >
            <LinkIcon className="h-6 w-6" />
            <p>Link</p>
          </button>
          <button
            type="button"
            className="bg-sky-800 text-white font-semibold rounded-lg shadow-lg flex flex-row justify-center items-center p-4 col-end-7 col-span-1"
            onClick={handlePost}
          >
            Post
          </button>
        </div>
      </section>
      {showModal && (
      <div
        id="modal"
        className="absolute inset-0 bg-slate-900 bg-opacity-50 z-40 flex items-center justify-center"
        onClick={() => setShowModal(false)}
      >
        <div className="z-50 min-h-1/2 w-1/2 bg-slate-200 rounded-xl flex flex-col space-y-2 p-4 text-slate-400" onClick={(e) => e.stopPropagation()}>
          {modalType === 'attachment' && (
          <FileUpload
            handleClose={() => setShowModal(false)}
            addFiles={(files) => handleAddFiles(files)}
          />
          )}
          {modalType === 'link' && (
          <AddLink
            handleClose={() => setShowModal(false)}
            addLinks={(links) => handleAddLinks(links)}
          />
          )}
          {modalType === 'image' && (
          <ImageUpload
            handleClose={() => setShowModal(false)}
            addFiles={(files) => handleAddFiles(files)}
          />
          )}
        </div>
      </div>
      )}
    </>
  );
}

export default NewProject;
