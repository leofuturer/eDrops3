import { useState } from 'react'
import ProjectCard from '../components/ProjectCard'
import ProjectPreview from '../components/ProjectPreview'

function Home() {
  const featuredProjectIds : number[] = [1]

  return (
    <div className="h-screen">
      <div id="hero" className="w-full h-1/2 flex flex-col items-center justify-center">
        {featuredProjectIds.map((id) => <ProjectCard key={id} id={id} />)}
      </div>
    </div>
  )
}

export default Home
