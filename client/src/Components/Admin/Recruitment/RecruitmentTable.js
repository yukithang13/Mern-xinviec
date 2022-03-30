import React from "react";
import moment from "moment";
import "moment/locale/vi";
import { Link } from "react-router-dom";

function RecruitmentTable(props) {
  const dateCre = moment(props.recruitmentTrue.createdAt).format(
    "DD/MM/YYYY h:mm:ss"
  );

  const updateStatusRcm = (id, status) => {
    id = props.recruitmentTrue._id;
    status = props.recruitmentTrue.status;
    props.updateStatusRcm(id, status);
  };

  return (
    <tbody className="text-center">
      <tr>
        <th scope="row">{props.index + 1}</th>
        <td>{props.recruitmentTrue.title}</td>
        <td>
          {props.recruitmentTrue.writer
            ? props.recruitmentTrue.writer.username
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
                  to={`/recruitment/${props.recruitmentTrue._id}`}
                >
                  Xem
                </Link>
              </button>
            </div>
          </div>
        </td>
        <td>
          <div className="row">
            <div className="col">
              {props.recruitmentTrue.status ? (
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

export default RecruitmentTable;
