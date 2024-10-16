import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Project as ProjectType } from '@edroplets/api';

function ProjectPreviewCompact({ project } : { project: ProjectType }) {
  const navigate = useNavigate();

  return (
    <div className="w-full border-b-2 border-black/10 flex flex-row items-center p-4 cursor-pointer" onClick={() => navigate(`/project/${project.id}`)}>
      <div className="w-full flex flex-col">
        <h3>
          {project.author}
          {' '}
          /
          {project.title}
        </h3>
        {/* <p>{project.content}</p> */}
        <p>{new Date(project.datetime).toLocaleDateString()}</p>
      </div>
    </div>
  );
}

export default ProjectPreviewCompact;
