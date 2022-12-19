import { UserCircleIcon } from "@heroicons/react/solid";
import Cookies from "js-cookie";
import { useState } from "react";
import { follow } from "../../api/react";
import { UserProfileType } from "../../lib/types";

function ProfileInfo({ user }: { user: UserProfileType }) {
	const [following, setFollowing] = useState<boolean>(false);

	function handleFollow() {
		// console.log(user.id, Cookies.get("userId"));
		follow(user.id as string, Cookies.get("userId") as string).then(
			(isFollowing: boolean) => {
				setFollowing(isFollowing);
			}
		);
	}

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
			{user?.id !== Cookies.get("userId") && (
				<button
					type="button"
					className={`${
						following
							? "bg-white text-sky-700"
							: "bg-sky-700 text-white"
					} border border-sky-700 rounded-lg px-4 py-2 mt-4`}
					onClick={handleFollow}
				>
					{following ? <p>Unfollow</p> : <p>Follow</p>}
				</button>
			)}
		</>
	);
}

export default ProfileInfo;
