import React from 'react'
import ProjectPreview from '../components/ProjectPreview'

function Projects() {
  const projectIds : number[] = [1,3]
  
  return (
    <div>
      <div className="border-t-2 border-black/10">
        <div className="w-full flex flex-col items-start justify-center p-4">
          <h1 className="text-xl">Projects</h1>
          <input type="text" placeholder="Search" />
        </div>
      </div> 
      <div id="projectList">
        {projectIds.map(projectId => <ProjectPreview key={projectId} id={projectId} />)}
      </div>
    </div>
  )
}

export default Projects