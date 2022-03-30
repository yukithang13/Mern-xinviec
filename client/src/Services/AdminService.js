import axios from "axios";

export default {
  loadAccout: (pageNumber) => {
    return axios
      .get("/api/admin/getAccount?page=" + pageNumber)
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
            msgBody: "Lỗi!!!!",
            msgError: true,
          },
          err,
        };
      });
  },
  loadAccoutAll: () => {
    return axios
      .get("/api/admin/getAccountAll")
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
            msgBody: "Lỗi!!!!",
            msgError: true,
          },
          err,
        };
      });
  },
  searchAcc: (variable) => {
    return axios
      .post("/api/admin/searchAcc", variable)
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
            msgBody: "Lỗi!!!!",
            msgError: true,
          },
          err,
        };
      });
  },
  updateStatusAcc: (variable) => {
    return axios
      .post("/api/admin/updateStatusAcc", variable)
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
            msgBody: "Lỗi!!!!",
            msgError: true,
          },
          err,
        };
      });
  },
  loadRecruitmentTrue: (pageNumber) => {
    return axios
      .get(
        pageNumber !== undefined
          ? "/api/admin/getRecruitmentTrue?page=" + pageNumber
          : "/api/admin/getRecruitmentTrue"
      )
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
            msgBody: "Lỗi!!!!",
            msgError: true,
          },
          err,
        };
      });
  },
  loadRecruitmentFalse: (pageNumber) => {
    return axios
      .get("/api/admin/getRecruitmentFalse?page=" + pageNumber)
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
            msgBody: "Lỗi!!!!",
            msgError: true,
          },
          err,
        };
      });
  },
  updateStatusRcm: (variable) => {
    return axios
      .post("/api/admin/updateStatusRecruitment", variable)
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
            msgBody: "Lỗi!!!!",
            msgError: true,
          },
          err,
        };
      });
  },
};
