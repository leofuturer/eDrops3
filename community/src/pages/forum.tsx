import React, { useState, useEffect } from "react";
import API from "../api/api";
import { forums } from "../api/serverConfig";
import { ForumType } from "../lib/types";

function Forum() {
  const [forumList, setForumList] = useState<ForumType[]>([]);

  useEffect(() => {
    API.Request(forums, "GET", {}, false).then((res) => {
      setForumList(res.data);
    });
  }, []);

  return (
    <div>
      <div className="border-t-2 border-black/10">
        <div className="w-full flex flex-col items-start justify-center p-4">
          <h1 className="text-xl">Forum</h1>
        </div>
      </div>
      <div id="forumList">
        {/* {forumList.map((forum) => (
        ))} */}
      </div>
    </div>
  );
}

export default Forum;
