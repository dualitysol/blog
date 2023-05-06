import axios from "axios";

axios.defaults.baseURL = "http://localhost:3001/";

/**
 * @param { VueContext }
 * @param { AxiosError }
 * @return { viod }
 */
export const initErrorHandler = ({ $store: store }, error) => {
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

export async function login(username, password) {
  const {
    data: { userData, token },
  } = await axios.post("/user/signin", {
    username,
    password,
  });
  return { userData, token };
}

export default {
  setToken,
  register,
  login,
};
