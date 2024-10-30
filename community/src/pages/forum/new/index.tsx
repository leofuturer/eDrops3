import {
  api, Post as PostType
} from '@edroplets/api';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function NewForum() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [cookies] = useCookies(['userId']);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!cookies.userId) { navigate('/login'); }
  }, [cookies.userId]);

  useEffect(() => {
    if (searchParams.get('edit')) {
      const idStr = searchParams.get('id');
      if (idStr == null) {
        navigate('/forum/new');
        return;
      }
      const id = parseInt(idStr);
      api.post.get(id).then((res) => {
        if (cookies.userId !== res.userId) {
          navigate('/forum');
          return;
        }
        setContent(res.content);
        setTitle(res.title);
      });
    }
  }, []);

  function handlePost() {
    if (!cookies.userId) { navigate('/login'); return; }
    const createData: Partial<PostType> = {
      title,
      content,
      author: '',
      likes: 0,
      comments: 0,
      datetime: new Date(),
      // dislikes: 0,
    };
    const patchData: Partial<PostType> = {
      title,
      content,
    };
    // if editing, handle request differently (send to /edit endpoint or something)
    if (searchParams.get('edit')) {
      const id = searchParams.get('id');
      if (!id) return;
      api.user.editPost(cookies.userId, patchData, parseInt(id))
        .then((res) => navigate(`/forum/${id}`))
        .catch((err: AxiosError) => {
          if (err.response?.status === 401) {
            navigate('/login');
          }
          console.log(err);
        });
    }
    // console.log(data);
    else {
      api.user.createPost(cookies.userId, createData)
        .then((res) => navigate(`/forum/${res.id}`))
        .catch((err: AxiosError) => {
          if (err.response?.status === 401) {
            navigate('/login');
          }
          console.log(err);
        });
    }
  }

  // TODO: add post files? currently model doesn't exist in backend
  // function handleImage() {
  // 	setModalType("image");
  // 	setShowModal(true);
  // }

  // function handleVideo() { }

  // // Since the project hasn't been created yet, we should upload the files, then link them to the project after creation?
  // function handleFile() {
  // 	setModalType("attachment");
  // 	setShowModal(true);
  // }
  // function handleAddFiles(newFiles: PostFile[]) {
  // 	const union = [...new Set([...files, ...newFiles])];
  // 	setFiles(union);
  // }

  // function handleLink() {
  // 	setModalType("link");
  // 	setShowModal(true);
  // }

  // function handleAddLinks(newLinks: string[]) {
  // 	const union = [...new Set([...links, ...newLinks])];
  // 	setLinks(union);
  // }

  // function handleDownload(file: PosttFile) {
  // 	api.user.downloadProjectFile(cookies.userId, file.id as number);
  // }

  return (
    <section className="bg-slate-200 h-[calc(100vh-80px)] py-20 px-40 flex flex-col space-y-4">
      <div className="flex flex-col space-y-4 h-full">
        <input
          data-cy="postTitle"
          type="text"
          value={title}
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 rounded-lg shadow-lg"
        />
        <textarea
          data-cy="postContent"
          placeholder="Description"
          value={content}
          className="p-2 rounded-lg shadow-lg resize-none h-full"
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-6 gap-2">
        {/* <button
					type="button"
					className="bg-slate-400 text-black rounded-lg shadow-lg flex flex-row space-x-2 justify-center items-center p-4"
					onClick={handleImage}
				>
					<PhotoIcon className="h-6 w-6" />
					<p>Image</p>
				</button> */}
        {/* <button
					type="button"
					className="bg-slate-400 text-black rounded-lg shadow-lg flex flex-row space-x-2 justify-center items-center p-4"
				>
					<VideoCameraIcon className="h-6 w-6" />
					<p>Video</p>
				</button> */}
        {/* <button
					type="button"
					className="bg-slate-400 text-black rounded-lg shadow-lg flex flex-row space-x-2 justify-center items-center p-4"
					onClick={handleFile}
				>
					<PaperClipIcon className="h-6 w-6" />
					<p>File</p>
				</button> */}
        {/* <button
					type="button"
					className="bg-slate-400 text-black rounded-lg shadow-lg flex flex-row space-x-2 justify-center items-center p-4"
					onClick={handleLink}
				>
					<LinkIcon className="h-6 w-6" />
					<p>Link</p>
				</button> */}
        <button
          data-cy="submitPost"
          type="button"
          className="bg-sky-800 text-white font-semibold rounded-lg shadow-lg flex flex-row justify-center items-center p-4 col-end-7 col-span-1"
          onClick={handlePost}
        >
          {searchParams.get('edit') ? 'Save' : 'Post'}
        </button>
      </div>
    </section>
  );
}

export default NewForum;
