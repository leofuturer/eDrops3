/**
 * Backend API entry points
 */
const ApiRootUrl = "";

export const posts = `${ApiRootUrl}/posts`;
export const post = `${ApiRootUrl}/posts/id`;
export const postComments = `${ApiRootUrl}/posts/id/postComments`;
export const postCommentComments = `${ApiRootUrl}/postComments/id/postComments`;
export const featuredPosts = `${ApiRootUrl}/posts/featured`;
export const userPosts = `${ApiRootUrl}/users/id/posts`;
export const userSavedPosts = `${ApiRootUrl}/users/id/savedPosts`;
export const userLikedPosts = `${ApiRootUrl}/users/id/likedPosts`;

export const projects = `${ApiRootUrl}/projects`;
export const project = `${ApiRootUrl}/projects/id`;
export const projectComments = `${ApiRootUrl}/projects/id/projectComments`;
export const projectCommentComments = `${ApiRootUrl}/projectComments/id/projectComments`;
export const projectFiles = `${ApiRootUrl}/users/id/projectFiles`;
export const projectLinks = `${ApiRootUrl}/projects/id/project-links`;
export const featuredProjects = `${ApiRootUrl}/projects/featured`;
export const userProjects = `${ApiRootUrl}/users/id/projects`;
export const userSavedProjects = `${ApiRootUrl}/users/id/savedProjects`;
export const userLikedProjects = `${ApiRootUrl}/users/id/likedProjects`;

export const users = `${ApiRootUrl}/users`;
export const user = `${ApiRootUrl}/users/id`;
export const userFollowers = `${ApiRootUrl}/users/id/followers/followerId`;
export const userLogin = `${ApiRootUrl}/users/login`;
export const userLogout = `${ApiRootUrl}/users/logout`;
export const userForgetPass = `${ApiRootUrl}/users/reset`;
export const userChangePass = `${ApiRootUrl}/users/changePassword`;
export const userResetPass = `${ApiRootUrl}/users/resetPassword`;
export const userCredsTaken = `${ApiRootUrl}/users/credsTaken`;