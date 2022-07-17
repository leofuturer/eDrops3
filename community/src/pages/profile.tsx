import React from "react";
import { useParams } from "react-router-dom";

function Profile() {
    const { id } = useParams();
    if(!id) {
        
    }
    return <div>{id}</div>;
}

export default Profile;
