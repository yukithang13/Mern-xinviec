import axios from "axios";

export default {
  ImageUpload: (formData, config) => {
    return axios
      .post("/api/recruitment/uploadfiles", formData, config)
      .then((res) => {
        if (res.status !== 401) {
          return res.data;
        } else {
          return { message: { msgBody: "Error" }, msgError: true };
        }
      })
      .catch((err) => {
        return {
          message: {
            msgBody: "Thêm ảnh không thành công",
            msgError: true,
          },
        };
      });
  },
  deleteImageUpload: (variable) => {
    return axios
      .post("/api/recruitment/deleteImageUpload", variable)
      .then((res) => {
        if (res.status !== 401) {
          return res.data;
        } else {
          return { message: { msgBody: "Error" }, msgError: true };
        }
      })
      .catch((err) => {
        return {
          message: {
            msgBody: "Xoá ảnh không thành công",
            msgError: true,
          },
        };
      });
  },
  createRecruitment: (variable) => {
    return axios
      .post("/api/recruitment/createRecruitment", variable)
      .then((res) => {
        if (res.status !== 401) {
          return res.data;
        } else {
          return { message: { msgBody: "Error" }, msgError: true };
        }
      })
      .catch((err) => {
        return {
          message: {
            msgBody: "Đăng Tin Tuyển Dụng Không Thành Công",
            msgError: true,
          },
        };
      });
  },
  loadRecruitment: (variable) => {
    return axios
      .post("/api/recruitment/getRecruitment", variable)
      .then((res) => {
        if (res.status !== 400) {
          return res.data;
        } else {
          return { message: { msgBody: "Error" }, msgError: true };
        }
      })
      .catch((err) => {
        return {
          message: {
            msgBody: "Load Dữ Liệu Không Thành Công",
            msgError: true,
          },
        };
      });
  },
  loadMyRecruitment: (pageNumBer) => {
    return axios
      .get("/api/recruitment/getMyRecruitment?page=" + pageNumBer)
      .then((res) => {
        if (res.status !== 401) {
          return res.data;
        } else {
          return { message: { msgBody: "Error" }, msgError: true };
        }
      })
      .catch((err) => {
        return {
          message: {
            msgBody: "Load Dữ Liệu Không Thành Công",
            msgError: true,
          },
        };
      });
  },
  loadRecruitmentFavourite: () => {
    return axios
      .get("/api/recruitment/getFavouriteRecruitment")
      .then((res) => {
        if (res.status !== 400) {
          return res.data;
        } else {
          return { message: { msgBody: "Error" }, msgError: true };
        }
      })
      .catch((err) => {
        return {
          message: {
            msgBody: "Load Dữ Liệu Không Thành Công",
            msgError: true,
          },
        };
      });
  },
  loadRecruitmentById: (variable) => {
    return axios
      .post("/api/recruitment/getRecruitmentById", variable)
      .then((res) => {
        if (res.status !== 400) {
          return res.data;
        } else {
          return { message: { msgBody: "Error" }, msgError: true };
        }
      })
      .catch((err) => {
        return {
          message: {
            msgBody: "Load Dữ Liệu Không Thành Công",
            msgError: true,
          },
        };
      });
  },
  loadRecruitmentByIdLoadMore: (variable) => {
    return axios
      .post("/api/recruitment/getRecruitmentByIdLoadMore", variable)
      .then((res) => {
        if (res.status !== 400) {
          return res.data;
        } else {
          return { message: { msgBody: "Error" }, msgError: true };
        }
      })
      .catch((err) => {
        return {
          message: {
            msgBody: "Load Dữ Liệu Không Thành Công",
            msgError: true,
          },
        };
      });
  },
  searchRecruitment: (variable) => {
    return axios
      .post("/api/recruitment/searchRecruitment", variable)
      .then((res) => {
        if (res.status !== 400) {
          return res.data;
        } else {
          return { message: { msgBody: "Error" }, msgError: true };
        }
      })
      .catch((err) => {
        return {
          message: {
            msgBody: "Load Dữ Liệu Không Thành Công",
            msgError: true,
          },
        };
      });
  },
  loadDetailRecruitment: (id) => {
    return axios.get("/api/recruitment/" + id).then((res) => {
      if (res.status !== 400) {
        return res.data;
      } else {
        return { message: { msgBody: "Error" }, msgError: true };
      }
    });
  },
  loadDetailRecruitmentUpdate: (variable) => {
    return axios
      .post("/api/recruitment/getDetailRecruitment", variable)
      .then((res) => {
        if (res.status !== 401) {
          return res.data;
        } else {
          return { message: { msgBody: "Error" }, msgError: true };
        }
      });
  },
  updateRecruitment: (variable) => {
    return axios
      .post("/api/recruitment/updateRecruitment", variable)
      .then((res) => {
        if (res.status !== 401) {
          return res.data;
        } else {
          return { message: { msgBody: "Error" }, msgError: true };
        }
      });
  },
  deleteRecruitment: (variable) => {
    return axios
      .post("/api/recruitment/deleteRecruitment", variable)
      .then((res) => {
        if (res.status !== 401) {
          return res.data;
        } else {
          return { message: { msgBody: "Error" }, msgError: true };
        }
      });
  },
};
