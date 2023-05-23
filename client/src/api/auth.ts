import request from "./lib/api";
import { customer, user } from "./lib/newServerConfig";

export function login(username: string, password: string): Promise<boolean> {
  const data = (/@/.test(username)) ? {
    email: username,
    password: password,
  } : {
    username: username,
    password: password,
  };
  return request(user.login, 'POST', data, false)
    .then((res) => {
      return res.status === 200;
    }).catch((err) => {
      // console.error(err);
      if (err.response.status === 401) {
      }
      return false;
    });
}

// Only customers signup through the website (admins and workers are created by the admin)
export function signup(username: string, password: string, email: string): Promise<boolean> {
  const data = {
    username: username,
    password: password,
    email: email,
  };
  return request(customer.get, 'POST', data, false)
    .then((res) => {
      return res.status === 200;
    }).catch((err) => {
      // console.error(err);
      if (err.response.status === 401) {
      }
      return false;
    });
}

export function verifyEmail(){

}

export { }
// TODO: add auth api call wrappers