import axios from "axios";

export default {
  createCV: (variable) => {
    return axios
      .post("/api/cv/createCV", variable)
      .then((res) => {
        if (res.status !== 401) {
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
            msgBody: "Gửi thông tin không thành công",
            msgError: true,
          },
          err,
        };
      });
  },
  loadCV: (variable) => {
    return axios
      .post("/api/cv/getCV", variable)
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
            msgBody: "Gửi thông tin không thành công",
            msgError: true,
          },
          err,
        };
      });
  },
  loadCVReceiverTrue: (page) => {
    return axios
      .post(`/api/cv/getCVByReceiverTrue?page=${page}`)
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
            msgBody: "Gửi thông tin không thành công",
            msgError: true,
          },
          err,
        };
      });
  },
  loadCVReceiverFalse: (page) => {
    return axios
      .post(`/api/cv/getCVByReceiverFalse?page=${page}`)
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
            msgBody: "Gửi thông tin không thành công",
            msgError: true,
          },
          err,
        };
      });
  },
  loadDetailsCV: (variable) => {
    return axios
      .post("/api/cv/detailsCV", variable)
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
            msgBody: "Gửi thông tin không thành công",
            msgError: true,
          },
          err,
        };
      });
  },
  updateStatusCV: (variable) => {
    return axios
      .post("/api/cv/updateStatusCV", variable)
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
            msgBody: "Cập nhật không thành công",
            msgError: true,
          },
          err,
        };
      });
  },
  deleteCV: (variable) => {
    return axios
      .post("/api/cv/deleteCV", variable)
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
            msgBody: "Xoá không thành công",
            msgError: true,
          },
          err,
        };
      });
  },
};
