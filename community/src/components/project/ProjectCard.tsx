import React from "react";
import { ProjectType } from "../../lib/types";

function ProjectCard({ project }: { project: ProjectType }) {
  return (
    <div className="w-1/4 h-full my-10 border-2 rounded-2xl p-4 shadow-xl border-black/10 flex flex-row items-center">
      <div className="w-full flex flex-col justify-between h-full">
        <div className="w-full h-2/3">Image</div>
        <div className="w-full h-1/3">
          <h3 className="w-full flex flex-col h-1/2">
            {project.author} / {project.title}
          </h3>
          <p className="flex truncate h-1/2 w-full">{project.content}</p>
          <p>{new Date(project.datetime).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
