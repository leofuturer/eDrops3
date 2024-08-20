import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/24/solid';
import { debounce } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { api, Project as ProjectType } from '@edroplets/api';
import ProjectPreview from '@/components/project/ProjectPreview';
import ProfilePreview from '@/components/profile/ProfilePreview';
import { DeleteModal } from '@/components/ui/DeleteModal';
import { useCookies } from 'react-cookie';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

type ProjectPrev = ProjectType & {
  liked?: boolean;
  saved?: boolean;
}

export function Projects() {
  const navigate = useNavigate();
  const [projectList, setProjectList] = useState<ProjectPrev[]>([]);
  const [sortedProjects, setSortedProjects] = useState<ProjectPrev[]>([]);
  const [search, setSearch] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [currProj, setCurrProj] = useState<number | undefined>(undefined);
  const [feedType, setFeedType] = useState<'Featured' | 'New'>('Featured');
  const [cookies] = useCookies(['userId']);

  // Return projects based on search query (debounced)
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
    api.project.getAll({ filter }).then(async (res) => {
      await getLikedAndSaved(res);
      setProjectList(res);
    });
  }, [search]);

  // Sort projects based on feed type
  useEffect(() => {
    const sortedProjects = ([] as ProjectPrev[]).concat(projectList);
    if (feedType === 'Featured') {
      sortedProjects.sort((a, b) => (a.likes < b.likes ? 1 : -1));
    } else if (feedType === 'New') {
      sortedProjects.sort((a, b) => (a.datetime < b.datetime ? 1 : -1));
    }
    setSortedProjects(sortedProjects);
  }, [feedType, projectList]);

  // Handle search (debounced in debounceSearch)
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    console.log(e.target.value);
  };

  function handleDelete(id: number) {
    if (!id) return;
    api.user.deleteProject(cookies.userId, id)
      .then(() => {
        const tempList = [...projectList];
        const index = tempList.findIndex((element) => element.id == id);
        tempList.splice(index, 1);
        setProjectList(tempList);
      })
      .catch((err: AxiosError) => {
        if (err.response?.status === 401) {
          navigate('/login');
        }
        console.log(err);
      });
    setDeleteModalVisible(false);
  }

  const debounceSearch = useMemo(() => debounce(handleSearch, 300), []);

  useEffect(() => debounceSearch.cancel());

  function setSaved(id: number) {
    if (!cookies.userId) { navigate('/login'); return; }
    api.user.saveProject(cookies.userId, id)
      .then((res) => {
        let temp = [...projectList];
        let project = projectList.find((project) => project.id==id);
        if (project) {
          console.log(res);
          project.saved = res;
          setProjectList(temp);
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
    api.user.likeProject(cookies.userId, id)
      .then((res) => {
        let temp = [...projectList];
        let project = projectList.find((project) => project.id==id);
        if (project) {
          console.log(res);
          project.liked = res;
          if (res) project.likes++;
          else project.likes--;
          setProjectList(temp);
        }
      })
      .catch((err: AxiosError) => {
        if (err.message === 'No access token found') {
          navigate('/login');
        }
        // console.log(err);
      });
  }

  async function getLikedAndSaved(list: ProjectPrev[]) {
    const [likedProjects, savedProjects] = await Promise.all([
      api.user.getLikedProjects(cookies.userId),
      api.user.getSavedProjects(cookies.userId),
    ]);
  
    for (const project of list) {
      project.liked = likedProjects.some(element => element.id === project.id);
      project.saved = savedProjects.some(element => element.id === project.id);
    }
  }

  return (
    <section className="min-h-full bg-slate-200 grid grid-cols-4 px-20">
       <DeleteModal
        postId={currProj}
        deleteModalVisible={deleteModalVisible}
        setDeleteModalVisible={setDeleteModalVisible}
        handleDelete={()=>{
          if (currProj) handleDelete(currProj);
        }}
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
            <NavLink to="/projects/new">
              <button
                type="button"
                className="bg-sky-800 text-white rounded-2xl w-full h-full hidden lg:flex items-center justify-center"
              >
                New Project
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
        <div id="projectList">
          {sortedProjects.map((project) => (
            <ProjectPreview 
              project={project} 
              key={project.id} 
              handleDelete={() => {
                setCurrProj(project.id);
                setDeleteModalVisible(true);
              }}
              setLiked={setLiked}
              setSaved={setSaved}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col px-10 mt-20">
        <div className="flex flex-col sticky top-20 space-y-4">
          <div
            className={`py-2 px-4 justify-center items-center rounded-3xl ${
						  feedType === 'Featured'
						    ? 'bg-sky-800 text-white'
						    : ''
            }`}
            onClick={() => setFeedType('Featured')}
          >
            <p className="text-2xl text-center">Featured</p>
          </div>
          <div
            className={`py-2 px-4 justify-center items-center rounded-3xl ${
						  feedType === 'New' ? 'bg-sky-800 text-white' : ''
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

export default Projects;
