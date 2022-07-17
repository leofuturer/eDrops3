import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/api";
import { project } from "../../api/serverConfig";
import { timeAgo } from "../../lib/time";
import { ProjectType } from "../../lib/types";

function Project() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);

    const [currentProject, setCurrentProject] = useState<ProjectType>({
        id: 0,
        title: "",
        author: "",
        content: "",
        datetime: new Date(),
        likes: 0,
    });

    useEffect(() => {
        API.Request(project.replace("id", id as string), "GET", {}, false).then(
            (res) => {
                setCurrentProject(res.data);
                setLoading(false);
            }
        );
    }, [id]);

    return (
        <div>
            {!loading && (
                <div className="flex flex-col space-y-4 p-4">
                    <div className="flex flex-col">
                        <h1 className="text-lg">{currentProject?.title}</h1>
                        <p className="text-md">
                            {currentProject?.author} &#8226;{" "}
                            {timeAgo(new Date(currentProject.datetime))}
                        </p>
                    </div>
                    <div>{currentProject?.content}</div>
                </div>
            )}
        </div>
    );
}

export default Project;
