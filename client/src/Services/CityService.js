import axios from "axios";

export default {
  getCity: () => {
    return axios
      .get("/api/city/getCity")
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
  getCityById: (variable) => {
    return axios
      .post("/api/city/getCityByID", variable)
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
