import React, { useContext, useEffect, useState } from "react";
import "../PostRecruitment/index.css";
import { Helmet } from "react-helmet";
import QuillUpdate from "../QuillUpdate/QuillUpdate";
import UpdateSelects from "./UpdateSelects";
import { AuthContext } from "../../Context/AuthContext";
import RecruimentService from "../../Services/RecruimentService";
import Message from "../Message/Message";

function UpdateRecruitment(props) {
  const [hacker, setHacker] = useState(false);
  const [message, setMessage] = useState(false);
  const [salary, setSalary] = useState("");
  const [files, setFiles] = useState([]);
  const [maxSalary, setMaxSalary] = useState(false);
  const [description, setDescription] = useState("");
  const [city, setCity] = useState({ value: "", label: "" });
  const [career, setCareer] = useState({ value: "", label: "" });
  const [email, setEmail] = useState("");
  const [sdt, setSDT] = useState("");
  const [contact, setContact] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState();
  const { user } = useContext(AuthContext);

  const id = props.match.params.id;

  useEffect(() => {
    const variable = {
      _id: id,
      writer: user._id,
    };
    RecruimentService.loadDetailRecruitmentUpdate(variable).then((data) => {
      if (data.rcm === null) {
        setHacker(true);
      } else {
        console.log(data);
        console.log(hacker);
        const {
          title,
          career,
          contact,
          description,
          email,
          status,
          city,
          salary,
          sdt,
        } = data.rcm;
        setTitle(title);
        setCity({ value: city._id, label: city.name });
        setCareer({ value: career._id, label: career.name });
        setContact(contact);
        setDescription(description);
        setEmail(email);
        setHacker(false);
        setSDT(sdt);
        setSalary(salary);
        setStatus(status);
      }
    });
  }, [id, user._id, hacker]);

  const onEditorChange = (value) => {
    setDescription(value);
  };

  const onFilesChange = (files) => {
    setFiles(files);
  };

  const handleTien = (e) => {
    if (e.key === "." || e.key === "-" || e.key === ",") {
      alert("vui lòng chỉ nhập số");
      e.preventDefault();
    } else if (e.target.value > 9999999999) {
      setMaxSalary(true);
    } else if (e.target.value <= 9999999999) {
      setMaxSalary(false);
    }
    if (e.target.value >= 9999999999999999) {
      return false;
    }
    var tf = parseInt(e.target.value, 10);
    setSalary(tf);
  };

  const fm = () => {
    let t = parseInt(salary, 10);
    if (isNaN(t)) return 0;
    else {
      t = t.toLocaleString({ style: "currency", currency: "VND" });
      return t;
    }
  };

  const handleTitle = (e) => {
    e.preventDefault();
    setTitle(e.target.value);
  };

  const handleContact = (e) => {
    e.preventDefault();
    setContact(e.target.value);
  };

  const handleEmail = (e) => {
    e.preventDefault();
    setEmail(e.target.value);
  };

  const handleSDT = (e) => {
    e.preventDefault();
    setSDT(e.target.value);
  };

  const handleCity = (value) => {
    setCity(value);
  };

  const handleCareer = (value) => {
    setCareer(value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const variable = {
      _id: id,
      email: email,
      sdt: sdt,
      contact: contact,
      salary: salary,
      title: title,
      description: description,
      city: city.value,
      career: career.value,
    };
    RecruimentService.updateRecruitment(variable).then((data) => {
      window.scroll({ top: 0, behavior: "smooth" });
      const { message } = data;
      if (data.success) {
        setMessage(message);
        setTimeout(() => {
          props.history.push(`/recruitment/${id}`);
        }, 2000);
      } else {
        setMessage(message);
      }
    });
  };

  return (
    <>
      <Helmet>
        <title>Cập Nhật Tuyển Dụng</title>
      </Helmet>
      <section className="page-section my-3 post">
        <div className="container">
          <h2 className="page-section-heading text-center text-uppercase text-secondary mb-0">
            Cập nhật tuyển dụng
          </h2>
          <div className="divider-custom">
            <div className="divider-custom-line" />
            <div className="divider-custom-icon">
              <i className="fas fa-star" />
            </div>
            <div className="divider-custom-line" />
          </div>
          <div className="row">
            <div className="col-lg-8 mx-auto sp-ct">
              {message ? <Message message={message} /> : null}
              <form
                id="contactForm"
                name="sentMessage"
                noValidate="novalidate"
                onSubmit={onSubmit}
              >
                <div className="control-group">
                  <div className="form-group floating-label-form-group controls mb-0 pb-2">
                    <input
                      onChange={handleTitle}
                      className="form-control"
                      value={title}
                      name="title"
                      type="text"
                      placeholder="Tiêu đề"
                      autoFocus={true}
                    />
                  </div>
                </div>
                <h4 className="text-uppercase text-secondary mt-5">
                  Thông tin công việc:
                </h4>
                <QuillUpdate
                  placeholder={"Nhập Mô Tả Công Việc..."}
                  onEditorChange={onEditorChange}
                  onFilesChange={onFilesChange}
                  description={description}
                  id={id}
                  userId={user._id}
                />
                <div className="control-group">
                  <div className="form-group floating-label-form-group controls mb-0 pb-2">
                    <label>Tiền Lương</label>
                    {maxSalary === false ? null : (
                      <p className="valiSalary">
                        <i>Cảnh báo số quá lớn có thể không hổ trợ!!!</i>
                      </p>
                    )}
                    <input
                      style={{ zIndex: "unset" }}
                      className="form-control"
                      type="number"
                      maxLength={10}
                      value={salary}
                      name="salary"
                      placeholder="Tiền Lương"
                      onChange={handleTien}
                      onKeyPress={handleTien}
                    />
                  </div>
                  {salary === "" || isNaN(salary) ? (
                    <div className="my-3"></div>
                  ) : (
                    <p className="salary-display bg-primary">{`${fm()} VNĐ`}</p>
                  )}
                </div>
                <UpdateSelects
                  handleCity={handleCity}
                  handleCareer={handleCareer}
                  city={city}
                  career={career}
                />
                <hr />
                <h4 className="text-uppercase text-secondary mt-5">
                  Thông tin liên hệ:
                </h4>
                <div className="control-group">
                  <div className="form-group floating-label-form-group controls mb-0 pb-2">
                    <input
                      onChange={handleEmail}
                      className="form-control"
                      name="email"
                      type="text"
                      value={email}
                      placeholder="E-mail"
                    />
                  </div>
                </div>
                <div className="control-group">
                  <div className="form-group floating-label-form-group controls mb-0 pb-2">
                    <label>SĐT</label>
                    <input
                      onChange={handleSDT}
                      className="form-control"
                      name="sdt"
                      type="number"
                      value={sdt}
                      placeholder="Số Điện Thoại"
                    />
                  </div>
                </div>
                <div className="control-group">
                  <div className="form-group floating-label-form-group controls mb-0 pb-2">
                    <label>Tên Liên Hệ</label>
                    <input
                      onChange={handleContact}
                      className="form-control"
                      name="contact"
                      type="text"
                      value={contact}
                      placeholder="Tên Người Liên Hệ"
                    />
                  </div>
                </div>
                <br />
                <div id="success" />
                <div className="form-group btn-post mt-3">
                  <button
                    className="btn btn-primary btn-xl "
                    id="sendMessageButton"
                    type="submit"
                  >
                    Cập Nhật Tuyển Dụng
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default UpdateRecruitment;
