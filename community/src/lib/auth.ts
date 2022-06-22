import {
  AdminLogin,
  customerLogin,
  FoundryWorkerLogin,
  userLogin,
  customerLogout,
  AdminLogout,
  FoundryWorkerLogout,
  userLogout,
} from "../api/serverConfig";
import API from "../api/api";
import Cookies from "js-cookie";

async function login(username: string, password: string): Promise<void> {
  let data = {
    username: username,
    password: password,
  };
  return API.Request(userLogin, "POST", data, false)
    .then((res) => {
      Cookies.set("base_access_token", res.data.id);
      const { userType } = res.data;
      let url;
      if (userType === "customer") {
        url = customerLogin;
      } else if (userType === "admin") {
        url = AdminLogin;
      } else if (userType === "worker") {
        url = FoundryWorkerLogin;
      } else {
        console.error("Invalid user type");
        return;
      }
      API.Request(url, "POST", data, false)
        .then((res) => {
          // 4/23/2020: Always have cookies and local storage
          Cookies.set("access_token", res.data.id);
          Cookies.set("userId", res.data.userId);
          Cookies.set("userType", userType);
          Cookies.set("username", res.data.username);
        })
        .catch((err) => {
          console.error(err);
          if (err.response.status === 401) {
            // this.showErrorMessage();
          }
        });
      console.log("end");
    })
    .catch((err) => {
      console.error(err);
      if (err.response.status === 401) {
        // this.showErrorMessage();
      }
    });
}

async function signout(): Promise<void> {
  let url = "";
  if (Cookies.get("userType") === "admin") {
    url = AdminLogout;
  } else if (Cookies.get("userType") === "customer") {
    url = customerLogout;
  } else if (Cookies.get("userType") === "worker") {
    url = FoundryWorkerLogout;
  }
  Cookies.remove("userType");
  Cookies.remove("username");
  Cookies.remove("userId");
  return API.Request(url, "POST", {}, true)
    .then((res) => {
      Cookies.remove("access_token");
      API.Request(userLogout, "POST", {}, true).then((res) => {
        Cookies.remove("base_access_token");
      });
    })
    .catch((err) => {
      console.error(err);
    });
}

export { login, signout };
