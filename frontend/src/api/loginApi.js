export const login = (data) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(data),
  };
  return fetch(process.env.REACT_APP_URL_AWS + "/token", options).then((res) =>
    res.json()
  );
};
