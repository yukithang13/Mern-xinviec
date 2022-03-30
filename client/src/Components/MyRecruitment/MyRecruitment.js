import React, { useState, useEffect, useContext } from "react";
import Helmet from "react-helmet";
import "./index.css";
import RecruimentService from "../../Services/RecruimentService";
import MyTableRecruitment from "./MyTableRecruitment";
import { AuthContext } from "../../Context/AuthContext";

function MyRecruitment(props) {
  const [myRecruitments, setmyRecruitments] = useState([]);

  const defaultPage = parseInt(props.match.params.page);
  const [page, setpage] = useState(defaultPage);
  const [totalMyRecruitment, settotalMyRecruitment] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    RecruimentService.loadMyRecruitment(page).then((data) => {
      if (data.success) {
        setmyRecruitments(data.result);
        settotalMyRecruitment(data.totalMyRecruitment);
      }
    });
  }, [page]);

  const newMyRecruitment = [...myRecruitments];

  const btnDeleteMyRecruitment = (id) => {
    myRecruitments.find((rcm, index) => {
      if (rcm._id === id) {
        newMyRecruitment.splice(index, 1);
        setmyRecruitments(newMyRecruitment);
        RecruimentService.loadMyRecruitment(page).then((data) => {
          if (data.success) {
            setmyRecruitments(data.result);
            settotalMyRecruitment(data.totalMyRecruitment);
          }
        });
        return true;
      } else {
        return false;
      }
    });
  };

  const renderMyRecruitment = newMyRecruitment.map((rcm, index) => (
    <MyTableRecruitment
      recruitment={rcm}
      index={index}
      key={index}
      btnDeleteMyRecruitment={btnDeleteMyRecruitment}
    />
  ));

  const totalPage = Math.ceil(totalMyRecruitment / 2);

  const btnPreviousPage = (e) => {
    e.preventDefault();
    setpage(page - 1);
    props.history.push(`/myRecruitment/${user._id}-page=${page - 1}`);
  };

  const btnNextPage = (e) => {
    e.preventDefault();
    setpage(page + 1);
    props.history.push(`/myRecruitment/${user._id}-page=${page + 1}`);
  };


  return (
    <>
      <Helmet>
        <title>Trang Cá Nhân</title>
      </Helmet>
      <section
        className="page-section my-3 search"
        style={{ minHeight: "450px" }}
      >
        <div className="container">
          <h2 className="page-section-heading text-center text-uppercase text-secondary mb-0">
            Bài Đăng Của Tôi
          </h2>
          <div className="divider-custom">
            <div className="divider-custom-line" />
            <div className="divider-custom-icon">
              <i className="fas fa-star" />
            </div>
            <div className="divider-custom-line" />
          </div>
          <div className="row">
            <div className="col"></div>
          </div>
          <div className="row">
            <div className="col">

              <table className="table table-striped table-dark ">
                <thead>
                  <tr className="no-select text-center">
                    <th scope="col">STT</th>
                    <th scope="col">Tiêu Đề</th>
                    <th scope="col">Ngày Đăng</th>
                    <th scope="col">Trạng Thái</th>
                    <th scope="col">Hành Động</th>
                  </tr>
                </thead>
                {myRecruitments.length >= 1 ? null : (
                  <thead>
                    <tr className="no-select text-center">
                      <th scope="col" colSpan="6">
                        <img
                          style={{ maxHeight: "145px" }}
                          alt="empty"
                          src={"assets/img/inbox.svg"}
                        />
                        <h6>
                          <i>(Không còn tin nào hết)</i>
                        </h6>
                      </th>
                    </tr>
                  </thead>
                )}
                {renderMyRecruitment}
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
      </section>
    </>
  );
}

export default MyRecruitment;
