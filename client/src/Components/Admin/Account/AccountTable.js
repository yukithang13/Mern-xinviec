import React, { useEffect, useState } from "react";
import moment from "moment";
import "moment/locale/vi";

function AccountTable(props) {
  const [role, setRole] = useState("");
  const dateCre = moment(props.accounts.createdAt).format("DD/MM/YYYY h:mm:ss");
  const updateStatusAcc = (id, status) => {
    id = props.accounts._id;
    status = props.accounts.status;
    props.updateStatusAcc(id, status);
  };

  useEffect(() => {
    if (props.accounts.role) {
      if (props.accounts.role === "candidate") {
        setRole("Ứng Viên");
      }
      if (props.accounts.role === "recruiter") {
        setRole("Tuyển Dụng");
      }
      if (props.accounts.role === "spadmin") {
        setRole("spadmin");
      } else if (props.accounts.role === "admin") {
        setRole("admin");
      }
    }
  }, [props.accounts.role]);

  return (
    <tbody className="text-center">
      <tr>
        <th scope="row">{props.index + 1}</th>
        <td>{props.accounts.username}</td>
        <td>{dateCre}</td>
        <td>{role}</td>
        <td>
          <div className="row">
            <div className="col">
              {props.accounts.status ? (
                <button
                  type="button"
                  onClick={updateStatusAcc}
                  className="btn btn-info mx-2 mb-3"
                >
                  <i className="fas fa-lock-open"></i>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={updateStatusAcc}
                  className="btn btn-danger mx-2 mb-3"
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

export default AccountTable;
