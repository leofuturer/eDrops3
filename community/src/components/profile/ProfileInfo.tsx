import { api, DTO, UserProfile } from "@edroplets/api";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import Cookies from "js-cookie";
import { useState } from "react";
import { useCookies } from "react-cookie";

function ProfileInfo({ user }: { user: DTO<UserProfile> }) {
	const [following, setFollowing] = useState<boolean>(false);

	const [cookies] = useCookies(["userId"]);

	function handleFollow() {
		// Set self as follower of user
		api.user.follow(user.id as string, cookies.userId).then((isFollowing) => {
			setFollowing(isFollowing);
		});
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
					className={`${following
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
