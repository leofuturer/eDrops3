export interface ProjectType {
  id: number;
  title: string;
  content: string;
  author: string;
  datetime: Date;
  likes: number;
}

export interface ForumType {
    id: number;
    parentId: number;
    title: string;
    content: string;
    author: string;
    datetime: Date;
    likes: number;
}