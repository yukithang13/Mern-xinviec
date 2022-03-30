import React, { useState } from "react";
import "./index.css";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import vi from "date-fns/locale/vi";
import CVService from "../../Services/CVService";
import Message from "../Message/Message";
registerLocale("vi", vi);

function ModalCV(props) {
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date("01/01/2000"));
  const [sdt, setSDT] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState(null);

  const onChangeName = (e) => {
    setName(e.target.value);
  };

  const ChangeDate = (date) => {
    setDate(date);
  };

  const onChangeSDT = (e) => {
    setSDT(e.target.value);
  };

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangeDescription = (e) => {
    setDescription(e.target.value);
  };

  const closeModal = () => {
    props.closeModal();
  };

  const clearForm = () => {
    setName("");
    setDate("");
    setSDT("");
    setEmail("");
    setDescription("");
  };

  const variable = {
    name: name,
    birthday: date,
    sdt: sdt,
    email: email,
    description: description,
    recruitment: props.id,
    receiver: props.recruitment.writer._id,
  };

  const onSubmit = (e) => {
    e.preventDefault();
    CVService.createCV(variable).then((data) => {
      if (data.success) {
        clearForm();
        setMessage(data.message);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setMessage(data.message);
      }
    });
  };

  return (
    <>
      <div className="modal-wrapper">
        <div className="modal-backdrop" onClick={closeModal} />
        <div className="row justify-content-center">
          <div className="modal-box ">
            <div className="row justify-content-center py-1">
              <p className="text-uppercase text-secondary title">
                Thông Tin Cá Nhân
              </p>
            </div>
            <div className="row">
              <div className="col d-flex justify-content-center">
                <form
                  id="contactForm"
                  name="sentMessage"
                  noValidate="novalidate"
                  style={{ width: "50%" }}
                  onSubmit={onSubmit}
                >
                  <div className="control-group">
                    <div className="form-group floating-label-form-group controls mb-0 pb-2">
                      <input
                        className="form-control"
                        name="name"
                        type="text"
                        placeholder="Họ và Tên"
                        value={name}
                        onChange={onChangeName}
                      />
                    </div>
                  </div>
                  <div className="control-group">
                    <div className="form-group floating-label-form-group controls mb-0 pb-2">
                      <label>Ngày Sinh</label>
                      <DatePicker
                        selected={date}
                        value={date}
                        dateFormat="dd/MM/yyyy"
                        disabledKeyboardNavigation
                        placeholderText="Ngày Sinh"
                        onChange={ChangeDate}
                        locale="vi"
                        showYearDropdown
                        scrollableMonthYearDropdown
                      />
                      <p className="help-block text-danger" />
                    </div>
                  </div>
                  <div className="control-group">
                    <div className="form-group floating-label-form-group controls mb-0 pb-2">
                      <label>SĐT</label>
                      <input
                        className="form-control"
                        name="sdt"
                        type="text"
                        placeholder="Số Điện Thoại"
                        value={sdt}
                        onChange={onChangeSDT}
                      />
                    </div>
                  </div>
                  <div className="control-group">
                    <div className="form-group floating-label-form-group controls mb-0 pb-2">
                      <label>E-mail</label>
                      <input
                        className="form-control"
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={onChangeEmail}
                      />
                    </div>
                  </div>
                  <div className="control-group">
                    <div className="form-group floating-label-form-group controls mb-0 pb-2">
                      <label>Mô Tả</label>
                      <textarea
                        className="form-control description"
                        name="description"
                        type="text"
                        placeholder="Lời Nhắn"
                        value={description}
                        onChange={onChangeDescription}
                      />
                    </div>
                  </div>
                  <br />
                  <div id="success" />
                  <div className="form-group">
                    <div className="row mx-0">
                      <button
                        className="btn btn-primary btn-xl"
                        id="sendMessageButton"
                        type="submit"
                        disabled={!props.user.status ? true : false}
                      >
                        Nộp Hồ Sơ
                      </button>
                      <span className="mx-5 pt-3">
                        {message ? <Message message={message} /> : null}
                      </span>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="row mt-5">
              <p
                onClick={closeModal}
                className="no-select exit text-uppercase text-secondary"
                style={{
                  cursor: "pointer",
                  position: "absolute",
                  top: "0px",
                  right: "16px",
                  fontSize: "25px",
                  fontFamily: "cursive",
                }}
              >
                X
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ModalCV;
