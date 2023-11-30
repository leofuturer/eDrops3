import {
	ChevronDownIcon,
	PencilIcon,
	ArrowDownOnSquareIcon
} from "@heroicons/react/24/solid";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Post, Project, User, UserProfile, api } from "@edroplets/api";
import PostPreview from "@/components/forum/PostPreview";
import ProfileEdit from "@/components/profile/ProfileEdit";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ProjectPreview from "@/components/project/ProjectPreview";
import { useCookies } from "react-cookie";

export function Profile(): JSX.Element {
	const [user, setUser] = useState<User>({} as User);
	const [feedData, setFeedData] = useState<Post[] | Project[]>([]);
	const [feed, setFeed] = useState<"Projects" | "Questions">("Projects");
	const [feedType, setFeedType] = useState<"Activity" | "Saved">("Activity");
	const [dropdown, setDropdown] = useState<boolean>(false);
	const [edit, setEdit] = useState<boolean>(false);

	const { id } = useParams();
	const navigate = useNavigate();

	const [cookies] = useCookies(["userId"]);

	// If looking for a specific user (e.g. /profile/:id) then set the userId to the id, otherwise set it to the current user
	useEffect(() => {
		const userId = id ? id : cookies.userId;
		api.user.get(userId).then((res) => {
			setUser(res);
		});
	}, [id]);

	// Object mapping feed types to their respective API calls
	// const FEED = {
	// 	Projects: {
	// 		Activity: userProjects,
	// 		Saved: userSavedProjects,
	// 	},
	// 	Questions: {
	// 		Activity: userPosts,
	// 		Saved: userSavedPosts,
	// 	},
	// };
	// Get feed data from API
	useEffect(() => {
		if(!cookies.userId) navigate("/login")
		if(feed === "Projects") {
			if(feedType === "Activity") {
				api.user.getProjects(user.id).then((res) => {
					setFeedData(res);
				});
			} else if (feedType === "Saved"){
				api.user.getSavedProjects(user.id).then((res) => {
					setFeedData(res);
				});
			}
		}
		else if (feed === "Questions") {
			if(feedType === "Activity") {
				api.user.getPosts(user.id).then((res) => {
					setFeedData(res);
				});
			} else if (feedType === "Saved") {
				api.user.getSavedPosts(user.id).then((res) => {
					setFeedData(res);
				});
			}
		}
	}, [feedType, feed]);

	function handleFeedType(feedType: "Activity" | "Saved") {
		setFeedType(feedType);
		setDropdown(false);
	}

	function handleFeed(type: "Projects" | "Questions") {
		setFeed(type);
	}

	return (
		<section className="grid grid-cols-3 min-h-full bg-slate-200">
			<div className="sticky top-[80px] h-[calc(100vh-80px)] flex flex-col bg-white shadow-2xl items-center justify-center">
				{user.id === cookies.userId && (
					<div
						className="absolute top-4 right-4 cursor-pointer"
						onClick={() => setEdit(!edit)}
					>
						{edit ? (
							<ArrowDownOnSquareIcon className="h-6 w-6" />
						) : (
							<PencilIcon className="h-6 w-6" />
						)}
					</div>
				)}
				{edit && user.id === cookies.userId ? (
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
				<div className="flex flex-col space-y-4">
					{feed === "Projects"
						? feedData.map((project) => (
								<ProjectPreview
									project={project}
									key={project.id}
								/>
						  ))
						: feedData.map((post) => (
								<PostPreview
									post={post}
									key={post.id}
								/>
						  ))}
				</div>
			</div>
		</section>
	);
}

export default Profile;
