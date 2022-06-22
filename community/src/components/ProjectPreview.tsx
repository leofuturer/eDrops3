import React from "react";
import { getProject } from "../lib/projects";

interface Props {
    id: number;
}
function ProjectPreview({ id } : Props) {
    const project = getProject(id);
    return (
        <div className="w-full border-b-2 border-black/10 flex flex-row items-center p-4">
            <div className="w-full flex flex-col">
                <h3>{project.author} / {project.name}</h3>
                <p>{project.description}</p>
                <p>{project.date.toLocaleDateString()}</p>
            </div>
        </div>
    );
}

export default ProjectPreview;
