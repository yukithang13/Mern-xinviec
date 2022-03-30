import axios from "axios";

export default {
  createProfile: (variable) => {
    return axios
      .post("/api/profile/createProfile", variable)
      .then((res) => {
        if (res.status !== 400) {
          return res.data;
        } else {
          return {
            message: {
              msgBody: "Error",
              msgError: true,
            },
          };
        }
      })
      .catch((err) => {
        return {
          message: {
            msgBody: "Lỗi!!!!",
            msgError: true,
          },
          err,
        };
      });
  },
  getProfile: () => {
    return axios
      .get("/api/profile/getProfile")
      .then((res) => {
        if (res.status !== 400) {
          return res.data;
        } else {
          return {
            message: {
              msgBody: "Error",
              msgError: true,
            },
          };
        }
      })
      .catch((err) => {
        return {
          message: {
            msgBody: "Lỗi!!!!",
            msgError: true,
          },
          err,
        };
      });
  },
  updateProfile: (variable) => {
    return axios
      .post("/api/profile/updateProfile", variable)
      .then((res) => {
        if (res.status !== 400) {
          return res.data;
        } else {
          return {
            message: {
              msgBody: "Error",
              msgError: true,
            },
          };
        }
      })
      .catch((err) => {
        return {
          message: {
            msgBody: "Lỗi!!!!",
            msgError: true,
          },
          err,
        };
      });
  },
};
