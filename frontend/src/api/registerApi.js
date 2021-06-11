export const register = (data) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(data),
  };
  return fetch(process.env.REACT_APP_URL_AWS + "/auth/users/", options);
};
