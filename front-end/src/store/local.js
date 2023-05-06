export const storeCredentials = (token, userData) => {
  token && localStorage.setItem("token", token);
  localStorage.setItem("user_email", userData.email);
  localStorage.setItem("user_id", userData.id);
  localStorage.setItem("user_username", userData.username);
  localStorage.setItem("user_avatar", userData.avatar || "");
};

export const getToken = () => localStorage.getItem("token");

export const clearLocalStorage = () => localStorage.clear();

export const getLocalUserData = () => {
  const email = localStorage.getItem("user_email");
  const id = localStorage.getItem("user_id");
  const username = localStorage.getItem("user_username");
  const avatar = localStorage.getItem("user_avatar");

  if (!email || !id) return null;

  return {
    id,
    username,
    email,
    avatar,
  };
};
