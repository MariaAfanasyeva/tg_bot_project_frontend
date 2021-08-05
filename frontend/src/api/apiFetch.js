import jwt from "jsonwebtoken";
import { refresh } from "./refreshApi";

export const api = (method, url, login_required, data = null) => {
  if (localStorage.getItem("access_token")) {
    const token = localStorage.getItem("access_token");
    if (token === "undefined") {
      localStorage.removeItem("access_token");
    } else {
      const decodedToken = jwt.decode(token);
      let dateNow = new Date();
      if (decodedToken.exp < dateNow.getTime() / 1000) {
        localStorage.removeItem("access_token");
      }
    }
  }

  const access_token = localStorage.getItem("access_token")
    ? "Bearer " + localStorage.getItem("access_token")
    : null;
  let options = {
    method: method,
    mode: "cors",
  };
  if (login_required === true) {
    if (method !== "GET") {
      options.headers = {
        "Content-Type": "application/json",
        Authorization: access_token,
      };
      options.body = JSON.stringify(data);
    }
  } else {
    if (method !== "GET") {
      options.body = JSON.stringify(data);
    }
  }
  return fetch(url, options);
};
