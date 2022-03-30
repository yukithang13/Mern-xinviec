import React from "react";

function Footer() {
  return (
    <>
      <footer className="footer text-center">
        <div className="container">
          <div className="row d-flex justify-content-center">
            <div className="col-lg-4 mb-5 mb-lg-0">
              <h4 className="text-uppercase mb-4">đại học hutech</h4>
              <p className="lead mb-0">
                Khu Công Nghệ Cao,
                <br />
                Quận 9, Thành phố HCM
              </p>
            </div>
            <div className="col-lg-4 mb-5 mb-lg-0">
              <h4 className="text-uppercase mb-4">liên quan</h4>
              <a className="btn btn-outline-light btn-social mx-1" href="#!">
                <i className="fab fa-fw fa-facebook-f" />
              </a>
              <a className="btn btn-outline-light btn-social mx-1" href="#!">
                <i className="far fa-chart-bar"></i>
              </a>
              <a className="btn btn-outline-light btn-social mx-1" href="#!">
                <i className="fab fa-fw fa-internet-explorer" />
              </a>
            </div>
            <div className="col-lg-4">
              <h4 className="text-uppercase mb-4">đồ án ngôn ngữ mới</h4>
              <p className="lead mb-0">
                Giảng viên hướng dẫn: Bùi Mạnh Toàn
                <br />
                Nhóm thực hiện: Văn Thắng, Tấn Đạt, Hữu Thái
              </p>
            </div>
          </div>
        </div>
      </footer>

    </>
  );
}

export default Footer;
