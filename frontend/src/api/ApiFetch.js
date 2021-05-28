import jwt from "jsonwebtoken";
import { refresh } from "./RefreshApi";

export const api = (method, url, login_required, data = null) => {
  if (localStorage.getItem("access_token") !== null) {
    const token = localStorage.getItem("access_token");
    const decodedToken = jwt.decode(token);
    let dateNow = new Date();
    if (decodedToken.exp < dateNow.getTime() / 1000) {
      refresh();
    }
  }

  const access_token =
    localStorage.getItem("access_token") !== null
      ? "Bearer " + localStorage.getItem("access_token")
      : null;
  let options = "";
  if (login_required === true) {
    if (method === "GET") {
      options = {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: access_token,
        },
        mode: "cors",
      };
    } else {
      options = {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: access_token,
        },
        mode: "cors",
        body: JSON.stringify(data),
      };
    }
  } else {
    if (method === "GET") {
      options = {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: access_token,
        },
        mode: "cors",
      };
    } else {
      options = {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: access_token,
        },
        mode: "cors",
        body: JSON.stringify(data),
      };
    }
  }
  return fetch(url, options);
};
