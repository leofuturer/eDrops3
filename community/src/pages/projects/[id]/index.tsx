
import {
  ArrowDownIcon,
  BookmarkIcon,
  ChatBubbleBottomCenterTextIcon,
  ChatBubbleLeftRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HandThumbUpIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline';
import { AxiosError } from 'axios';
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import {
  Link, NavLink, useNavigate, useParams,
} from 'react-router-dom';
import { api, ProjectComment as CommentType, Project as ProjectType } from '@edroplets/api';
import { timeAgo } from '@/lib/time';
import ProjectComment from '@/components/project/ProjectComment';
import { DeleteModal } from '@/components/ui/DeleteModal';

export function Project() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [currentProject, setCurrentProject] = useState<ProjectType>(
		{} as ProjectType,
  );
  const [saved, setSaved] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [imageIds, setImageIds] = useState<number[]>([]);

  const [newComment, setNewComment] = useState<string>('');
  const [comments, setComments] = useState<CommentType[]>([]);

  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);

  const [cookies] = useCookies(['userId']);

  // Fetch current project and set loading to false after fetch
  useEffect(() => {
    api.project.get(id as string).then((res) => {
      // console.log(res);
      setCurrentProject(res);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    api.project.getProjectFiles(parseInt(id as string)).then((files) => {
      const images = files.filter((file) => file.fileType === 'image');
      const imageIds = images.map((image) => image.id as number);
      setImageIds(imageIds);
    });
  }, [id]);

  // Fetch comments and sort based on time
  useEffect(() => {
    if (!id) { navigate('/projects'); return; }
    api.project.getProjectComments(parseInt(id)).then((comments) => {
      const sortedComments = comments.sort((a, b) => (a.datetime < b.datetime ? 1 : -1));
      setComments(sortedComments);
    });
  }, [id, newComment]);

  // Check if project is saved initially
  useEffect(() => {
    if (currentProject.id && cookies.userId) {
      api.user.getSavedProject(cookies.userId, currentProject.id).then((res) => {
        setSaved(!!res);
      });
    }
  }, [currentProject, cookies.userId]);

  // Check if project is liked initially
  useEffect(() => {
    if (currentProject.id && cookies.userId) {
      api.user.getLikedProject(cookies.userId, currentProject.id).then((res) => {
        setLiked(!!res);
      });
    }
  }, [currentProject, cookies.userId]);

  function handleSave() {
    if (currentProject.id && cookies.userId) {
      api.user.saveProject(cookies.userId, currentProject.id)
        .then((res) => setSaved(res))
        .catch((err: AxiosError) => {
          if (err.message === 'No access token found') {
            navigate('/login');
          }
          // console.log(err);
        });
    } else {
      navigate('/projects');
    }
  }

  function handleLike() {
    if (currentProject.id) {
      api.user.likeProject(cookies.userId, currentProject.id)
        .then((res) => {
          setLiked(res);
          currentProject.likes = res
            ? currentProject.likes + 1
            : currentProject.likes - 1;
        })
        .catch((err: AxiosError) => {
          if (err.status === 401) {
            navigate('/login');
          }
          // console.log(err);
        });
    } else {
      navigate('/projects');
    }
  }

  function needAuth(f: Function) {
    if (!cookies.userId) {
      navigate('/login');
    } else {
      f();
    }
  }

  function handleComment() {
    if (!cookies.userId) { navigate('/login'); return; }
    const newPostComment = {
      content: newComment,
      author: '',
      datetime: new Date(),
      likes: 0,
      userId: cookies.userId,
      top: true,
    };
    api.project.addProjectComment(cookies.userId, newPostComment)
      .then((res) => {
        setNewComment('');
        currentProject.comments += 1;
      })
      .catch((err: AxiosError) => {
        if (err.response?.status === 401) {
          navigate('/login');
        }
        // console.log(err);
      });
    setExpanded(!expanded);
  }

  function handleDownloadAll() {
    currentProject?.projectFiles?.forEach((projectFile) => {
      api.projectFile.download(projectFile.id as number);
    });
  }

  function handleDownload(fileId: number) {
    api.projectFile.download(fileId);
  }

  const projectFiles = currentProject?.projectFiles?.map((projectFile) => (
    <li key={projectFile.id} className="text-sky-700 bg-white p-2 shadow-lg rounded-sm flex justify-between">
      <p
        className="cursor-pointer"
        onClick={() => handleDownload(projectFile.id as number)}
      >
        {projectFile.fileName}
      </p>
      <ArrowDownIcon className="w-6 h-6 cursor-pointer" onClick={() => handleDownload(projectFile.id as number)} />
    </li>
  ));

  const projectLinks = currentProject?.projectLinks?.map((projectLink) => (
    <li key={projectLink.id} className="text-sky-700 bg-white p-2 shadow-lg rounded-sm">
      <a href={projectLink.link} target="_blank" rel="noreferrer">
        {projectLink.link}
      </a>
    </li>
  ));

  return (
    <section className="relative bg-slate-200 min-h-full py-10 grid grid-cols-5">
       <DeleteModal
        postId={currentProject.id}
        deleteModalVisible={deleteModalVisible}
        setDeleteModalVisible={setDeleteModalVisible}
        handleDelete={()=>{}}
      />
      <div className="flex flex-col items-center">
        <div className="h-10 w-10">
          <NavLink to="/projects">
            <ChevronLeftIcon />
          </NavLink>
        </div>
      </div>
      <div className="col-span-3 flex flex-col space-y-4">
        {!loading && (
        <>
          <div className="flex flex-col">
            <div className="flex flex-row w-full justify-between">
              <h1 className="text-3xl">
                {currentProject?.title}
              </h1>
              <div className="flex flex-row">
                  {
                    (currentProject.userId === cookies.userId)
                      ? (
                        <div className="flex flex-col">
                          <EllipsisHorizontalIcon
                            className={`w-10 h-10 cursor-pointer ${saved ? 'fill-black' : ''}`}
                            onClick={() => setDropdownVisible(!dropdownVisible)}
                          />
                          <div style={{ display: dropdownVisible ? 'block' : 'none' }} className="absolute mt-8 -ml-9">
                            <ul className="text-white bg-slate-700 p-2 px-3 rounded">
                              <li>
                                <button
                                  onClick={() => {
                                    console.log('editing');
                                    navigate(`/projects/new?edit=true&id=${id}`);
                                  }}
                                >
                                  Edit
                                </button>
                              </li>
                              <li>
                                <button
                                  onClick={() => {
                                    setDeleteModalVisible(true);
                                    setDropdownVisible(false);
                                  }}
                                >
                                  Delete
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      )
                      : <></>
                  }

                  <BookmarkIcon
                    className={`w-10 h-10 cursor-pointer ${saved ? 'fill-black' : ''
                      }`}
                    onClick={handleSave}
                  />
                </div>
            </div>
            <p className="text-md">
              <Link to={`/profile/${currentProject?.userId}`}>
                {currentProject?.author}
              </Link>
              {' '}
              &#8226;
              {' '}
              {timeAgo(new Date(currentProject.datetime))}
            </p>
          </div>
          {imageIds.length > 0
							&& (
<div className="h-full w-full max-h-80 flex justify-center bg-gray-900 rounded-2xl">
  <img src={`/api/project-files/${imageIds[0]}/download`} alt={currentProject.title} className="h-full max-h-80" />
</div>
							)}
          {/* {imageIds.slice(1).map((imageId) => (
							<img src={`/api/project-files/${imageId}/download`} alt={currentProject.title} className="h-full max-h-80" />
						))} */}
          <div>{currentProject?.content}</div>
          {currentProject.projectFiles
							&& (
<div className="flex flex-col">
  <div className=" flex justify-between items-center">
    <h3 className="text-xl mb-2">
      Files
    </h3>
    <button type="button" onClick={() => handleDownloadAll()} className="bg-primary text-white rounded-md p-2 hidden lg:flex items-center justify-center space-x-2 mb-2">
      <p>Download All</p>
      <ArrowDownIcon className="w-6 h-6" />
    </button>
  </div>
  <hr className="border-1 border-gray-800 cursor-pointer mb-2 " />
  <ul className="flex flex-col divide-y">
    {projectFiles}
  </ul>
</div>
							)}
          {currentProject.projectLinks
							&& (
<div className="flex flex-col ">
  <h3 className="text-xl mb-2">
    Links
  </h3>
  <hr className="border-1 border-gray-800 cursor-pointer mb-2 " />
  <ul className="flex flex-col space-y-2">
    {projectLinks}
  </ul>
</div>
							)}
          <div className="flex flex-row space-x-4">
            <div
              className="flex flex-row space-x-2 cursor-pointer"
              onClick={() => needAuth(handleLike)}
            >
              <HandThumbUpIcon
                className={`w-6 h-6 cursor-pointer ${liked ? 'fill-black' : ''
                }`}
              />
              <p className="text-md">
                {currentProject?.likes}
              </p>
            </div>
            {/* <div className="flex flex-row space-x-2">
								<ThumbDownIcon className="w-10 h-10" />
								<p className="text-md">
									{currentProject?.dislikes}
								</p>
							</div> */}
            <div
              className="flex flex-row space-x-2 cursor-pointer"
              onClick={() => needAuth(() => setExpanded(!expanded))}
            >
              <ChatBubbleBottomCenterTextIcon className="w-6 h-6" />
              <p className="text-md">Comment</p>
            </div>
          </div>
          <div className="flex flex-row space-x-2 border-b-2 border-black pb-2">
            <h3 className="text-xl">Comments</h3>
            <ChatBubbleLeftRightIcon className="w-6 h-6" />
            <p className="text-md">
              {currentProject?.comments}
            </p>
          </div>
          {expanded && (
          <div
            className={`bg-white p-2 pl-4 flex flex-col space-y-2 ${expanded ? 'transition-all' : ''
            } ease-in-out duration-500`}
          >
            <textarea
              title="reply"
              className="w-full rounded-md resize-none border-black/25 border-2 p-2"
              value={newComment}
              onChange={(e) => {
									  setNewComment(e.target.value);
              }}
              placeholder="Reply"
            />
            <div className="flex flex-row justify-end">
              <button
                type="button"
                title="Send"
                className="bg-sky-800 rounded-md p-2"
                onClick={handleComment}
              >
                <ChevronRightIcon className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
          )}
          <div className="flex flex-col space-y-2">
            {comments.map((comment: CommentType) => (
              <ProjectComment comment={comment} key={comment.id} />
            ))}
          </div>
        </>
        )}
      </div>
    </section>
  );
}

export default Project;
