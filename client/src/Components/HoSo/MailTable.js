import React from "react";
import moment from "moment";
import "moment/locale/vi";

function MailTable(props) {
  const dateCre = moment(props.mails.createdAt).format("DD/MM/YYYY h:mm:ss");

  const Checked = (id, status) => {
    id = props.mails._id;
    status = props.mails.status;
    props.Checked(id, status);
  };

  const deleteMail = (id) => {
    id = props.mails._id;
    props.deleteMail(id);
  };

  const profile = props.mails.profile;

  const DetailsCV = (id) => {
    id = props.mails._id;
    props.DetailsCV(id);
  };
  return (
    <>
      <tbody className="text-center">
        <tr>
          <th scope="row">{props.index + 1}</th>
          <td>{profile.name}</td>
          <td>{profile.email}</td>
          <td>{dateCre}</td>
          <td>
            <div className="row">
              <div className="col">
                {props.mails.status ? (
                  <>
                    <button
                      type="button"
                      data-toggle="modal"
                      data-target="#exampleModalLong"
                      className="btn btn-info mx-2 mb-3"
                      title="Xem Chi Tiết"
                      onClick={DetailsCV}
                    >
                      <i className="fa fa-eye" aria-hidden="true"></i>
                    </button>
                    <button
                      type="button"
                      onClick={deleteMail}
                      className="btn btn-danger mx-2 mb-3"
                      title="Xoá Hồ Sơ"
                    >
                      <i className="fa fa-trash" aria-hidden="true"></i>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      data-toggle="modal"
                      data-target="#exampleModalLong"
                      className="btn btn-info mx-2 mb-3"
                      onClick={DetailsCV}
                      title="Xem Chi Tiết"
                    >
                      <i className="fa fa-eye" aria-hidden="true"></i>
                    </button>
                    <button
                      type="button"
                      onClick={Checked}
                      className="btn btn-success mx-2 mb-3"
                      title="Duyệt Hồ Sơ"
                    >
                      <i className="fa fa-check" aria-hidden="true"></i>
                    </button>
                  </>
                )}
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </>
  );
}

export default MailTable;
