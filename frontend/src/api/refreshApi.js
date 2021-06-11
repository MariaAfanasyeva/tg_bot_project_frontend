export const refresh = () => {
  const refresh_token = localStorage.getItem("refresh_token");
  const data = {
    refresh: refresh_token,
  };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(data),
  };
  fetch(process.env.REACT_APP_URL_AWS + "/api/token/refresh/", options)
    .then((res) => res.json())
    .then((result) => {
      if (result.code === "token_not_valid") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      } else {
        localStorage.setItem("access_token", result.access);
      }
    });
};
