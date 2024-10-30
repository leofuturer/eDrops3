import PostPreview from '@/components/forum/PostPreview';
import ProfileEdit from '@/components/profile/ProfileEdit';
import ProfileInfo from '@/components/profile/ProfileInfo';
import ProjectPreview from '@/components/project/ProjectPreview';
import {
  Post, Project, User,
  api
} from '@edroplets/api';
import {
  ArrowDownOnSquareIcon,
  ChevronDownIcon,
  PencilIcon,
} from '@heroicons/react/24/solid';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
type ProjectPrev = Project & {
  liked?: boolean;
  saved?: boolean;
}
type PostPrev = Post & {
  liked?: boolean;
  saved?: boolean;
}

export function Profile(): JSX.Element {
  const [user, setUser] = useState<User>({} as User);
  const [feedData, setFeedData] = useState<PostPrev[] | ProjectPrev[]>([]);
  const [feed, setFeed] = useState<'Projects' | 'Posts'>('Projects');
  const [feedType, setFeedType] = useState<'My' | 'Saved'>('My');
  const [dropdown, setDropdown] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const [cookies] = useCookies(['userId']);

  // If looking for a specific user (e.g. /profile/:id) then set the userId to the id, otherwise set it to the current user
  useEffect(() => {
    const userId = id || cookies.userId;
    api.user.get(userId).then((res) => {
      setUser(res);
    });
  }, [id]);

  // Object mapping feed types to their respective API calls
  // const FEED = {
  // 	Projects: {
  // 		Activity: userProjects,
  // 		Saved: userSavedProjects,
  // 	},
  // 	Questions: {
  // 		Activity: userPosts,
  // 		Saved: userSavedPosts,
  // 	},
  // };
  // Get feed data from API
  useEffect(() => {
    if (!cookies.userId) navigate('/login');
    if (feed === 'Projects') {
      if (feedType === 'My') {
        api.user.getProjects(user.id).then((res) => {
          getLikedAndSaved(res).then(() => {
            setFeedData(res);
            console.log(res);
          })
        });
      } else if (feedType === 'Saved') {
        api.user.getSavedProjects(user.id).then((res) => {
          setFeedData(res);
        });
      }
    } else if (feed === 'Posts') {
      if (feedType === 'My') {
        api.user.getPosts(user.id).then((res) => {
          setFeedData(res);
        });
      } else if (feedType === 'Saved') {
        api.user.getSavedPosts(user.id).then((res) => {
          setFeedData(res);
        });
      }
    }
  }, [feedType, feed, user]);

  function handleFeedType(feedType: 'My' | 'Saved') {
    setFeedType(feedType);
    setDropdown(false);
  }

  function handleFeed(type: 'Projects' | 'Posts') {
    setFeed(type);
  }

  async function getLikedAndSaved(list: PostPrev[] | ProjectPrev[]) {
    if (!cookies.userId) return;
    const requests = feed=='Projects' ? [api.user.getLikedPosts(cookies.userId), api.user.getSavedPosts(cookies.userId)] : [api.user.getLikedProjects(cookies.userId), api.user.getSavedProjects(cookies.userId)];
    const [likedPosts, savedPosts] = await Promise.all(requests);
    console.log(savedPosts);
    console.log(likedPosts);
    for (const post of list) {
      post.liked = likedPosts.some(element => element.id == post.id);
      post.saved = savedPosts.some(element => element.id == post.id);
    }
    console.log(feedData.length+" "+list.length);
    console.log(list);
  }

  function setSaved(id: number | undefined) {
    console.log("saving");
    if (!id) return;
    if (!cookies.userId) { navigate('/login'); return; }

    const apiCall = async() => {
      if (feed=='Projects') return api.user.saveProject(cookies.userId, id);
      else return api.user.savePost(cookies.userId, id);
    }
    apiCall()
      .then((res) => {
        const temp = [...feedData];
        const post = feedData.find((post) => post.id==id);
        if (post) {
          console.log(res);
          post.saved = res;
          setFeedData(temp);
        }
      })
      .catch((err: AxiosError) => {
        if (err.message === 'No access token found') {
          navigate('/login');
        }
        // console.log(err);
      });
  }

  function setLiked(id: number | undefined) {
    if (!id) return;
    if (!cookies.userId) { navigate('/login'); return; }
    const apiCall = async() => {
      if (feed=='Projects') return api.user.saveProject(cookies.userId, id);
      else return api.user.savePost(cookies.userId, id);
    }
    apiCall()
      .then((res) => {
        const temp = [...feedData];
        const post = feedData.find((post) => post.id==id);
        if (post) {
          console.log(res);
          post.liked = res;
          setFeedData(temp);
        }
      })
      .catch((err: AxiosError) => {
        if (err.message === 'No access token found') {
          navigate('/login');
        }
        // console.log(err);
      });
  }

  return (
    <section className="grid grid-cols-3 min-h-full bg-slate-200">
      <div className="sticky top-[80px] h-[calc(100vh-80px)] flex flex-col bg-white shadow-2xl items-center justify-center">
        {user.id === cookies.userId && (
        <div
          className="absolute top-4 right-4 cursor-pointer"
          onClick={() => setEdit(!edit)}
        >
          {edit ? (
            <ArrowDownOnSquareIcon className="h-6 w-6" />
          ) : (
            <PencilIcon className="h-6 w-6" />
          )}
        </div>
        )}
        {edit && user.id === cookies.userId ? (
          <ProfileEdit user={user} />
        ) : (
          <ProfileInfo user={user} />
        )}
      </div>
      <div className="col-span-2 flex flex-col px-10">
        <div className="relative flex flex-row p-10 justify-around">
          <div
            className="relative flex flex-row bg-white shadow-2xl justify-center items-center pl-2 pr-2"
            onClick={() => setDropdown(!dropdown)}
          >
            <p className="py-2 text-xl">{feedType=='My' ? 'My '+feed : feedType}</p>
            <ChevronDownIcon className="h-4 w-4" />
            <div
              className={`absolute top-0 w-32 flex flex-col bg-white shadow-2xl ${
							  dropdown ? 'visible' : 'invisible'
              }`}
            >
              <p
                className="py-2 w-full text-xl text-center hover:bg-gray-300"
                onClick={() => handleFeedType('My')}
              >
                {'My '+feed}
              </p>
              <p
                className="py-2 w-full text-xl text-center hover:bg-gray-300"
                onClick={() => handleFeedType('Saved')}
              >
                Saved
              </p>
            </div>
          </div>

          <div className="flex flex-row space-x-4">
            <div
              className={`py-2 px-4 justify-center items-center rounded-3xl cursor-pointer ${
							  feed === 'Projects'
							    ? 'bg-sky-800 text-white'
							    : ''
              }`}
              onClick={() => handleFeed('Projects')}
            >
              <p className="text-xl text-center">Projects</p>
            </div>
            <div
              className={`py-2 px-4 justify-center items-center rounded-3xl cursor-pointer ${
							  feed === 'Posts'
							    ? 'bg-sky-800 text-white'
							    : ''
              }`}
              onClick={() => handleFeed('Posts')}
            >
              <p className="text-xl text-center">Posts</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          {feed === 'Projects'
					  ? (feedData.length > 0 ?
                feedData.map((project) => (
                <ProjectPreview
                  project={project}
                  key={project.id}
                  handleDelete={() => {
                    // setCurrPost(post.id);
                    // setDeleteModalVisible(true);
                  }}
                  setSaved={()=>{setSaved(project.id)}}
                  setLiked={()=>{setLiked(project.id)}}
                />
						    )):
                <p className='text-center text-lg bg-white rounded-md p-2 h-32 flex items-center justify-center'>{"You don't have any "+(feedType=='Saved' ? 'saved' : '' )+" projects yet!"}</p>
              )
					  : (feedData.length > 0 ?
              feedData.map((post) => (
              <PostPreview
                post={post}
                key={post.id}
                handleDelete={()=>{}}
                setSaved={()=>{setSaved(post.id)}}
                setLiked={()=>{setLiked(post.id)}}
              />
						  )) :
              <p className="text-center text-lg bg-white rounded-md p-2 h-32 flex items-center justify-center">{"You don't have any "+(feedType=='Saved' ? 'saved' : '' )+" posts yet!"}</p>
              )}
        </div>
      </div>
    </section>
  );
}

export default Profile;
