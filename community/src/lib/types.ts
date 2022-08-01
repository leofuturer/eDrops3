export interface ProjectType {
	id?: number;
	title: string;
	content: string;
	author: string;
	datetime: Date;
	likes: number;
}

export interface PostType {
	id?: number;
	title: string;
	content: string;
	author: string;
	datetime: Date;
	likes: number;
}

export interface UserProfile {
	image: string;
	username: string;
	email: string;
	description: string;
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
