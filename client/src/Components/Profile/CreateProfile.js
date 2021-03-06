import React, { useContext, useEffect, useState } from "react";
import Helmet from "react-helmet";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import vi from "date-fns/locale/vi";
import "./index.css";
import Message from "../Message/Message";
import { AuthContext } from "../../Context/AuthContext";

import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import ProfileService from "../../Services/ProfileService";
registerLocale("vi", vi);

function CreateProfile(props) {
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
  const [existProfile, setExistProfile] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    window.scrollTo({ top: 0.1, behavior: "smooth" });
    ProfileService.getProfile().then((data) => {
      if (data.success) {
        setExistProfile(data.existProfile);
      }
    });
  }, []);

  const userID = props.match.params.id;

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
    ProfileService.createProfile(variable).then((data) => {
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

  if (user._id !== userID || existProfile) {
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

  return (
    <>
      <Helmet>
        <title>T???o H??? S??</title>
      </Helmet>
      <section className="page-section my-3 post">
        <div className="container">
          <h2 className="page-section-heading text-center text-uppercase text-secondary mb-0">
            T???o H??? S?? C?? Nh??n
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
                  Th??ng Tin C?? Nh??n:
                </h4>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label className="text-secondary" htmlFor="inputname">
                      H??? V?? T??n
                    </label>
                    <input
                      name="name"
                      type="text"
                      value={info.name}
                      onChange={onChangeInfo}
                      className="form-control"
                      placeholder="Nh???p h??? v?? t??n"
                    />
                  </div>
                  <div className="form-group col-md-3">
                    <label className="text-secondary" htmlFor="inputemail">
                      Ng??y Sinh
                    </label>
                    <br />
                    <DatePicker
                      name="birthday"
                      className="form-control"
                      selected={birthday}
                      value={birthday}
                      dateFormat="dd/MM/yyyy"
                      disabledKeyboardNavigation
                      placeholderText="Ng??y Sinh"
                      onChange={onChangeDate}
                      locale="vi"
                      showYearDropdown
                      scrollableMonthYearDropdown
                    />
                  </div>
                  <div className="form-group col-md-3">
                    <label className="text-secondary" htmlFor="inputZip">
                      Gi???i T??nh
                    </label>
                    <select
                      value={info.gender}
                      onChange={onChangeInfo}
                      name="gender"
                      id="inputState"
                      className="form-control"
                    >
                      <option value="Nam">Nam</option>
                      <option value="N???">N???</option>
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
                      placeholder="Nh???p e-mail"
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label className="text-secondary" htmlFor="inputState">
                      S??? ??i???n Tho???i
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
                      K??? N??ng{" "}
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
                      S??? Th??ch{" "}
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
                <h4 className="text-uppercase text-secondary mt-3">H???c V???n:</h4>
                <div className="form-group mt-3">
                  <Editor
                    className="form-control"
                    placeholder="Nh???p m?? t??? h???c v???n ..."
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
                  Kinh Nghi???m:
                </h4>
                <div className="form-group mt-3">
                  <Editor
                    className="form-control"
                    placeholder="Nh???p m?? t??? kinh nghi???m ..."
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
                  M???c Ti??u:
                </h4>
                <div className="form-group mt-3">
                  <Editor
                    className="form-control"
                    placeholder="Nh???p m?? t??? m???c ti??u ..."
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
                T???o H??? S??
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default CreateProfile;
