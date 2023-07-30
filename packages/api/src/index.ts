import { admin } from "./admin";
import { customer } from "./customer";
import { file } from "./file";
import { order } from "./order";
import { post } from "./post";
import { product } from "./product";
import { project } from "./project";
import { user } from "./user";
import { worker } from "./worker";
export { request } from "./lib/api";

type APIEndpoints = {
  product: typeof product;
  project: typeof project;
  customer: typeof customer;
  admin: typeof admin;
  file: typeof file;
  worker: typeof worker;
  user: typeof user;
  order: typeof order;
  post: typeof post;
}

export const api: APIEndpoints = {
  product,
  project,
  customer,
  admin,
  file,
  worker,
  user,
  order,
  post
};
