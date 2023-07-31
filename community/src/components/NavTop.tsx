import {
	ArrowLeftOnRectangleIcon as ArrowLeftOnRectangleIconOutline,
	ArrowRightOnRectangleIcon as ArrowRightOnRectangleIconOutline,
	ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconOutline,
	FolderOpenIcon as FolderOpenIconOutline,
	UserIcon as UserIconOutline,
	UserPlusIcon as UserPlusIconOutline,
} from "@heroicons/react/24/outline";
import {
	ArrowLeftCircleIcon,
	ChatBubbleLeftRightIcon,
	FolderOpenIcon,
	UserIcon,
	UserPlusIcon
} from "@heroicons/react/24/solid";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "../../static/img/edrop_logo_inverted.png";
import { api } from "@edroplets/api";

function NavTop() {
	const navigate = useNavigate();
  const location = useLocation();
	const [notLoggedIn, setNotLoggedIn] = useState(true);
  const [path, setPath] = useState("");

  useEffect(() => {
    setPath(location.pathname);
  }, [location]);

	useEffect(() => {
		setNotLoggedIn(Cookies.get("username") ? false : true);
	}, [Cookies.get("username")]);

	function handleLogout() {
		// signout().then(() => navigate("/home"));
	}

	return (
		<div className="">
			<header className="flex flex-row items-center bg-sky-800 h-[80px] w-full text-white px-4 justify-between">
				<div id="navLeft">
					<NavLink
						to="/"
						className="flex flex-row items-center justify-center"
					>
						<h1 className="text-2xl">eDroplets Community</h1>
						<img
							src={logo}
							alt="eDroplets Logo"
							className="max-h-[50px]"
						/>
					</NavLink>
				</div>
				<div
					id="navRight"
					className="flex flex-row items-center justify-center space-x-8"
				>
					<NavLink to="/projects">
						<div className="flex flex-col items-center">
							{path === "/projects" ? <FolderOpenIcon className="h-6 w-6" /> : <FolderOpenIconOutline className="h-6 w-6" />}
							<h1>Projects</h1>
						</div>
					</NavLink>
					<NavLink to="/forum">
						<div className="flex flex-col items-center">
							{path === "/forum" ? <ChatBubbleLeftRightIcon className="h-6 w-6" /> : <ChatBubbleLeftRightIconOutline className="h-6 w-6" />}
							<h1>Forum</h1>
						</div>
					</NavLink>
					{notLoggedIn ? (
						<>
							<NavLink to="/signup">
								<div className="flex flex-col items-center">
									{path === "/signup" ?<UserPlusIcon className="h-6 w-6" /> : <UserPlusIconOutline className="h-6 w-6" />}
									<h1>Sign up</h1>
								</div>
							</NavLink>
							<NavLink to="/login">
								<div className="flex flex-col items-center">
                  {path === "/login" ? <ArrowLeftCircleIcon className="h-6 w-6" /> : <ArrowLeftOnRectangleIconOutline className="h-6 w-6" />}
									<h1>Sign in</h1>
								</div>
							</NavLink>
						</>
					) : (
						<>
							<NavLink to="/profile">
								<div className="flex flex-col items-center">
                  {path === "/profile" ? <UserIcon className="h-6 w-6" /> : <UserIconOutline className="h-6 w-6" />}
									<h1>{Cookies.get("username")}</h1>
								</div>
							</NavLink>
							<button type="button" onClick={handleLogout}>
								<div className="flex flex-col items-center">
                  <ArrowRightOnRectangleIconOutline className="h-6 w-6" />
									<h1>Sign out</h1>
								</div>
							</button>
						</>
					)}
				</div>
			</header>
		</div>
	);
}

export default NavTop;
