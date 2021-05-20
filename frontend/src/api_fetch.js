import jwt from "jsonwebtoken";

export const login = (data) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(data),
  };
  return fetch("http://127.0.0.1:8000/api/token/", options).then((res) =>
    res.json()
  );
};

export const register = (data) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(data),
  };
  return fetch("http://127.0.0.1:8000/auth/users/", options);
};

const refresh = () => {
  const data = {
    refresh: localStorage.getItem("refresh_token"),
  };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(data),
  };
  return fetch("http://127.0.0.1:8000/api/token/refresh/", options)
    .then((res) => res.json())
    .then((result) => {
      localStorage.setItem("access_token", result.access);
    });
};

export const api = (method, url, login_required) => {
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
      },
      mode: "cors",
    };
  }
  return fetch(url, options);
};
