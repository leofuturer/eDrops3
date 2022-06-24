import React from "react";
import { ProjectType } from "../../lib/types";

function ProjectPreview({ project } : { project: ProjectType }) {
  return (
    <div className="w-full border-b-2 border-black/10 flex flex-row items-center p-4">
      <div className="w-full flex flex-col">
        <h3>
          {project.author} / {project.title}
        </h3>
        {/* <p>{project.content}</p> */}
        <p>{new Date(project.datetime).toLocaleDateString()}</p>
      </div>
    </div>
  );
}

export default ProjectPreview;
