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
