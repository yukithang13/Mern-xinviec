import React from "react";
import "./index.css";
import moment from "moment";
import "moment/locale/vi";
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";
import { Link } from "react-router-dom";

function CVMoiNhat(props) {
  const render = props.recruitment
    ? props.recruitment.map((item, index) => {
        let luong = item.salary;
        const dateCre = moment(item.createdAt).format("DD/MM/YYYY h:mm:ss");

        let images = item.img.map((img) => ({
          original: img,
          thumbnail: img,
        }));

        luong = luong.toLocaleString("it-IT");
        const user = props.user;

        return (
          <div className="col-md-6 col-lg-4 mb-5" key={index}>
            <div
              className="card card-MN w-100 h-100"
              style={{ width: "18rem" }}
            >
              {user.role ? (
                user.role === "admin" || user.role === "spadmin" ? (
                  <div className="dropdown menu-recruitment">
                    <i
                      className="fas fa-bars"
                      id="dropdownMenu2"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    ></i>
                    <div
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenu2"
                    >
                      <Link
                        to={`/updateRecruitment/${item._id}`}
                        className="dropdown-item"
                      >
                        Cập Nhật
                      </Link>
                    </div>
                  </div>
                ) : user._id === item.writer ? (
                  <div className="dropdown menu-recruitment">
                    <i
                      className="fas fa-bars"
                      id="dropdownMenu2"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    ></i>
                    <div
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenu2"
                    >
                      <Link
                        to={`/updateRecruitment/${item._id}`}
                        className="dropdown-item"
                      >
                        Cập Nhật
                      </Link>
                    </div>
                  </div>
                ) : null
              ) : null}
              <div className="p-2 img" style={{ height: "150px" }}>
                <ImageGallery
                  items={images}
                  autoPlay
                  showNav={false}
                  showThumbnails={false}
                  showPlayButton={false}
                  showFullscreenButton={false}
                />
              </div>
              <div className="card-body mt-2">
                <h5 className="card-title cvMN-item-sumary">
                  <Link
                    to={`/recruitment/${item._id}`}
                    className="cv-title text-primary"
                  >
                    {item.title}
                  </Link>
                </h5>
                <p className="card-text cvMN-salary">
                  <span>
                    <i className="fas fa-money-bill-wave px-1"></i>
                    {luong + " VNĐ"}
                  </span>
                  <span className="mx-2"></span>
                  <span>
                    <i className="fas fa-map-marker-alt px-1"></i>
                    <Link to="/">{item.city.name}</Link>
                  </span>
                  <br />
                  <span>
                    <i className="fas fa-clock px-1"></i>
                    <i>{dateCre}</i>
                  </span>
                </p>
              </div>
            </div>
          </div>
        );
      })
    : null;

  return <>{render}</>;
}

export default CVMoiNhat;
