import axios from "axios";

export default {
  getCareer: () => {
    return axios
      .get("/api/career/getCareer")
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
  getCareerById: (variable) => {
    return axios
      .post("/api/career/getCareerByID", variable)
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
