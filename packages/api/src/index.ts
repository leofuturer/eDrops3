import { admin } from "./admin";
import { customer } from "./customer";
import { file } from "./file";
import { order } from "./order";
import { post } from "./post";
import { comment } from "./comment";
import { product } from "./product";
import { project } from "./project";
import { projectFile } from "./project-file";
import { user } from "./user";
import { worker } from "./worker";
export { request } from "./lib/api";
export type * from "./lib/types";

type APIEndpoints = {
  product: typeof product;
  project: typeof project;
  projectFile: typeof projectFile;
  customer: typeof customer;
  admin: typeof admin;
  file: typeof file;
  worker: typeof worker;
  user: typeof user;
  order: typeof order;
  post: typeof post;
  comment: typeof comment;
}

export const api: APIEndpoints = {
  product,
  project,
  projectFile,
  customer,
  admin,
  file,
  worker,
  user,
  order,
  post,
  comment,
};
