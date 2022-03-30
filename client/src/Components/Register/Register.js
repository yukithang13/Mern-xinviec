import React, { useState, useEffect, useRef } from "react";
import AccountService from "../../Services/AccountService";
import "./index.css";
import Message from "../Message/Message";
import { Helmet } from "react-helmet";

function Register(props) {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfig: "",
    role: "",
  });

  const [valiRole, setValiRole] = useState(true);
  const [valiPass, setValiPass] = useState(true);
  const [valiem, setValiEm] = useState(true);
  const [valiUs, setValiUs] = useState(true);
  const [valiPassCF, setValiPassCF] = useState(true);

  let timeID = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(timeID);
    };
  }, []);

  const [message, setMessage] = useState(false);
  const [valiEmail, setValiEmail] = useState(true);

  const resetForm = () => {
    setUser({ username: "", password: "", email: "", passwordConfig: "" });
    setValiPass(true);
    setValiEm(true);
    setValiUs(true);
    setValiPassCF(true);
  };

  const onChange = (e) => {
    e.preventDefault();
    const newUser = { ...user };
    newUser[e.target.name] = e.target.value;
    setUser(newUser);
  };

  const Reg = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

  const onSubmit = (e) => {
    const testEmail = new RegExp(Reg).test(user.email);
    window.scrollTo({ top: 0, behavior: "smooth" });
    e.preventDefault();
    if ( // kiem tra
      testEmail &&
      user.role !== "" &&
      user.username !== "" &&
      user.username.length + 1 > 4 &&
      user.password !== "" &&
      user.password.length + 1 > 6 &&
      user.passwordConfig === user.password &&
      user.email !== "" &&
      user.passwordConfig !== ""
    ) {
      AccountService.register(user).then((data) => {
        const { message } = data;
        setMessage(message);
        if (!message.msgError) {
          resetForm();
          setValiEmail(true);
          setValiPassCF(true);
          setValiRole(true);
          setValiPass(true);
          setValiUs(true);
          setValiEm(true);
          timeID = setTimeout(() => {
            props.history.push("/login");
          }, 2500);
          setMessage(message);
        }
      });
    } else {
      if (!testEmail) {
        setValiEmail(false);
      } else {
        setValiEmail(true);
      }
      if (user.role === "") {
        setValiRole(false);
      } else {
        setValiRole(true);
      }
      if (user.username === "" || user.username.length + 1 < 3) {
        setValiUs(false);
      } else {
        setValiUs(true);
      }
      if (user.password === "" || user.password.length + 1 < 6) {
        setValiPass(false);
      } else {
        setValiPass(true);
      }
      if (user.passwordConfig === "" || user.passwordConfig !== user.password) {
        setValiPassCF(false);
      } else {
        setValiPassCF(true);
      }
      if (user.email === "") {
        setValiEm(false);
      } else {
        setValiEm(true);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Đăng Ký</title>
      </Helmet>
      <section className="page-section my-3 register">
        <div className="container">
          <h2 className="page-section-heading text-center text-uppercase text-secondary mb-0">
            Đăng Ký
          </h2>
          <div className="divider-custom">
            <div className="divider-custom-line" />
            <div className="divider-custom-icon">
            <i class="fas fa-briefcase"></i>
            </div>
            <div className="divider-custom-line" />
          </div>
          <div className="row">
            <div className="col-lg-8 mx-auto">
              {message ? <Message message={message} /> : null}
              <form
                id="contactForm"
                name="sentMessage"
                noValidate="novalidate"
                onSubmit={onSubmit}
              >
                <div className="control-group">
                  <div className="form-group controls mb-0 pb-2">
                    <p className={valiRole === false ? "onVali" : "offVali"}>
                      <i>Vui lòng nhập chọn loại tài khoản</i>
                    </p>
                    <select
                      className="form-control"
                      name="role"
                      value={user.role}
                      onChange={onChange}
                    >
                      <option value="" disabled>
                        {" "}
                        -- Chọn Loại Tài Khoản --
                      </option>
                      <option value="candidate">Ứng Viên</option>
                      <option value="recruiter">Tuyển Dụng</option>
                    </select>
                  </div>
                </div>
                <div className="control-group">
                  <div className="form-group floating-label-form-group controls mb-0 pb-2">
                    <p className={valiUs === false ? "onVali" : "offVali"}>
                      <i>Vui lòng nhập username và từ 4 kí tự trở lên</i>
                    </p>
                    <input
                      className="form-control ml-3"
                      name="username"
                      type="text"
                      placeholder="User Name"
                      autoFocus={true}
                      onChange={onChange}
                    />
                  </div>
                </div>
                <div className="control-group">
                  <div className="form-group floating-label-form-group controls mb-0 pb-2">
                    <p className={!valiem || !valiEmail ? "onVali" : "offVali"}>
                      <i>Vui lòng nhập email và hợp lệ</i>
                    </p>
                    <input
                      name="email"
                      className="form-control ml-3"
                      onChange={onChange}
                      placeholder="E-Mail"
                      type="email"
                    />
                  </div>
                </div>
                <div className="control-group">
                  <div className="form-group floating-label-form-group controls mb-0 pb-2">
                    <p className={valiPass === false ? "onVali" : "offVali"}>
                      <i>Vui lòng nhập mật khẩu và từ 6 ký tự trở lên</i>
                    </p>
                    <input
                      className="form-control ml-3"
                      name="password"
                      type="password"
                      onChange={onChange}
                      placeholder="Mật Khẩu"
                    />
                  </div>
                </div>
                <div className="control-group">
                  <div className="form-group floating-label-form-group controls mb-0 pb-2">
                    <p className={valiPassCF === false ? "onVali" : "offVali"}>
                      <i>
                        Vui lòng nhập lại mật khẩu và giống với mật khẩu trên
                      </i>
                    </p>
                    <input
                      className="form-control ml-3"
                      name="passwordConfig"
                      type="password"
                      onChange={onChange}
                      placeholder="Nhập Lại Mật Khẩu"
                    />
                  </div>
                </div>
                <br />
                <div id="success" />
                <div className="form-group">
                  <button
                    className="btn btn-primary btn-xl"
                    id="sendMessageButton"
                    type="submit"
                  >
                    Đăng Ký
                  </button>
                </div>
                <div className="form-group">
                  <p className="text-register">
                    Bạn đã có tài khoản <a href="/login">Đăng Nhập</a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default Register;
