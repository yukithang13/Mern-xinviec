import React from "react";
import moment from "moment";
import "moment/locale/vi";
import { Link } from "react-router-dom";
import chuyenDoiURL from "../../Shared/ChuyenDoiURL";

function ProfileItem(props) {
  const dateCre = moment(props.profile ? props.profile.birthday : null).format(
    "DD/MM/YYYY"
  );

  return (
    <>
      <div className="card">
        <h2 className="card-header text-uppercase text-center">
          <div className="row">
            <div className="col d-flex justify-content-end">
              <Link to={`${chuyenDoiURL(props.profile.name)}/updateProfile`}>
                <i className="fas fa-edit edit-profile"></i>
              </Link>
            </div>
          </div>
          <img
            className="mb-3"
            src="assets/img/user.svg"
            alt="user"
            style={{ width: "8%" }}
          />
          <br />
          {props.profile.name}
        </h2>
        <div className="row">
          <div className="col-lg-6 col-xl-4 mb-3">
            <div className="card-body">
              <div className="text-center">
                <img
                  className="mb-2"
                  src="assets/img/info.svg"
                  alt="user"
                  style={{ width: "11%" }}
                />
                <br />
                <h3 className="card-title text-uppercase text-center">
                  thông tin
                </h3>
              </div>
              <div className="card-text h-199">
                <span className="mx-auto">
                  <b className="float-left">Giới tính</b>
                  <div className="marginLeft-91">{props.profile.gender}</div>
                </span>
                <span>
                  <b className="float-left">Ngày sinh</b>
                  <div className="marginLeft-91">{dateCre}</div>
                </span>
                <span>
                  <b className="float-left">E-mail</b>
                  <div className="marginLeft-91">{props.profile.email}</div>
                </span>
                <span>
                  <b className="float-left">Điện thoại</b>
                  <p className="marginLeft-91">{props.profile.sdt}</p>
                </span>
              </div>
            </div>
            <hr />
          </div>
          <div className="col-lg-6 col-xl-4 mb-3">
            <div className="card-body">
              <div className="text-center">
                <img
                  className="mb-2"
                  src="assets/img/bar-chart.svg"
                  alt="skill"
                  style={{ width: "11%" }}
                />
                <br />
                <h3 className="card-title text-uppercase text-center">
                  kỹ năng
                </h3>
              </div>
              <div className="card-text h-199">
                <p dangerouslySetInnerHTML={{ __html: props.profile.skill }} />
              </div>
            </div>
            <hr />
          </div>
          <div className="col-lg-6 col-xl-4 mb-3">
            <div className="card-body">
              <div className="text-center">
                <img
                  className="mb-2"
                  src="assets/img/bar-chart.svg"
                  alt="hobby"
                  style={{ width: "11%" }}
                />
                <br />
                <h3 className="card-title text-uppercase text-center">
                  sở thích
                </h3>
              </div>
              <div
                className="card-text h-199"
                style={
                  props.profile.hobby.length > 150
                    ? { height: 250, overflowY: "scroll" }
                    : {}
                }
              >
                <p dangerouslySetInnerHTML={{ __html: props.profile.hobby }} />
              </div>
            </div>
            <hr />
          </div>
          <div className="col-lg-6 col-xl-4 mb-3">
            <div className="card-body">
              <div className="text-center">
                <img
                  className="mb-2"
                  src="assets/img/university.svg"
                  alt="university"
                  style={{ width: "11%" }}
                />
                <br />
                <h3 className="card-title text-uppercase text-center">
                  học vấn
                </h3>
              </div>
              <div className="card-text h-199" style={{ overflowY: "auto" }}>
                <div
                  dangerouslySetInnerHTML={{ __html: props.profile.degree }}
                />
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-xl-4 mb-3">
            <div className="card-body">
              <div className="text-center">
                <img
                  className="mb-2"
                  src="assets/img/briefcase.svg"
                  alt="experience"
                  style={{ width: "11%" }}
                />
                <br />
                <h3 className="card-title text-uppercase text-center">
                  kinh nghiệm
                </h3>
              </div>
              <div className="card-text h-199" style={{ overflowY: "auto" }}>
                <div
                  dangerouslySetInnerHTML={{ __html: props.profile.experience }}
                />
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-xl-4 mb-3">
            <div className="card-body">
              <div className="text-center">
                <img
                  className="mb-2"
                  src="assets/img/folder.svg"
                  alt="targer"
                  style={{ width: "11%" }}
                />
                <br />
                <h3 className="card-title text-uppercase text-center">
                  mục tiêu
                </h3>
              </div>
              <div className="card-text h-199" style={{ overflowY: "auto" }}>
                <div
                  dangerouslySetInnerHTML={{ __html: props.profile.target }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileItem;
