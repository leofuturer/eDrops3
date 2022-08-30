import { Post, Project, UserProfile } from '../../../server/src/models'

export interface ProjectType extends Project {
	// id?: number;
	// title: string;
	// content: string;
	// author: string;
	// datetime: Date;
	// likes: number;
}

export interface PostType extends Post {
	// id?: number;
	// title: string;
	// content: string;
	// author: string;
	// datetime: Date;
	// likes: number;
}

export interface UserProfileType extends UserProfile {
	// image: string;
	// username: string;
	// email: string;
	// description: string;
}

export interface CommentType {
	id?: number;
	content: string;
	author: string;
	datetime: Date;
	likes: number;
	postId?: number;
	userId?: string;
}

export interface LoginInfo {
	username: string;
	password: string;
}


export interface SignupInfo {
	username: string;
	email: string;
	password: string;
	confirmPassword?: string;
}
