import React, { useEffect, useState } from "react";
import Helmet from "react-helmet";
import ProfileService from "../../Services/ProfileService";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import vi from "date-fns/locale/vi";
import "./index.css";
import Message from "../Message/Message";

import { Editor } from "react-draft-wysiwyg";
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromHTML,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
registerLocale("vi", vi);

function UpdateProfile(props) {
  const [profile, setProfile] = useState(1);
  const [existProfile, setExitsProfile] = useState([]);
  const [info, setInfo] = useState({
    name: "",
    sdt: "",
    email: "",
    gender: "Nam",
    skill: "",
    hobby: "",
  });
  const [birthday, setBirthday] = useState(new Date("01/01/2000"));
  const [length, setLength] = useState({ skill: 0, hobby: 0 });

  const [degree, setDegree] = useState(EditorState.createEmpty());
  const [experience, setExperience] = useState(EditorState.createEmpty());
  const [target, setTarget] = useState(EditorState.createEmpty());

  const [message, setMessage] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0.1, behavior: "smooth" });
    ProfileService.getProfile().then((data) => {
      setTimeout(() => {
        if (data || data.success || data.existProfile) {
          const { existProfile, prof } = data;
          setExitsProfile(existProfile);
          setProfile(prof);
          if (prof) {
            setInfo({
              name: prof.name,
              sdt: prof.sdt,
              email: prof.email,
              gender: prof.gender,
              skill: prof.skill.replace("<br/>", "\n"),
              hobby: prof.hobby.replace("<br/>", "\n"),
            });
            setBirthday(new Date(prof.birthday));
            setLength({ skill: prof.skill.length, hobby: prof.hobby.length });
            setDegree(
              EditorState.createWithContent(
                ContentState.createFromBlockArray(convertFromHTML(prof.degree))
              )
            );
            setExperience(
              EditorState.createWithContent(
                ContentState.createFromBlockArray(
                  convertFromHTML(prof.experience)
                )
              )
            );
            setTarget(
              EditorState.createWithContent(
                ContentState.createFromBlockArray(convertFromHTML(prof.target))
              )
            );
          }
        }
      }, 750);
    });
  }, []);

  const onEditorDegree = (value) => {
    setDegree(value);
  };

  const onEditorExperience = (value) => {
    setExperience(value);
  };

  const onEditorTarget = (value) => {
    setTarget(value);
  };

  const onChangeDate = (date) => {
    setBirthday(date);
  };

  const onChangeInfo = (e) => {
    const newInfo = { ...info };
    newInfo[e.target.name] = e.target.value;
    const newLength = { ...length };
    newLength[e.target.name] = e.target.value.length;

    setLength(newLength);
    setInfo(newInfo);
  };

  const _degree = draftToHtml(convertToRaw(degree.getCurrentContent()));
  const _experience = draftToHtml(convertToRaw(experience.getCurrentContent()));
  const _target = draftToHtml(convertToRaw(target.getCurrentContent()));

  const variable = {
    name: info.name,
    birthday: birthday,
    sdt: info.sdt,
    email: info.email,
    degree: _degree,
    experience: _experience,
    skill: info.skill.replace(/\r?\n/, "<br/>"),
    hobby: info.hobby.replace(/\r?\n/, "<br/>"),
    target: _target,
    gender: info.gender,
  };

  const onSubmit = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    ProfileService.updateProfile(variable).then((data) => {
      const { message } = data;
      if (data.success) {
        setMessage(message);
        setTimeout(() => {
          props.history.push("/profile");
        }, 1500);
      } else {
        setMessage(message);
      }
    });
  };

  if (!existProfile) {
    return (
      <>
        <Helmet>
          <title>Not Found</title>
        </Helmet>

        <section className="page-section my-3 search">
          <div className="container">
            <h2 className="page-section-heading text-center text-uppercase text-secondary mb-0">
              Not Found
            </h2>
            <div className="divider-custom">
              <div className="divider-custom-line" />
              <div className="divider-custom-icon">
                <i className="fas fa-star" />
              </div>
              <div className="divider-custom-line" />
            </div>
            <div className="row">
              <div className="col d-flex justify-content-center">
                <img
                  src={"assets/img/404.svg"}
                  className="not-found"
                  alt="404"
                />
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
  if (profile === 1) {
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
  } else {
    return (
      <>
        <Helmet>
          <title>Cập Nhật Hồ Sơ</title>
        </Helmet>
        <section className="page-section my-3 post">
          <div className="container">
            <h2 className="page-section-heading text-center text-uppercase text-secondary mb-0">
              Cập Nhật Hồ Sơ Cá Nhân
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
                <form>
                  <h4 className="text-uppercase text-secondary mt-3">
                    Thông Tin Cá Nhân:
                  </h4>
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label className="text-secondary" htmlFor="inputname">
                        Họ Và Tên
                      </label>
                      <input
                        name="name"
                        type="text"
                        value={info.name}
                        onChange={onChangeInfo}
                        className="form-control"
                        placeholder="Nhập họ và tên"
                      />
                    </div>
                    <div className="form-group col-md-3">
                      <label className="text-secondary" htmlFor="inputemail">
                        Ngày Sinh
                      </label>
                      <br />
                      <DatePicker
                        name="birthday"
                        className="form-control"
                        selected={birthday}
                        value={birthday}
                        dateFormat="dd/MM/yyyy"
                        disabledKeyboardNavigation
                        placeholderText="Ngày Sinh"
                        onChange={onChangeDate}
                        locale="vi"
                        showYearDropdown
                        scrollableMonthYearDropdown
                      />
                    </div>
                    <div className="form-group col-md-3">
                      <label className="text-secondary" htmlFor="inputZip">
                        Giới Tính
                      </label>
                      <select
                        value={info.gender}
                        onChange={onChangeInfo}
                        name="gender"
                        id="inputState"
                        className="form-control"
                      >
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label className="text-secondary" htmlFor="inputemail">
                        E-mail
                      </label>
                      <input
                        value={info.email}
                        onChange={onChangeInfo}
                        name="email"
                        type="email"
                        className="form-control"
                        placeholder="Nhập e-mail"
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label className="text-secondary" htmlFor="inputState">
                        Số Điện Thoại
                      </label>
                      <input
                        value={info.sdt}
                        onChange={onChangeInfo}
                        name="sdt"
                        type="number"
                        className="form-control"
                        id="inputZip"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label className="text-secondary" htmlFor="inputemail">
                        Kỹ Năng{" "}
                        <i
                          style={
                            length.skill < 150
                              ? { color: "#97999b" }
                              : { color: "red" }
                          }
                        >{`(${length.skill}/150)`}</i>
                      </label>
                      <textarea
                        value={info.skill}
                        name="skill"
                        onChange={onChangeInfo}
                        maxLength="150"
                        className="form-control"
                        rows="3"
                        style={{ resize: "none" }}
                      ></textarea>
                    </div>
                    <div className="form-group col-md-6">
                      <label className="text-secondary" htmlFor="inputemail">
                        Sở Thích{" "}
                        <i
                          style={
                            length.hobby < 150
                              ? { color: "#97999b" }
                              : { color: "red" }
                          }
                        >{`(${length.hobby}/150)`}</i>
                      </label>
                      <textarea
                        value={info.hobby}
                        name="hobby"
                        onChange={onChangeInfo}
                        maxLength="150"
                        className="form-control"
                        rows="3"
                        style={{ resize: "none" }}
                      ></textarea>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-8 mx-auto sp-ct">
                <form>
                  <h4 className="text-uppercase text-secondary mt-3">
                    Học Vấn:
                  </h4>
                  <div className="form-group mt-3">
                    <Editor
                      className="form-control"
                      placeholder="Nhập mô tả học vấn ..."
                      editorState={degree}
                      wrapperClassName="wrapper-class"
                      editorClassName="editor-class"
                      toolbarClassName="toolbar-class"
                      onEditorStateChange={onEditorDegree}
                      toolbar={{
                        options: [
                          "inline",
                          "blockType",
                          "fontFamily",
                          "list",
                          "colorPicker",
                          "history",
                        ],
                        inline: {
                          inDropdown: false,
                          className: undefined,
                          component: undefined,
                          dropdownClassName: undefined,
                          options: [
                            "bold",
                            "italic",
                            "underline",
                            "strikethrough",
                            "superscript",
                            "subscript",
                          ],
                        },
                        blockType: {
                          inDropdown: true,
                          options: ["Normal", "H3", "H4", "H5", "H6"],
                          className: undefined,
                          component: undefined,
                          dropdownClassName: undefined,
                        },
                      }}
                    />
                  </div>
                </form>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-8 mx-auto sp-ct">
                <form>
                  <h4 className="text-uppercase text-secondary mt-3">
                    Kinh Nghiệm:
                  </h4>
                  <div className="form-group mt-3">
                    <Editor
                      className="form-control"
                      placeholder="Nhập mô tả kinh nghiệm ..."
                      editorState={experience}
                      wrapperClassName="wrapper-class"
                      editorClassName="editor-class"
                      toolbarClassName="toolbar-class"
                      onEditorStateChange={onEditorExperience}
                      toolbar={{
                        options: [
                          "inline",
                          "blockType",
                          "fontFamily",
                          "list",
                          "colorPicker",
                          "history",
                        ],
                        inline: {
                          inDropdown: false,
                          className: undefined,
                          component: undefined,
                          dropdownClassName: undefined,
                          options: [
                            "bold",
                            "italic",
                            "underline",
                            "strikethrough",
                            "superscript",
                            "subscript",
                          ],
                        },
                        blockType: {
                          inDropdown: true,
                          options: ["Normal", "H3", "H4", "H5", "H6"],
                          className: undefined,
                          component: undefined,
                          dropdownClassName: undefined,
                        },
                      }}
                    />
                  </div>
                </form>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-8 mx-auto sp-ct">
                <form>
                  <h4 className="text-uppercase text-secondary mt-3">
                    Mục Tiêu:
                  </h4>
                  <div className="form-group mt-3">
                    <Editor
                      className="form-control"
                      placeholder="Nhập mô tả mục tiêu ..."
                      editorState={target}
                      wrapperClassName="wrapper-class"
                      editorClassName="editor-class"
                      toolbarClassName="toolbar-class"
                      onEditorStateChange={onEditorTarget}
                      toolbar={{
                        options: [
                          "inline",
                          "blockType",
                          "fontFamily",
                          "list",
                          "colorPicker",
                          "history",
                        ],
                        inline: {
                          inDropdown: false,
                          className: undefined,
                          component: undefined,
                          dropdownClassName: undefined,
                          options: [
                            "bold",
                            "italic",
                            "underline",
                            "strikethrough",
                            "superscript",
                            "subscript",
                          ],
                        },
                        blockType: {
                          inDropdown: true,
                          options: ["Normal", "H3", "H4", "H5", "H6"],
                          className: undefined,
                          component: undefined,
                          dropdownClassName: undefined,
                        },
                      }}
                    />
                  </div>
                </form>
              </div>
            </div>

            <div className="row mt-2">
              <div className="col text-center">
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={onSubmit}
                >
                  Cập Nhật Hồ Sơ
                </button>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
}

export default UpdateProfile;
