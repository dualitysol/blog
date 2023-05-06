// const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;

export default {
  emailRules: [
    (value = "") => {
      if (value) return true;

      return "The email is required and cannot be empty";
    },
    (value = "") => {
      if (/.+@.+\..+/.test(value)) return true;

      return "The email address is not valid";
    },
  ],
  passwordRules: [
    (value = "") => !!value || "The Password is required and cannot be empty",
    // (value = "") => {
    //   return (
    //     pattern.test(value) ||
    //     "Min. 8 characters with at least one capital letter, a number and a special character."
    //   );
    // },
  ],
  usernameRules: [
    (value = "") => !!value || "The username is required and cannot be empty",
  ],
};
