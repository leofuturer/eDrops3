import {
	ArrowLeftOnRectangleIcon as ArrowLeftOnRectangleIconOutline,
	ArrowRightOnRectangleIcon as ArrowRightOnRectangleIconOutline,
	Bars3BottomRightIcon,
	Bars3Icon,
	ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconOutline,
	FolderOpenIcon as FolderOpenIconOutline,
	UserIcon as UserIconOutline,
	UserPlusIcon as UserPlusIconOutline,
	XMarkIcon,
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
import { api } from "@edroplets/api";
import { useCookies } from "react-cookie";

export function NavTop() {
	const navigate = useNavigate();
	const location = useLocation();
	const [notLoggedIn, setNotLoggedIn] = useState(true);
	const [path, setPath] = useState("");
	const [showNav, setShowNav] = useState(false);

	const [cookies, setCookie, removeCookie] = useCookies(["userId", "userType", "username", "access_token"]);

	useEffect(() => {
		setPath(location.pathname);
	}, [location]);

	useEffect(() => {
		setNotLoggedIn(!cookies.userId);
	}, [cookies.userId]);

	function handleLogout() {
		// signout().then(() => navigate("/home"));
		removeCookie("userId", { path: "/" });
		removeCookie("userType", { path: "/" });
		removeCookie("username", { path: "/" });
		removeCookie("access_token", { path: "/" });
		navigate("/login");
	}

	function showNavRight() {
		setShowNav(!showNav);
	}

	return (
		<div className="">
			<header className="flex flex-row items-center bg-sky-800 h-[80px] w-full text-white px-10 md:px-20 lg:px-32 justify-between">
				<div id="navLeft">
					<NavLink
						to="/"
						className="flex flex-row items-center justify-center"
					>
						<h1 className="hidden lg:block text-2xl">eDroplets Community</h1>
						<img
							src="/img/edroplets-logo-inverted.png"
							alt="eDroplets Logo"
							className="max-h-[50px] shrink-0"
						/>
					</NavLink>
				</div>
				<div id="navRightCompact" className={`md:hidden ${showNav && 'hidden'}`}>
					<Bars3Icon className="h-10 w-10" onClick={showNavRight} />
				</div>
				<div className={`${showNav ? 'absolute' : 'hidden'} right-0 top-0 h-screen w-full px-8 py-5 bg-primary/95 transition-all `}>
					<div className="flex justify-end">
						<Bars3BottomRightIcon className="h-10 w-10" onClick={showNavRight} />
					</div>
					<div className="flex flex-col items-center space-y-4 text-xl">
						<NavLink to="/projects" onClick={showNavRight}>
							<div className="flex flex-row space-x-2 items-center">
								{path === "/projects" ? <FolderOpenIcon className="h-10 w-10" /> : <FolderOpenIconOutline className="h-10 w-10" />}
								<h1>Projects</h1>
							</div>
						</NavLink>
						<NavLink to="/forum" onClick={showNavRight}>
							<div className="flex flex-row space-x-2 items-center">
								{path === "/forum" ? <ChatBubbleLeftRightIcon className="h-10 w-10" /> : <ChatBubbleLeftRightIconOutline className="h-10 w-10" />}
								<h1>Forum</h1>
							</div>
						</NavLink>
						{notLoggedIn ? (
							<>
								<NavLink to="/signup" onClick={showNavRight}>
									<div className="flex flex-row space-x-2 items-center">
										{path === "/signup" ? <UserPlusIcon className="h-10 w-10" /> : <UserPlusIconOutline className="h-10 w-10" />}
										<h1>Sign up</h1>
									</div>
								</NavLink>
								<NavLink to="/login" onClick={showNavRight}>
									<div className="flex flex-row space-x-2 items-center">
										{path === "/login" ? <ArrowLeftCircleIcon className="h-10 w-10" /> : <ArrowLeftOnRectangleIconOutline className="h-10 w-10" />}
										<h1>Sign in</h1>
									</div>
								</NavLink>
							</>
						) : (
							<>
								<NavLink to="/profile" onClick={showNavRight}>
									<div className="flex flex-row space-x-2 items-center">
										{path === "/profile" ? <UserIcon className="h-10 w-10" /> : <UserIconOutline className="h-10 w-10" />}
										<h1>{cookies.username}</h1>
									</div>
								</NavLink>
								<button type="button" onClick={() => {
									showNavRight();
									handleLogout();
								}}>
									<div className="flex flex-row space-x-2 items-center">
										<ArrowRightOnRectangleIconOutline className="h-10 w-10" />
										<h1>Sign out</h1>
									</div>
								</button>
							</>
						)}
					</div>
				</div>
				<div
					id="navRight"
					className="hidden md:flex flex-row items-center justify-center space-x-8"
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
									{path === "/signup" ? <UserPlusIcon className="h-6 w-6" /> : <UserPlusIconOutline className="h-6 w-6" />}
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
									<h1>{cookies.username}</h1>
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
