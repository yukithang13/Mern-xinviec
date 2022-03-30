import axios from "axios";

export default {
  login: (user) => {
    return axios
      .post("/api/account/login", user)
      .then((res) => {
        if (res.status !== 401) {
          return res.data;
        } else {
          return {
            isAuthenticated: false,
            user: { username: "", role: "" },
            message: { msgBody: "Error", msgError: true },
          };
        }
      })
      .catch((err) => {
        return {
          message: {
            msgBody: "Sai tài khoản hoặc mật khẩu",
            msgError: true,
          },
        };
      });
  },
  register: (user) => {
    return axios
      .post("/api/account/register", user)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return {
          message: {
            msgBody: "Tạo tài khoản không thành công",
            msgError: true,
          },
          err,
        };
      });
  },
  logout: () => {
    return axios.get("/api/account/logout").then((res) => {
      return res.data;
    });
  },
  isAuthenticated: () => {
    return fetch("/api/account/authenticated").then((res) => {
      if (res.status !== 401) return res.json().then((data) => data);
      else {
        return { isAuthenticated: false, user: { username: "", role: "" } };
      }
    });
  },
};
