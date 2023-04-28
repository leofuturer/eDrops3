import request from "./lib/api";
import { userLogin } from "./lib/serverConfig";

export function login(username: string, password: string): Promise<boolean> {
  const data = (/@/.test(username)) ? {
    email: username,
    password: password,
  } : {
    username: username,
    password: password,
  };
  return request(userLogin, 'POST', data, false)
    .then((res) => {
      return res.status === 200;
    }).catch((err) => {
      // console.error(err);
      if (err.response.status === 401) {
      }
      return false;
    });
}

export function signup(username: string, password: string, email: string): Promise<boolean> {
  const data = {
    username: username,
    password: password,
    email: email,
  };
  return request(userLogin, 'POST', data, false)
    .then((res) => {
      return res.status === 200;
    }).catch((err) => {
      // console.error(err);
      if (err.response.status === 401) {
      }
      return false;
    });
}

export { }
// TODO: add auth api call wrappers