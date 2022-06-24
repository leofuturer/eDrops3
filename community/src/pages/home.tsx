import { useState, useEffect} from 'react'
import ProjectCard from '../components/project/ProjectCard'
import ProjectPreview from '../components/project/ProjectPreview'
import { ProjectType } from '../lib/types'
import API from '../api/api'
import { project } from '../api/serverConfig'

function Home() {
  const featuredProjectIds : number[] = [1]

  const [featuredProjects, setFeaturedProjects] = useState<ProjectType[]>([])

  useEffect(() => {
    for(let id of featuredProjectIds) {
      API.Request(project.replace('id', id.toString()), "GET", {}, false).then((res) => {
        setFeaturedProjects([...featuredProjects, res.data])
      }
      )
    }
  }, [])


  return (
    <div className="h-screen">
      <div id="hero" className="w-full h-1/2 flex flex-col items-center justify-center">
        {featuredProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
      </div>
    </div>
  )
}

export default Home
