import React, { useEffect, useState } from "react";
import { api, User, UserProfile } from "@edroplets/api";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import _ from "lodash";
import { NavLink } from "react-router-dom";
import { useCookies } from "react-cookie";
import ProfilePreviewLoad from "./ProfilePreviewLoad";

function ProfilePreview() {
	const [user, setUser] = useState<User>({} as User);
	const [loading, setLoading] = useState(true);
	const [isUser, setIsUser] = useState(false);

	const [cookies] = useCookies(["userId"]);

	useEffect(() => {
		if (cookies.userId) {
			api.user.get(cookies.userId).then((res) => {
				setUser(res);
			}).finally(() => {
				setLoading(false);
			});
		}
		else {
			setLoading(false);
		}
	}, [cookies.userId]);

	useEffect(() => {
		// console.log(user);
		setIsUser(!_.isEmpty(user));
	}, [user]);

	if (loading) return <ProfilePreviewLoad />

	return (
		<div className="flex flex-col mt-20 px-10">
			<div
				className={`${isUser
					? "bg-white text-slate-800"
					: "bg-slate-800 text-white"
					} shadow-2xl rounded-2xl flex flex-col items-center p-4`}
			>
				{/* {user?.image ? (
					<img
						src={user.image}
						alt="profile"
						className="w-32 h-32 rounded-full"
					/>
				) : ( */}
					<UserCircleIcon className="w-32 h-32 opacity-50" />
				{/* )} */}
				{isUser ? (
					<div className="flex flex-col space-y-2 items-center w-full">
						<h1 className="text-lg">{user?.username}</h1>
						<h2 className="text-md opacity-50">
							{/* {user?.email} */}
						</h2>
						{/* <p className="">{user?.bio}</p> */}
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
						<div className="flex flex-row items-center w-full">
							<span className="flex-grow border-t border-white" />
							<span className="flex-shrink mx-4 text-xs text-white">
								or
							</span>
							<span className="flex-grow border-t border-white" />
						</div>
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
