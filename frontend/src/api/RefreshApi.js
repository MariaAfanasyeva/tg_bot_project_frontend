export const refresh = () => {
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
