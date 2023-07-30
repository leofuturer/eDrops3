import request from "./lib/api";
import {
	userFollowers,
	userLikedPosts,
	userLikedProjects,
	userSavedPosts,
	userSavedProjects,
} from "./serverConfig";

// Object containing endpoints for reacts
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

/** React to a post or project with a save or like
 * 		@param {string} type - "Post" or "Project"
 * 		@param {string} action - "Save" or "Like"
 * 		@param {string} userId - The user's id
 * 		@param {string} itemId - The id of the post or project
 *    @returns {boolean} - Whether the post is liked/saved or not after the action is completed
 */
export async function react(
	type: "Post" | "Project",
	action: "Save" | "Like",
	userId: string,
	itemId: number
): Promise<boolean> {
	const URL = `${ENDPOINTS[type][action].replace("id", userId)}/${itemId}`;
	return request(URL, "GET", {}).then(async (res) => {
		if (res.data) {
			const res_1 = await request(URL, "DELETE", {});
			return false;
		} else {
			const res_2 = await request(URL, "POST", {});
			return true;
		}
	});
}

/**
 * Check if a post or project is liked/saved by a user
 * @param type - "Post" or "Project"
 * @param action - "Save" or "Like"
 * @param userId	- The user's id
 * @param itemId	- The id of the post or project
 * @returns {Promise<boolean>} - Whether the post is liked/saved or not after the action is completed
 */
export async function checkReact(
	type: "Post" | "Project",
	action: "Save" | "Like",
	userId: string,
	itemId: number
): Promise<boolean> {
	const URL = `${ENDPOINTS[type][action].replace("id", userId)}/${itemId}`;
	return request(URL, "GET", {}).then(async (res) => {
		if (res.data) {
			return true;
		} else {
			return false;
		}
	});
}

/** Follow a user
 * 		@param {string} userId - The user's id (other user)
 * 		@param {string} followerId - The id of the follower (current user)
 *    @returns {boolean} - Whether the user is followed or not after the action is completed
 */
export async function follow(
	userId: string,
	followerId: string
): Promise<boolean> {
	const URL = `${userFollowers
		.replace("id", userId)
		.replace("followerId", followerId)}`;
	return request(URL, "GET", {}).then(async (res) => {
		if (res.data) {
			const res_1 = await request(URL, "DELETE", {});
			return false;
		} else {
			const res_2 = await request(URL, "POST", {});
			return true;
		}
	});
}
