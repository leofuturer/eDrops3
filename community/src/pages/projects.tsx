import React, { useState, useEffect, useMemo } from "react";
import ProjectPreview from "../components/project/ProjectPreview";
import API from "../api/api";
import { projects } from "../api/serverConfig";
import { ProjectType } from "../lib/types";
import { debounce } from "lodash";

function Projects() {
    const [projectList, setProjectList] = useState<ProjectType[]>([]);
    const [search, setSearch] = useState("");

    let filter = {};

    useEffect(() => {
        if (search !== "") {
            // filter = {
            //     where: {
            //         title: { match: search },
            //     },
            // };
            filter = {
                where: {
                    or: [
                        {
                            title: {
                                regexp: `/${search}/i`,
                            },
                        },
                        {
                            author: {
                                regexp: `/${search}/i`,
                            },
                        },
                    ],
                },
            };
        }
        API.Request(projects, "GET", {}, false, { filter }).then((res) => {
            console.log(res);
            setProjectList(res.data);
        });
    }, [search]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        console.log(e.target.value);
    };

    const debounceSearch = useMemo(() => {
        return debounce(handleSearch, 300);
    }, []);

    useEffect(() => debounceSearch.cancel());

    return (
        <div>
            <div className="border-t-2 border-black/10">
                <div className="w-full flex flex-col items-start justify-center p-4">
                    <h1 className="text-xl">Projects</h1>
                    <input
                        type="text"
                        placeholder="Search"
                        onChange={debounceSearch}
                    />
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
