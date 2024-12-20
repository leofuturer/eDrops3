import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Post, Project, api } from '@edroplets/api';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import {
  BookmarkIcon, ChatBubbleBottomCenterTextIcon, ChatBubbleLeftIcon, HandThumbUpIcon, EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';
import { useCookies } from 'react-cookie';
import { AxiosError } from 'axios';

type PostPrev = Post & {
  liked?: boolean;
  saved?: boolean;
}

function PostPreview({ post, handleDelete, setSaved, setLiked}: { post: PostPrev, handleDelete: Function, setSaved: Function, setLiked: Function}) {
  const [cookies] = useCookies(['userId']);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const navigate = useNavigate();

  function handleSave(e: React.MouseEvent) {
    e.preventDefault();
    setSaved(post.id);
  }

  function handleLike(e: React.MouseEvent) {
    e.preventDefault();
    setLiked(post.id);
  }

  return (
    <NavLink
      to={`/forum/${post.id}`}
      className="w-full flex flex-col items-center cursor-pointer rounded-2xl mb-4 bg-white shadow-2xl z-0"
    >
      <div className="w-full flex flex-col space-y-4 p-4">
        <div className="flex flex-row justify-between items-center">
          <h3 className="text-xl">{post.title}</h3>
          <div className="flex flex-row">
            <BookmarkIcon
              className={`w-8 h-8 cursor-default ${post.saved ? 'fill-black' : ''
                }`}
              onClick={(e) => handleSave(e)}
            />
          </div>

        </div>
        <div className="flex flex-row space-x-2 items-center">
          <div className="flex items-center space-x-1">
            <UserCircleIcon className="h-6 text-gray-500" />
            <h3>{post.author}</h3>
          </div>
          <p>&#183;</p>
          <p>{new Date(post.datetime).toLocaleDateString()}</p>
        </div>

        <p className="line-clamp-2">{post.content}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2"
              onClick={handleLike}
            >
              <HandThumbUpIcon className="h-6" fill={post.liked ? 'black' : 'none'}/>
              <p>{post.likes}</p>
            </div>
            <div className="flex items-center space-x-2">
              <ChatBubbleBottomCenterTextIcon className="h-6" />
              <p>{post.comments}</p>
            </div>
          </div>
          {
              (post.userId === cookies.userId)
                ? (
                  <div className="flex flex-col">
                    <EllipsisHorizontalIcon
                      data-cy="openMenu"
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
                            data-cy="editButton"
                            onClick={(e) => {
                              e.preventDefault();
                              console.log('editing');
                              navigate(`/forum/new?edit=true&id=${post.id}`);
                            }}
                          >
                            Edit
                          </button>
                        </li>
                        <li>
                          <button
                            data-cy="deleteButton"
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
    </NavLink>
  );
}

export default PostPreview;
