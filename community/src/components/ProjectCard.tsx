import React from "react";
import { getProject } from "../lib/projects";

interface Props {
  id: number;
}

function ProjectCard({ id }: Props) {
  const project = getProject(id);
  return (
    <div className="w-1/4 h-full my-10 border-2 rounded-2xl p-4 shadow-xl border-black/10 flex flex-row items-center">
      <div className="w-full flex flex-col justify-between h-full">
        <div className="w-full h-2/3">a</div>
        <div>
          <h3 className="w-full h-1/3 flex flex-col">
            {project.author} / {project.name}
          </h3>
          <p>{project.description}</p>
          <p>{project.date.toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
