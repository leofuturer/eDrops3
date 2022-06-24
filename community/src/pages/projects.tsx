import React, { useState, useEffect } from "react";
import ProjectPreview from "../components/project/ProjectPreview";
import API from "../api/api";
import { projects } from "../api/serverConfig";
import { ProjectType } from "../lib/types";

function Projects() {
  const [projectList, setProjectList] = useState<ProjectType[]>([]);

  useEffect(() => {
    API.Request(projects, "GET", {}, false).then((res) => {
      setProjectList(res.data);
    });
  }, []);

  return (
    <div>
      <div className="border-t-2 border-black/10">
        <div className="w-full flex flex-col items-start justify-center p-4">
          <h1 className="text-xl">Projects</h1>
          <input type="text" placeholder="Search" />
        </div>
      </div>
      <div id="projectList">
        {projectList.map((project) => (
          <ProjectPreview key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

export default Projects;
