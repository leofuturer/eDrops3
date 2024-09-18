import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Project as ProjectType, api } from '@edroplets/api';
import { BookmarkIcon, ChatBubbleBottomCenterTextIcon, HandThumbUpIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { useCookies } from 'react-cookie';
import { AxiosError } from 'axios';
import { UserCircleIcon } from '@heroicons/react/24/solid';

type ProjectPrev = ProjectType & {
  liked?: boolean;
  saved?: boolean;
}

function ProjectPreview({ project, handleDelete, setSaved, setLiked}: { project: ProjectPrev, handleDelete: Function, setSaved: Function, setLiked: Function}) {
  const [coverImageId, setCoverImageId] = useState(-1);
  const [cookies] = useCookies(['userId']);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.project.getProjectFiles(project.id).then((files) => {
      const images = files.filter((file) => file.fileType === 'image');
      if (images.length === 0) {
        setCoverImageId(-1);
      } else {
        setCoverImageId(images[0].id ?? -1);
      }
    });
  }, [project.id]);


  function handleSave(e: React.MouseEvent) {
    e.preventDefault();
    setSaved(project.id);
  }

  function handleLike(e: React.MouseEvent) {
    e.preventDefault();
    setLiked(project.id);
  }

  return (
    <NavLink
      to={`/project/${project.id}`}
      className="w-full flex flex-col items-center cursor-pointer rounded-2xl mb-4 bg-white shadow-2xl"
    >

      <div className="w-full flex flex-col space-y-4 p-4">
        <div className="flex flex-row justify-between items-center">
          <h3 className="text-xl">{project.title}</h3>
          <BookmarkIcon
            className={`w-8 h-8 cursor-default ${project.saved ? 'fill-black' : ''
            }`}
            onClick={(e) => handleSave(e)}
          />
        </div>
        <div className="flex flex-row space-x-2 items-center">
          <div className="flex items-center space-x-1">
            <UserCircleIcon className="h-6 text-gray-500" />
            <h3>{project.author}</h3>
          </div>
          <p>&#183;</p>
          <p>{new Date(project.datetime).toLocaleDateString()}</p>
        </div>
        {coverImageId !== -1
					&& (
            <div className="h-full w-full max-h-80 flex justify-center bg-gray-900 rounded-xl">
              <img src={`/api/project-files/${coverImageId}/download`} alt={project.title} className="h-full max-h-80" />
            </div>
					)}
        {coverImageId == -1 && <p className="line-clamp-2">{project.content}</p>}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2"
              onClick={handleLike}
            >
              <HandThumbUpIcon className="h-6" fill={project.liked ? 'black' : 'none'}/>
              <p>{project.likes}</p>
            </div>
            <div className="flex items-center space-x-2">
              <ChatBubbleBottomCenterTextIcon className="h-6" />
              <p>{project.comments}</p>
            </div>
          </div>
          <div>
            {
                (project.userId === cookies.userId)
                  ? (
                    <div className="flex flex-col">
                      <EllipsisHorizontalIcon
                        className="w-10 h-10 z-100 cursor-default"
                        onClick={(e) => {
                          e.preventDefault();
                          setDropdownVisible(!dropdownVisible);
                        }}
                      />
                      <div style={{ display: dropdownVisible ? 'block' : 'none' }} className="absolute mt-8 -ml-9">
                        <ul className="text-white bg-slate-700 p-2 px-3 rounded">
                          <li>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                console.log('editing');
                                navigate(`/projects/new?edit=true&id=${project.id}`);
                              }}
                            >
                              Edit
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={(e) => {
                                // have parent class handle this
                                e.preventDefault();
                                handleDelete();
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
          </div>
        </div>
      </div>
    </NavLink>
  );
}

export default ProjectPreview;
