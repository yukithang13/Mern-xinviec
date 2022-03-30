import React, { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet";
import "react-tabs/style/react-tabs.css";
import { AuthContext } from "../../Context/AuthContext";
import MailTable from "./MailTable";
import "react-toastify/dist/ReactToastify.css";
import CVService from "../../Services/CVService";
import { Link } from "react-router-dom";
import "./index.css";
import moment from "moment";
import "moment/locale/vi";
import swal from "sweetalert";

function MailChecked(props) {
  const [mails, setMails] = useState([]);

  const [idMail, setIdMail] = useState("");
  const [detailsMail, setDetailsMail] = useState("");
  const [profile, setProfile] = useState([]);

  const defaultPage = parseInt(props.match.params.page);
  const [page, setpage] = useState(defaultPage);
  const [pageNumber, setpageNumber] = useState("");
  const [totalMail, setTotalMail] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    CVService.loadCVReceiverTrue(page).then((data) => {
      if (data.success) {
        setMails(data.result);
        setTotalMail(data.total);
      }
    });
  }, [page]);

  const newMail = [...mails];

  const deleteMail = (id) => {
    const variable = {
      _id: id,
    };
    swal({
      title: "Bạn Có Chắc Không?",
      text: "Nếu xoá hồ sơ này sẽ không khôi phục lại được",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        CVService.deleteCV(variable)
          .then((data) => {
            if (data.success) {
              swal("Xoá Thành Công", { icon: "success" });
              CVService.loadCVReceiverTrue(page).then((dt) => {
                if (dt.success) {
                  setMails(dt.result);
                  setTotalMail(dt.total);
                }
              });
            } else {
              swal("Xoá Không Thành Công", { icon: "error" });
            }
          })
          .catch((err) => {
            swal("Có Lỗi!!!", { icon: "error" });
          });
      }
    });
  };

  const DetailsCV = (id) => {
    setIdMail(id);
  };

  useEffect(() => {
    if (idMail) {
      const variable = {
        idCV: idMail,
      };
      CVService.loadDetailsCV(variable).then((data) => {
        if (data.success) {
          setDetailsMail(data.result);
          setProfile(data.result.profile);
        }
      });
    }
  }, [idMail]);

  const renderMails = newMail.map((mail, index) => (
    <MailTable
      mails={mail}
      index={index}
      key={index}
      deleteMail={deleteMail}
      DetailsCV={DetailsCV}
    />
  ));

  const totalPage = Math.ceil(totalMail / 3);

  const btnPreviousPage = (e) => {
    e.preventDefault();
    setpage(page - 1);
    props.history.push(`/mail/${user._id}&true&page=${page - 1}`);
  };

  const btnNextPage = (e) => {
    e.preventDefault();
    setpage(page + 1);
    props.history.push(`/mail/${user._id}&true&page=${page + 1}`);
  };

  const handlePage = (e) => {
    e.preventDefault();
    setpageNumber(e.target.value);
  };

  const onGoPage = (e) => {
    e.preventDefault();
    if (pageNumber) {
      if (pageNumber > 0) {
        if (pageNumber <= totalPage) {
          const page = parseInt(pageNumber);
          setpage(page);
          props.history.push(`/mail/${user._id}&true&page=${page}`);
          setpageNumber("");
        } else {
          alert("Không Có Trang Này");
        }
      } else {
        alert("Không Nhập Số 0 Hoặc Âm Vào Đây");
      }
    }
  };

  const birthday = moment(profile.birthday ? profile.birthday : null).format(
    "DD/MM/YYYY"
  );

  return (
    <>
      <Helmet>
        <title>Hồ Sơ Chưa Duyệt</title>
      </Helmet>
      <section
        className="page-section my-3 search"
        style={{ minHeight: "450px" }}
      >
        <div className="container no-select">
          <h2 className="page-section-heading text-center text-uppercase text-secondary mb-0">
            Hồ Sơ Đến Đã Duyệt
          </h2>
          <div className="divider-custom">
            <div className="divider-custom-line" />
            <div className="divider-custom-icon">
              <i className="fas fa-star" />
            </div>
            <div className="divider-custom-line" />
          </div>
          <div className="dropdown mb-3">
            <a
              className="btn btn-secondary dropdown-toggle"
              href="/#"
              role="button"
              id="dropdownMenuLink"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Thay Đổi
            </a>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <Link
                className="dropdown-item"
                to={`/mail/${user._id}&false&page=1`}
              >
                Hồ Sơ Chưa Duyệt
              </Link>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <form className="form-inline" onSubmit={onGoPage}>
                <input
                  name="page"
                  value={pageNumber}
                  onChange={handlePage}
                  onKeyPress={(event) => {
                    return /\d/.test(
                      String.fromCharCode(event.keyCode || event.which)
                    );
                  }}
                  className="form-control mr-sm-2 no-select"
                  type="number"
                  placeholder="Nhập Số Trang"
                  style={{ borderRadius: "0", maxWidth: "250px" }}
                />
                <button
                  className="btn btn-outline-success my-2 my-sm-0"
                  style={{ borderRadius: "0" }}
                  type="submit"
                >
                  Đi Đến
                </button>
              </form>
            </div>
          </div>
          <div className="row">
            <div className="col d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-primary"
                style={{ borderRadius: "0" }}
                disabled
              >
                {`Trang: ${totalMail === 0 ? 0 : page}/${totalPage}`}
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <table className="table table-striped table-dark ">
                <thead>
                  <tr className="no-select text-center">
                    <th scope="col">STT</th>
                    <th scope="col">Họ Và Tên</th>
                    <th scope="col">E-mail</th>
                    <th scope="col">Ngày Gửi</th>
                    <th scope="col">Hành Động</th>
                  </tr>
                </thead>
                {mails.length >= 1 ? null : (
                  <thead>
                    <tr className="no-select text-center">
                      <th scope="col" colSpan="6">
                        <img
                          style={{ maxHeight: "145px" }}
                          alt="empty"
                          src={"assets/img/inbox.svg"}
                        />
                        <h6>
                          <i>(Không có hồ sơ đã duyệt)</i>
                        </h6>
                      </th>
                    </tr>
                  </thead>
                )}
                {renderMails}
              </table>
            </div>
          </div>
          <div className="row no-select">
            <div className="col d-flex justify-content-end">
              <button
                style={{ borderRadius: "0px" }}
                type="button"
                className="btn btn-primary"
                onClick={btnPreviousPage}
                disabled={true ? page <= 1 : false}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <button
                style={{ borderRadius: "0px" }}
                type="button"
                className="btn btn-primary"
                onClick={btnNextPage}
                disabled={true ? page >= totalPage : false}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>

        <div
          className="modal fade"
          id="exampleModalLong"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLongTitle"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-xl" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5
                  className="modal-title text-secondary"
                  id="exampleModalLongTitle"
                >
                  {detailsMail.recruitment ? (
                    <Link
                      to={`/recruitment/${detailsMail.recruitment._id}`}
                      target="_blank"
                    >
                      {detailsMail.recruitment.title}
                    </Link>
                  ) : null}
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  style={{ outline: "none" }}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div
                className="modal-body text-secondary"
                style={{ paddingTop: "0px" }}
              >
                <div className="card">
                  <h2 className="card-header text-uppercase text-center">
                    <img
                      className="mb-3"
                      src="assets/img/user.svg"
                      alt="user"
                      style={{ width: "8%" }}
                    />
                    <br />
                    {profile.name}
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
                        <div
                          className="card-text h-199"
                          style={{ overflowY: "auto" }}
                        >
                          <span className="mx-auto">
                            <b className="float-left">Giới tính</b>
                            <div className="marginLeft-91">
                              {profile.gender}
                            </div>
                          </span>
                          <span>
                            <b className="float-left">Ngày sinh</b>
                            <div className="marginLeft-91">{birthday}</div>
                          </span>
                          <span>
                            <b className="float-left">E-mail</b>
                            <div className="marginLeft-91">{profile.email}</div>
                          </span>
                          <span>
                            <b className="float-left">Điện thoại</b>
                            <p className="marginLeft-91">{profile.sdt}</p>
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
                        <div
                          className="card-text h-199"
                          style={{ overflowY: "auto" }}
                        >
                          <p
                            dangerouslySetInnerHTML={{ __html: profile.skill }}
                          />
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
                          style={{ overflowY: "auto" }}
                        >
                          <p
                            dangerouslySetInnerHTML={{ __html: profile.hobby }}
                          />
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
                        <div
                          className="card-text h-199"
                          style={{ overflowY: "auto" }}
                        >
                          <div
                            dangerouslySetInnerHTML={{
                              __html: profile.degree,
                            }}
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
                        <div
                          className="card-text h-199"
                          style={{ overflowY: "auto" }}
                        >
                          <div
                            dangerouslySetInnerHTML={{
                              __html: profile.experience,
                            }}
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
                        <div
                          className="card-text h-199"
                          style={{ overflowY: "auto" }}
                        >
                          <div
                            dangerouslySetInnerHTML={{
                              __html: profile.target,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default MailChecked;
