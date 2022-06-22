import React from "react";
import { getProject } from "../lib/projects";

interface Props {
    id: number;
}

function Project({ id } : Props) {
    const project = getProject(id);
    return (
        <div>
            <div></div>
        </div>
    );
}

export default Project;
