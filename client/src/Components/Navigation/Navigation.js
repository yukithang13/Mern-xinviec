import React, { useContext, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { NavLink } from "react-router-dom";
import "./index.css";
import AccountService from "../../Services/AccountService";

function Navigation(props) {
  const { isAuthenticated, setIsAuthenticated, user, setUser } = useContext(
    AuthContext
  );

  const [icon, setIcon] = useState(false);

  const changeIcon = () => {
    setIcon(!icon);
  };

  const logout = () => {
    AccountService.logout().then((data) => {
      if (data.success) {
        setUser(data.user);
        setIsAuthenticated(false);
        setIcon(false);
      }
    });
  };

  const toTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const unauthenticatedNavBar = () => {
    return (
      <div className="collapse navbar-collapse" id="navbarResponsive">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item mx-0 mx-lg-1">
            <NavLink
              onClick={toTop}
              className="nav-link py-3 px-0 px-lg-3 rounded"
              exact
              to="/"
            >
              Trang Chủ
            </NavLink>
          </li>
          <li className="nav-item mx-0 mx-lg-1">
            <NavLink
              onClick={toTop}
              className="nav-link py-3 px-0 px-lg-3 rounded"
              to="/search"
            >
              Tìm Kiếm
            </NavLink>
          </li>
          <li className="nav-item mx-0 mx-lg-1">
            <NavLink
              onClick={toTop}
              className="nav-link py-3 px-0 px-lg-3 rounded"
              to="/login"
            >
              Đăng Nhập
            </NavLink>
          </li>
          <li className="nav-item mx-0 mx-lg-1">
            <NavLink
              onClick={toTop}
              className="nav-link py-3 px-0 px-lg-3 rounded"
              to="/register"
            >
              Đăng Ký
            </NavLink>
          </li>
        </ul>
      </div>
    );
  };

  const authenticatedNavBar = () => {
    if (user.role === "spadmin" || user.role === "admin") {
      return (
        <div className="collapse navbar-collapse" id="navbarResponsive">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item mx-0 mx-lg-1">
              <NavLink
                onClick={toTop}
                className="nav-link py-3 px-0 px-lg-3 rounded"
                exact
                to="/"
              >
                Trang Chủ
              </NavLink>
            </li>
            <li className="nav-item mx-0 mx-lg-1">
              <NavLink
                onClick={toTop}
                className="nav-link py-3 px-0 px-lg-3 rounded"
                to="/search"
              >
                Tìm Kiếm
              </NavLink>
            </li>
            <li className="nav-custom nav-item mx-0 mx-lg-1 nav-link py-3 px-0 px-lg-3">
              <a
                onClick={changeIcon}
                href="#admin"
                data-toggle="collapse"
                aria-expanded="false"
                className="tk"
              >
                Quản Lý{" "}
                <i
                  className={icon ? "fas fa-chevron-up" : "fas fa-chevron-down"}
                ></i>
              </a>
              <ul className="collapse list-unstyled" id="admin">
                <li>
                  <a href={`/admin/account/${user._id}&page=1`}>Tài Khoản</a>
                </li>
                <li>
                  <a href={`/admin/recruitment/${user._id}&page=1&false`}>
                    Tin Tuyển Dụng
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-custom nav-item mx-0 mx-lg-1 nav-link py-3 px-0 px-lg-3">
              <a
                onClick={changeIcon}
                href="#pageSubmenu"
                data-toggle="collapse"
                aria-expanded="false"
                className="tk"
              >
                <i className="far fa-user-circle mx-1" />
                {user.role}{" "}
                <i
                  className={icon ? "fas fa-chevron-up" : "fas fa-chevron-down"}
                ></i>
              </a>
              <ul className="collapse list-unstyled" id="pageSubmenu">
                <li>
                  <NavLink onClick={logout} to="/">
                    Đăng Xuất
                  </NavLink>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      );
    } else {
      return (
        <div className="collapse navbar-collapse" id="navbarResponsive">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item mx-0 mx-lg-1">
              <NavLink
                onClick={toTop}
                className="nav-link py-3 px-0 px-lg-3 rounded"
                exact
                to="/"
              >
                Trang Chủ
              </NavLink>
            </li>
            {user.role === "recruiter" ? (
              <li className="nav-item mx-0 mx-lg-1">
                <NavLink
                  onClick={toTop}
                  className="nav-link py-3 px-0 px-lg-3 rounded"
                  to="/postRecruitment"
                >
                  Đăng Bài
                </NavLink>
              </li>
            ) : (
              <li className="nav-item mx-0 mx-lg-1">
                <NavLink
                  onClick={toTop}
                  className="nav-link py-3 px-0 px-lg-3 rounded"
                  to="/profile"
                >
                  Hồ Sơ Cá Nhân
                </NavLink>
              </li>
            )}

            <li className="nav-item mx-0 mx-lg-1">
              <NavLink
                onClick={toTop}
                className="nav-link py-3 px-0 px-lg-3 rounded"
                to="/search"
              >
                Tìm Kiếm
              </NavLink>
            </li>
            <li className="nav-custom nav-item mx-0 mx-lg-1 nav-link py-3 px-0 px-lg-3">
              <a
                onClick={changeIcon}
                href="#pageSubmenu"
                data-toggle="collapse"
                aria-expanded="false"
                className="tk"
              >
                <i className="far fa-user-circle mx-1" />
                {user.username}{" "}
                <i
                  className={
                    icon === true ? "fas fa-chevron-up" : "fas fa-chevron-down"
                  }
                ></i>
              </a>
              <ul className="collapse list-unstyled" id="pageSubmenu">
                {user.role === "recruiter" ? (
                  <>
                    <li>
                      <a href={`/myRecruitment/${user._id}-page=1`}>
                        Bài Đăng Của Tôi
                      </a>
                    </li>
                    <li>
                      <a href={`/mail/${user._id}&false&page=1`}>
                        Quản Lý Hồ Sơ
                      </a>
                    </li>
                    <li>
                      <NavLink onClick={logout} to="/">
                        Đăng Xuất
                      </NavLink>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <NavLink onClick={logout} to="/">
                        Đăng Xuất
                      </NavLink>
                    </li>
                  </>
                )}
              </ul>
            </li>
          </ul>
        </div>
      );
    }
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg bg-secondary text-uppercase fixed-top no-select"
        id="mainNav"
      >
        <div className="container transi">
          <a className="navbar-brand" href="/">
            There here
            {/* <img src="assets/img/"/> */}
          </a>
          <button
            className="navbar-toggler navbar-toggler-right text-uppercase font-weight-bold bg-primary text-white rounded"
            type="button"
            data-toggle="collapse"
            data-target="#navbarResponsive"
            aria-controls="navbarResponsive"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            Menu
            <i className="fas fa-bars mx-1" />
          </button>
          {isAuthenticated ? authenticatedNavBar() : unauthenticatedNavBar()}
        </div>
      </nav>
    </>
  );
}

export default Navigation;
