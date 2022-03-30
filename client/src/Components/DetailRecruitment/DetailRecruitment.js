import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import RecruimentService from "../../Services/RecruimentService";
import { AuthContext } from "../../Context/AuthContext";
import "./index.css";
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";
import moment from "moment";
import "moment/locale/vi";
import CVService from "../../Services/CVService";
import ProfileService from "../../Services/ProfileService";
import { cleanBadWord, badWordFilter } from "../../Shared/filterBadWords";
import { Link } from "react-router-dom";
import chuyenDoiURL from "../../Shared/ChuyenDoiURL";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function DetailRecruitment(props) {
  const [disableModal, setDisableModal] = useState(false);
  const [modalowner, setmodalowner] = useState(false);
  const [recruitment, setRecruitment] = useState([]);
  const [images, setImages] = useState([]);
  const [thumbnail, setThumbnail] = useState(false);
  const [hideBadWord, setHideBadWord] = useState(false);
  const [activeStyle, setActiveStyle] = useState(false);
  const [styleDescription, setStyleDescription] = useState(false);

  const [existProfile, setExistProfile] = useState(false);
  const [profile, setProfile] = useState(false);

  const id = props.match.params.id;
  const { user } = useContext(AuthContext);

  const dateCre = moment(recruitment ? recruitment.createdAt : null).format(
    "DD/MM/YYYY h:mm:ss"
  );

  useEffect(() => {
    if (user.role === "candidate") {
      ProfileService.getProfile().then((data) => {
        if (data.success) {
          setExistProfile(data.existProfile);
          setProfile(data.prof);
        }
      });
    }
  }, [user.role]);

  useEffect(() => {
    window.scrollTo({ top: 0.2, behavior: "auto" });
    RecruimentService.loadDetailRecruitment(id).then((data) => {
      if (data.success || data) {
        setTimeout(() => {
          setRecruitment(data.rcm);
          setImages(data.rcm.img);
          if (data.rcm.writer._id === user._id) {
            setmodalowner(true);
          }
        }, 750);
      }
    });
  }, [user._id, id]);

  useEffect(() => {
    const variable = {
      idRecruitment: id,
    };
    CVService.loadCV(variable).then((data) => {
      if (data.success) {
        data.result.map((cv) => {
          if (cv.writer === user._id) {
            return setDisableModal(true);
          } else {
            return setDisableModal(false);
          }
        });
      }
    });
  }, [user._id, id]);

  const img = images.map((item) => ({
    original: item,
    thumbnail: item,
  }));

  const onScreenChange = () => {
    setThumbnail(!thumbnail);
  };

  const sendProfile = () => {
    if (!user.role || !user.username) {
      props.history.push("/login");
    } else {
      MySwal.fire({
        icon: "warning",
        title: "Bạn Có Chắc Sẽ Gửi Hồ Sơ?",
        html: (
          <span>
            Vui lòng kiểm tra lại hồ sơ cá nhân <a href="/profile">TẠI ĐÂY </a>
            trước khi gửi.
          </span>
        ),
        showCancelButton: true,
        confirmButtonText: (
          <>
            <i className="fab fa-telegram-plane mx-1"></i>
            <span className="mx-1">Gửi</span>
          </>
        ),
      }).then((result) => {
        const variable = {
          profile: profile._id,
          recruitment: recruitment._id,
          receiver: recruitment.writer._id,
        };
        if (result.isConfirmed) {
          CVService.createCV(variable).then((data) => {
            if (data || data.message) {
              const { message } = data;
              if (message.msgError) {
                MySwal.fire(message.msgBody, "", "error");
              } else {
                const variable = {
                  idRecruitment: id,
                };

                RecruimentService.loadDetailRecruitment(id).then((data) => {
                  if (data.success || data) {
                    setRecruitment(data.rcm);
                    setImages(data.rcm.img);
                    if (data.rcm.writer._id === user._id) {
                      setmodalowner(true);
                    }
                  }
                });

                CVService.loadCV(variable).then((data) => {
                  if (data.success) {
                    data.result.map((cv) => {
                      if (cv.writer === user._id) {
                        return setDisableModal(true);
                      } else {
                        return setDisableModal(false);
                      }
                    });
                  }
                });

                MySwal.fire("Gửi Thành Công!", "", "success");
              }
            }
          });
        }
      });
    }
    if (!existProfile && user.role) {
      MySwal.fire({
        confirmButtonText: (
          <>
            <span className="mx-1">Đóng</span>
          </>
        ),
        title: <span>Tài Khoản Chưa Tạo Hồ Sơ</span>,
        html: (
          <span>
            Vui lòng tạo hồ sơ{" "}
            <a href={`${user._id}/createProfile`}>TẠI ĐÂY </a>
            và quay lại.
          </span>
        ),
        icon: "error",
      });
    }
  };

  useEffect(() => {
    if (recruitment || recruitment.description || recruitment.title) {
      if (
        badWordFilter(recruitment.description ? recruitment.description : "") &&
        badWordFilter(recruitment.title ? recruitment.title : "")
      ) {
        setActiveStyle(true);
        setStyleDescription(true);
      } else {
        if (
          badWordFilter(recruitment.description ? recruitment.description : "")
        ) {
          setActiveStyle(true);
          setStyleDescription(true);
        } else {
          if (badWordFilter(recruitment.title ? recruitment.title : "")) {
            setActiveStyle(true);
            setStyleDescription(false);
          }
        }
      }
    }
  }, [recruitment]);

  console.log(activeStyle);

  if (
    (recruitment ? recruitment.img && recruitment.status : null) ||
    (recruitment ? recruitment.img && user.role === "spadmin" : null) ||
    (recruitment ? recruitment.img && user.role === "admin" : null)
  ) {
    return (
      <>
        <Helmet>
          <title>{recruitment.title ? recruitment.title : "Loading..."}</title>
        </Helmet>
        <section className="page-section my-3 search">
          <div
            className={
              thumbnail
                ? "container no-detail-recruitment"
                : "container detail-recruitment"
            }
          >
            <div className="row mx-auto">
              <div className="col-md-6 col-lg-12 px-0">
                <p className="text-left text-uppercase text-secondary title">
                  {cleanBadWord(recruitment.title, hideBadWord)}
                </p>
                {user.role === "admin" || user.role === "spadmin" ? (
                  activeStyle ? (
                    <button
                      type="button"
                      className="btn btn-primary mb-3"
                      onClick={() => setHideBadWord(!hideBadWord)}
                    >
                      {!hideBadWord
                        ? "Hiển Thị Nội Dung Gốc"
                        : "Ẩn Nội Dung Nhạy Cảm"}
                    </button>
                  ) : null
                ) : null}
              </div>
            </div>
            <div className="row no-select mx-auto">
              <div className="col-md-6 col-lg-12 px-0 mb-3">
                <span className="text-left time-create">
                  <i className="fas fa-clock px-1"></i>
                  {dateCre}
                  {", "}
                </span>
                <span className="text-left city">
                  <i className="fas fa-map-marker-alt px-1"></i>
                  <Link
                    to={`/${recruitment.city._id}/search=${chuyenDoiURL(
                      recruitment.city.name
                    )}`}
                  >
                    {recruitment.city.name ? recruitment.city.name : null}
                  </Link>
                  {", "}
                </span>
                <span className="text-left writer">
                  <i className="fas fa-user px-1"></i>
                  {recruitment.writer.username
                    ? recruitment.writer.username
                    : null}
                </span>
                <br />
                <span className="text-left city">
                  Chuyên Ngành:{" "}
                  <Link
                    to={`/${recruitment.career._id}/search=${chuyenDoiURL(
                      recruitment.career.name
                    )}`}
                  >
                    {recruitment.career.name ? recruitment.career.name : null}
                  </Link>
                  {"."}
                </span>
              </div>
            </div>
            <div className="row box mx-auto">
              <div
                className={`col mt-4 mb-3 d-flex justify-content-center ${
                  thumbnail ? "detail-img-100" : "detail-img"
                }`}
              >
                {images.length > 1 ? (
                  <ImageGallery
                    items={img}
                    autoPlay
                    showIndex
                    showBullets
                    showNav={false}
                    thumbnailPosition={!thumbnail ? "bottom" : "right"}
                    onScreenChange={onScreenChange}
                  />
                ) : (
                  <ImageGallery
                    autoPlay
                    items={img}
                    showPlayButton={false}
                    showThumbnails={false}
                    thumbnailPosition={!thumbnail ? "bottom" : "right"}
                    onScreenChange={onScreenChange}
                  />
                )}
              </div>
            </div>
            <div className="row mt-5">
              <div className="col d-flex text-secondary text-center text-uppercase justify-content-center">
                <p style={{ fontSize: "23px", fontWeight: "bold" }}>
                  Thông tin tuyển dụng
                </p>
              </div>
            </div>
            <div className="row py-3 box mx-auto">
              <div className="col text-secondary">
                <div
                  className="description"
                  dangerouslySetInnerHTML={{
                    __html: styleDescription
                      ? cleanBadWord(recruitment.description, hideBadWord)
                      : recruitment.description,
                  }}
                />
              </div>
            </div>
            <div className="row mt-5">
              <div className="col d-flex text-secondary text-center text-uppercase justify-content-center">
                <p style={{ fontSize: "23px", fontWeight: "bold" }}>
                  Thông tin liên hệ
                </p>
              </div>
            </div>
            <div className="row py-3 box mx-auto">
              <div className="col text-secondary contact">
                Tên Người Liên Hệ:{" "}
                <span className="text-uppercase">
                  {recruitment.contact
                    ? recruitment.contact
                    : "Không có thông tin"}
                </span>
                <br />
                E-mail:{" "}
                {recruitment.email ? (
                  recruitment.email
                ) : (
                  <span className="text-uppercase">"Không có thông tin"</span>
                )}
                <br />
                Số Điện Thoại:{" "}
                <span className="text-uppercase">
                  {recruitment.sdt ? recruitment.sdt : "Không có thông tin"}
                </span>
                <br />
                <span>
                  {disableModal ? (
                    <button
                      type="button"
                      style={{
                        fontWeight: "bold",
                        fontSize: "20px",
                        lineHeight: "normal",
                      }}
                      className="mt-3 btn btn-primary"
                      disabled
                    >
                      <i className="fas fa-clipboard-list mx-1"></i>
                      Đã Nộp Hồ Sơ /{" "}
                      {recruitment.cv ? recruitment.cv.length : null}
                    </button>
                  ) : modalowner ? null : (
                    <button
                      type="button"
                      style={{
                        fontWeight: "bold",
                        fontSize: "20px",
                        lineHeight: "normal",
                      }}
                      onClick={sendProfile}
                      className="mt-3 btn btn-primary"
                    >
                      <i className="fas fa-clipboard-list mx-1"></i>
                      Nộp Hồ Sơ /{" "}
                      {recruitment.cv ? recruitment.cv.length : null}
                    </button>
                  )}
                </span>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  } else if (recruitment ? recruitment.status === false : null) {
    return (
      <>
        <Helmet>
          <title>Loading...</title>
        </Helmet>
        <section className="page-section my-3">
          <div className="container">
            <div className="row">
              <div className="col">
                <p
                  className="d-flex justify-content-center recruitmentFalse"
                  style={{
                    color: "#1d365ac7",
                    fontWeight: "bold",
                  }}
                >
                  Bài Đăng Sẽ Quay Lại Sớm Thôi, Xin Thông Cảm!!!
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col d-flex justify-content-center">
                <button
                  type="reset"
                  onClick={() => window.location.reload()}
                  className=" reloadRecruitFalse btn btn-primary"
                  style={{
                    fontWeight: "bold",
                    fontSize: "25px",
                  }}
                >
                  Tải Lại
                </button>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  } else {
    return (
      <>
        <Helmet>
          <title>Loading...</title>
        </Helmet>
        <section className="page-section my-3">
          <div className="container">
            <div className="row">
              <div className="col">
                <p
                  className="d-flex justify-content-center loading-detail"
                  style={{
                    color: "#1d365ac7",
                    fontWeight: "bold",
                  }}
                >
                  Loading...
                </p>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
}

export default DetailRecruitment;
