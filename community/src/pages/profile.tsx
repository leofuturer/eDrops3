import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { userBaseFind } from "../api/serverConfig";
import API from "../api/api";
import {
	ChevronDownIcon,
	ChevronUpIcon,
	PencilIcon,
	SaveIcon,
	UserCircleIcon,
} from "@heroicons/react/solid";
import ProfileInfo from "../components/profile/ProfileInfo";
import ProfileEdit from "../components/profile/ProfileEdit";
import { UserProfile } from "../lib/types";

function Profile(): JSX.Element {
	const [user, setUser] = useState<UserProfile>({} as UserProfile);
	const [feed, setFeed] = useState<"Projects" | "Questions">("Projects");
	const [feedType, setFeedType] = useState<"Activity" | "Saved">("Activity");
	const [dropdown, setDropdown] = useState<boolean>(false);
	const [edit, setEdit] = useState<boolean>(false);

	const { id } = useParams();

	// If looking for a specific user (e.g. /profile/:id) then set the userId to the id, otherwise set it to the current user
	useEffect(() => {
		const userId = id ? id : Cookies.get("userId");
		API.Request(`${userBaseFind}/${userId}`, "GET", {}, false).then(
			(res) => {
				setUser(res.data);
			}
		);
	}, [id]);

	// TODO: Setup API endpoint to retrieve a user's projects (in order to get count and list)

	function handleFeedType(feedType: "Activity" | "Saved") {
		setFeedType(feedType);
		setDropdown(false);
	}

	function handleFeed(type: "Projects" | "Questions") {
		setFeed(type);
	}

	return (
		<section className="grid grid-cols-3 h-full bg-slate-200">
			<div className="relative flex flex-col h-full bg-white shadow-2xl items-center justify-center">
				<div
					className="absolute top-4 right-4 cursor-pointer"
					onClick={() => setEdit(!edit)}
				>
					{edit ? (
						<SaveIcon className="h-6 w-6" />
					) : (
						<PencilIcon className="h-6 w-6" />
					)}
				</div>
				{edit ? (
					<ProfileEdit user={user} />
				) : (
					<ProfileInfo user={user} />
				)}
			</div>
			<div className="col-span-2 flex flex-col px-10">
				<div className="relative flex flex-row p-10 justify-around">
					<div
						className="relative w-32 flex flex-row bg-white shadow-2xl hover:bg-gray-300 justify-center items-center"
						onClick={() => setDropdown(!dropdown)}
					>
						<p className="py-2 text-xl">{feedType}</p>
						<ChevronDownIcon className="absolute right-2 h-4 w-4" />
						<div
							className={`absolute top-0 w-32 flex flex-col bg-white shadow-2xl ${
								dropdown ? "visible" : "invisible"
							}`}
						>
							<p
								className="py-2 w-full text-xl text-center hover:bg-gray-300"
								onClick={() => handleFeedType("Activity")}
							>
								Activity
							</p>
							<p
								className="py-2 w-full text-xl text-center hover:bg-gray-300"
								onClick={() => handleFeedType("Saved")}
							>
								Saved
							</p>
						</div>
					</div>

					<div className="flex flex-row space-x-4">
						<div
							className={`py-2 px-4 justify-center items-center rounded-3xl ${
								feed === "Projects"
									? "bg-sky-800 text-white"
									: ""
							}`}
							onClick={() => handleFeed("Projects")}
						>
							<p className="text-xl text-center">Projects</p>
						</div>
						<div
							className={`py-2 px-4 justify-center items-center rounded-3xl ${
								feed === "Questions"
									? "bg-sky-800 text-white"
									: ""
							}`}
							onClick={() => handleFeed("Questions")}
						>
							<p className="text-xl text-center">Questions</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default Profile;
