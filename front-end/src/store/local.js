export const storeCredentials = (token, userData) => {
  token && localStorage.setItem("token", token);
  localStorage.setItem("user_email", userData.email);
  localStorage.setItem("user_id", userData.id);
  localStorage.setItem("user_avatar", userData.avatar || "");
};

export const getLocalUserData = () => {
  const email = localStorage.getItem("user_email");
  const id = localStorage.getItem("user_id");
  const avatar = localStorage.getItem("user_avatar");

  if (!email || !id) return null;

  return {
    id,
    email,
    avatar,
  };
};
