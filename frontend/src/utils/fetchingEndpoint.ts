const baseURL = {
  devLocal: "http://localhost:6900/",
  devContainer: "http://dev_incexp_backend:6900/", // doesn't work because docker-network isn't exposed to browser
  prod: "/",
};
export const backendURL = baseURL.devLocal;
