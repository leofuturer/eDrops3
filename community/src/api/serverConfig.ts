/**
 * Backend API entry points
 */
const ApiRootUrl = "/api";

export const posts = `${ApiRootUrl}/posts`;
export const post = `${ApiRootUrl}/posts/id`;
export const postComments = `${ApiRootUrl}/posts/id/postComments`;
export const commentCount = `${ApiRootUrl}/posts/id/commentCount`;
export const commentComments = `${ApiRootUrl}/postComments/id/postComments`;
export const featuredPosts = `${ApiRootUrl}/posts/featured`;
export const userPosts = `${ApiRootUrl}/users/id/posts`;
export const userSavedPosts = `${ApiRootUrl}/users/id/savedPosts`;
export const userLikedPosts = `${ApiRootUrl}/users/id/likedPosts`;

export const projects = `${ApiRootUrl}/projects`;
export const project = `${ApiRootUrl}/projects/id`;
export const featuredProjects = `${ApiRootUrl}/projects/featured`;
export const userProjects = `${ApiRootUrl}/users/id/projects`;
export const userSavedProjects = `${ApiRootUrl}/users/id/savedProjects`;
export const userLikedProjects = `${ApiRootUrl}/users/id/likedProjects`;

export const userSignUp = `${ApiRootUrl}/users`;
export const userBaseFind = `${ApiRootUrl}/users`;
export const userBaseDeleteById = `${ApiRootUrl}/users/id`;
export const updateUserBaseProfile = `${ApiRootUrl}/users/id`;
export const userLogin = `${ApiRootUrl}/users/login`;
export const userLogout = `${ApiRootUrl}/users/logout`;
export const userForgetPass = `${ApiRootUrl}/users/reset`;
export const userChangePass = `${ApiRootUrl}/users/change-password`;
export const userResetPass = `${ApiRootUrl}/users/reset-password`;
export const userCredsTaken = `${ApiRootUrl}/users/credsTaken`;