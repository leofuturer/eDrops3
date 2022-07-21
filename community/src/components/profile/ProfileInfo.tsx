import { UserCircleIcon } from "@heroicons/react/solid";
import React from "react";
import { UserProfile } from "../../lib/types";

function ProfileInfo({ user } : { user: UserProfile }) {
	return (
		<>
			{user?.image ? (
				<img
					src={user.image}
					alt="profile"
					className="w-32 h-32 rounded-full"
				/>
			) : (
				<UserCircleIcon className="w-32 h-32 text-slate-400" />
			)}
			<h1 className="text-lg">{user?.username}</h1>
			<h2 className="text-md opacity-50">{user?.email}</h2>
			<p className="">{user?.description}</p>
		</>
	);
}

export default ProfileInfo;
