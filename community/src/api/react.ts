import {
	userLikedPosts,
	userLikedProjects,
	userSavedPosts,
	userSavedProjects,
} from "./serverConfig";
import API from "./api";

const ENDPOINTS = {
	Post: {
		Save: userSavedPosts,
		Like: userLikedPosts,
	},
	Project: {
		Save: userSavedProjects,
		Like: userLikedProjects,
	},
};

export async function react(
	type: "Post" | "Project",
	action: "Save" | "Like",
	userId: string,
	itemId: number
): Promise<boolean> {
	const URL = `${ENDPOINTS[type][action].replace("id", userId)}/${itemId}`;
	return API.Request(URL, "GET", {}, true)
		.then(async (res) => {
			if (res.data) {
				const res_1 = await API.Request(URL, "DELETE", {}, true);
        return false;
			} else {
				const res_2 = await API.Request(URL, "POST", {}, true);
        return true;
			}
		})
}

export async function checkReact(
	type: "Post" | "Project",
	action: "Save" | "Like",
	userId: string,
	itemId: number
): Promise<boolean> {
	const URL = `${ENDPOINTS[type][action].replace("id", userId)}/${itemId}`;
	return API.Request(URL, "GET", {}, true)
		.then(async (res) => {
			if (res.data) {
				return true;
			} else {
				return false;
			}
		})
}