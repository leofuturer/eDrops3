import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/solid';
import { debounce } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { api, Post } from '@edroplets/api';
import { useCookies } from 'react-cookie';
import { AxiosError } from 'axios';
import { DeleteModal } from '@/components/ui/DeleteModal';
import ProfilePreview from '@/components/profile/ProfilePreview';
import PostPreview from '@/components/forum/PostPreview';

type PostPrev = Post & {
  liked?: boolean;
  saved?: boolean;
}

export function Forum() {
  const navigate = useNavigate();
  const [postList, setPostList] = useState<PostPrev[]>([]);
  const [sortedPosts, setSortedPosts] = useState<PostPrev[]>([]);
  const [search, setSearch] = useState('');
  const [feedType, setFeedType] = useState<'Featured' | 'New'>('Featured');
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [currPost, setCurrPost] = useState<number | undefined>(undefined);
  const [cookies] = useCookies(['userId']);

  useEffect(() => {
    let filter = {};
    if (search !== '') {
      // filter = {
      //     where: {
      //         title: { match: search },
      //     },
      // };
      filter = {
        where: {
          or: [
            {
              title: {
                regexp: `/${search}/i`,
              },
            },
            {
              author: {
                regexp: `/${search}/i`,
              },
            },
          ],
        },
      };
    }
    api.post.getAll({ filter }).then(async(res) => {
      await getLikedAndSaved(res);
      setPostList(res);
    });
  }, [search]);

  useEffect(() => {
    const sortedPosts = ([] as PostPrev[]).concat(postList);
    if (feedType === 'Featured') {
      sortedPosts.sort((a, b) => (a.likes < b.likes ? 1 : -1));
    } else if (feedType === 'New') {
      sortedPosts.sort((a, b) => (a.datetime < b.datetime ? 1 : -1));
    }
    setSortedPosts(sortedPosts);

  }, [feedType, postList]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    // console.log(e.target.value);
  };

  const debounceSearch = useMemo(() => debounce(handleSearch, 300), []);

  useEffect(() => debounceSearch.cancel());

  function handleDelete(id: number) {
    if (!id) return;
    api.user.deletePost(cookies.userId, id)
      .then(() => {
        const tempList = [...postList];
        const index = tempList.findIndex((element) => element.id == id);
        tempList.splice(index, 1);
        setPostList(tempList);
      })
      .catch((err: AxiosError) => {
        if (err.response?.status === 401) {
          navigate('/login');
        }
        console.log(err);
      });
    setDeleteModalVisible(false);
  }

  function setSaved(id: number) {
    if (!cookies.userId) { navigate('/login'); return; }
    api.user.savePost(cookies.userId, id)
      .then((res) => {
        let temp = [...postList];
        let post = postList.find((post) => post.id==id);
        if (post) {
          console.log(res);
          post.saved = res;
          setPostList(temp);
        }
      })
      .catch((err: AxiosError) => {
        if (err.message === 'No access token found') {
          navigate('/login');
        }
        // console.log(err);
      });
  }

  function setLiked(id: number) {
    if (!cookies.userId) { navigate('/login'); return; }
    api.user.likePost(cookies.userId, id)
      .then((res) => {
        let temp = [...postList];
        let post = postList.find((post) => post.id==id);
        if (post) {
          console.log(res);
          post.liked = res;
          if (res) post.likes++;
          else post.likes--;
          setPostList(temp);
        }
      })
      .catch((err: AxiosError) => {
        if (err.message === 'No access token found') {
          navigate('/login');
        }
        // console.log(err);
      });
  }

  async function getLikedAndSaved(list: PostPrev[]) {
    const [likedPosts, savedPosts] = await Promise.all([
      api.user.getLikedPosts(cookies.userId),
      api.user.getSavedPosts(cookies.userId),
    ]);
  
    for (const post of list) {
      post.liked = likedPosts.some(element => element.id === post.id);
      post.saved = savedPosts.some(element => element.id === post.id);
    }
  }

  return (
    <section className="bg-slate-200 min-h-full grid grid-cols-4 px-20">
      <DeleteModal
        postId={currPost}
        deleteModalVisible={deleteModalVisible}
        setDeleteModalVisible={setDeleteModalVisible}
        handleDelete={handleDelete}
      />
      <ProfilePreview />
      <div className="col-span-2 flex flex-col">
        <div className="w-full flex flex-row py-4 h-20 space-x-4">
          <div className="relative w-4/5 h-full">
            <input
              type="text"
              placeholder="Search projects"
              onChange={debounceSearch}
              className="w-full h-full rounded-2xl p-2"
            />
            <MagnifyingGlassIcon className="absolute top-4 right-4 h-4 w-4 text-slate-400" />
          </div>
          <div className="w-1/5 h-full">
            <NavLink to="/forum/new">
              <button
                type="button"
                className="bg-sky-800 text-white rounded-2xl w-full h-full hidden lg:flex items-center justify-center"
              >
                New Post
              </button>
              <button
                title="New"
                type="button"
                className="bg-sky-800 text-white rounded-2xl w-full h-full flex lg:hidden items-center justify-center"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </NavLink>
          </div>
        </div>
        <div data-cy="postList">
          {sortedPosts.map((post) => {
            return <PostPreview
              post={post}
              key={post.id}
              handleDelete={() => {
						    setCurrPost(post.id);
						    setDeleteModalVisible(true);
              }}
              setSaved={setSaved}
              setLiked={setLiked}
            />
          })}
        </div>
      </div>
      <div className="flex flex-col px-10 mt-20">
        <div className="flex flex-col sticky top-20 space-y-4">
          <div
            className={`py-2 px-4 justify-center items-center rounded-3xl ${feedType === 'Featured'
						  ? 'bg-sky-800 text-white'
						  : ''
            }`}
            onClick={() => setFeedType('Featured')}
          >
            <p className="text-2xl text-center">Featured</p>
          </div>
          <div
            className={`py-2 px-4 justify-center items-center rounded-3xl ${feedType === 'New' ? 'bg-sky-800 text-white' : ''
            }`}
            onClick={() => setFeedType('New')}
          >
            <p className="text-2xl text-center">New</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Forum;
