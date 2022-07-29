import Cookies from "js-cookie";
import API from "../../api/api";
import React, { useEffect, useState } from "react";
import { UserProfile } from "../../lib/types";
import { userBaseFind } from "../../api/serverConfig";
import { UserCircleIcon } from "@heroicons/react/solid";
import _ from "lodash";
import { NavLink } from "react-router-dom";

function ProfilePreview() {
	const [user, setUser] = useState<UserProfile>({} as UserProfile);
	const [isUser, setIsUser] = useState(false);

	useEffect(() => {
		const userId = Cookies.get("userId");
		if (userId) {
			API.Request(`${userBaseFind}/${userId}`, "GET", {}, false).then(
				(res) => {
					setUser(res.data);
				}
			);
		}
	}, [Cookies.get("userId")]);

	useEffect(() => {
		setIsUser(!_.isEmpty(user));
	}, [user]);

	return (
		<div className="flex flex-col mt-20 px-10">
			<div
				className={`${
					isUser
						? "bg-white text-slate-800"
						: "bg-slate-800 text-white"
				} shadow-2xl rounded-2xl flex flex-col items-center p-4`}
			>
				{user?.image ? (
					<img
						src={user.image}
						alt="profile"
						className="w-32 h-32 rounded-full"
					/>
				) : (
					<UserCircleIcon className="w-32 h-32 opacity-50" />
				)}
				{isUser ? (
					<div className="flex flex-col space-y-2 items-center w-full">
						<h1 className="text-lg">{user?.username}</h1>
						<h2 className="text-md opacity-50">{user?.email}</h2>
						<p className="">{user?.description}</p>
					</div>
				) : (
					<div className="flex flex-col space-y-2 items-center w-full">
						<h1 className="text-lg">Anonymous</h1>
						<NavLink to="/login" className="w-full">
							<button
								type="button"
								className="text-md bg-sky-800 rounded-lg w-full p-2"
							>
								Sign in
							</button>
						</NavLink>
						<p className="text-xs">or</p>
						<NavLink to="/signup">
							<p className="">Sign up</p>
						</NavLink>
					</div>
				)}
			</div>
		</div>
	);
}

export default ProfilePreview;
