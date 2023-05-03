import axios from "axios";

axios.defaults.baseURL = "http://localhost:3001/";

/**
 * @param { VueContext }
 * @param { AxiosError }
 * @return { viod }
 */
export const initErrorHandler = ({ $router: router, $store: store }, error) => {
  if (error.response?.status === 401) {
    store.dispatch("logOut");
    return;
  }
  if (error.response?.status === 403) return router.push("forbidden");
  if (error.response?.status === 404) return router.push("not-found");
  store.dispatch("handleAxiosError", error);
};

export function setToken(token = "") {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export async function register(username, email, password) {
  const {
    data: { userData, token },
  } = await axios.post("/user/signup", {
    username,
    email,
    password,
  });
  return { userData, token };
}

export default {
  setToken,
  register,
};
