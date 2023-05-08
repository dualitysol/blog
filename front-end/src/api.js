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

export async function forgotPassword(email) {
  const {
    data: { message },
  } = await axios.post("/user/forgot-password", { email });
  return message;
}

export async function getProfileById(profileId) {
  const { data: profile } = await axios.get("/user/" + profileId);
  return profile;
}

export async function saveProfileInfo(
  profileId,
  { firstName, lastName, age, gender, address, website }
) {
  const {
    data: { message },
  } = await axios.patch("/user/" + profileId, {
    firstName,
    lastName,
    age,
    gender,
    address,
    website,
  });

  return message;
}

export default {
  setToken,
  register,
  login,
  forgotPassword,
  getProfileById,
};
