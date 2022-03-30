import React from "react";
import moment from "moment";
import "moment/locale/vi";
import { Link } from "react-router-dom";
import { badWordFilter } from "../../../Shared/filterBadWords";
import Tippy from "@tippy.js/react";
import "tippy.js/dist/tippy.css";

function RecruitmentTableFalse(props) {
  const dateCre = moment(props.recruitmentFalse.createdAt).format(
    "DD/MM/YYYY h:mm:ss"
  );

  const updateStatusRcm = (id, status) => {
    id = props.recruitmentFalse._id;
    status = props.recruitmentFalse.status;
    props.updateStatusRcm(id, status);
  };

  const deleteRcmFalse = (id, cityId, careerId) => {
    id = props.recruitmentFalse._id;
    cityId = props.recruitmentFalse.city._id;
    careerId = props.recruitmentFalse.career._id;
    props.deleteRcmFalse(id, cityId, careerId);
  };

  return (
    <tbody className="text-center">
      <tr>
        <th scope="row">{props.index + 1}</th>
        <Tippy
          content={
            badWordFilter(
              [
                props.recruitmentFalse.title,
                props.recruitmentFalse.description,
                props.recruitmentFalse.contact,
                props.recruitmentFalse.email,
              ].join(" ")
            ) ? (
              <span>
                <h1 style={{ color: "red", textAlign: "center" }}>
                  <span
                    role="img"
                    aria-label="warning"
                    aria-labelledby="warning"
                  >
                    Cảnh Báo ⚠️
                  </span>
                </h1>
                <p style={{ fontWeight: "bold", fontSize: 15 }}>
                  Nghi Vấn Chứa Từ Ngữ Nhạy Cảm
                </p>
              </span>
            ) : (
              ""
            )
          }
        >
          <td
            style={
              badWordFilter(
                [
                  props.recruitmentFalse.title,
                  props.recruitmentFalse.description,
                  props.recruitmentFalse.contact,
                  props.recruitmentFalse.email,
                ].join(" ")
              )
                ? { color: "red" }
                : {}
            }
          >
            {props.recruitmentFalse.title}
          </td>
        </Tippy>

        <td>
          {props.recruitmentFalse.writer
            ? props.recruitmentFalse.writer.username
            : "KHÔNG CÓ THÔNG TIN"}
        </td>
        <td>{dateCre}</td>
        <td>
          <div className="row">
            <div className="col">
              <button type="button" className="btn btn-primary mx-2 mb-3">
                <Link
                  target="_blank"
                  style={{ color: "whitesmoke", textDecoration: "none" }}
                  to={`/recruitment/${props.recruitmentFalse._id}`}
                >
                  Xem
                </Link>
              </button>
              <button
                onClick={deleteRcmFalse}
                type="button"
                className="btn btn-danger mx-2 mb-3"
              >
                Xoá
              </button>
            </div>
          </div>
        </td>
        <td>
          <div className="row">
            <div className="col">
              {props.recruitmentFalse.status ? (
                <button
                  type="button"
                  className="btn btn-info mx-2 mb-3"
                  onClick={updateStatusRcm}
                >
                  <i className="fas fa-lock-open"></i>
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-danger mx-2 mb-3"
                  onClick={updateStatusRcm}
                >
                  <i className="fas fa-lock"></i>
                </button>
              )}
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  );
}

export default RecruitmentTableFalse;
