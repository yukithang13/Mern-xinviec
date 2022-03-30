import React from "react";
import moment from "moment";
import "moment/locale/vi";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import RecruimentService from "../../Services/RecruimentService";

function MyTableRecruitment(props) {
  const dateCre = moment(props.recruitment.createdAt).format(
    "DD/MM/YYYY h:mm:ss"
  );

  const variable = {
    _id: props.recruitment._id,
    cityId: props.recruitment.city,
    careerId: props.recruitment.career,
  };

  const btnDeleteMyRecruitment = (id) => {
    id = props.recruitment._id;
    swal({
      title: "Bạn Có Chắc Không?",
      text: "Nếu xoá bài đăng này sẽ không khôi phục lại được",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        RecruimentService.deleteRecruitment(variable)
          .then(
            swal("Xoá Thành Công", {
              icon: "success",
            }),
            props.btnDeleteMyRecruitment(id)
          )
          .catch((err) =>
            swal("Xoá Không Thành Công", {
              icon: "error",
            })
          );
      }
    });
  };

  return (
    <tbody className="text-center">
      <tr>
        <th scope="row">{props.index + 1}</th>
        <td>{props.recruitment.title}</td>
        <td>{dateCre}</td>
        <td>{props.recruitment.status ? "Đã Phê Duyệt" : "Chưa Phê Duyệt"}</td>
        <td>
          <div className="row">
            <div className="col">
              <button type="button" className="btn btn-info mx-2 mb-3">
                <Link
                  style={{ color: "whitesmoke", textDecoration: "none" }}
                  to={`/recruitment/${props.recruitment._id}`}
                >
                  Xem
                </Link>
              </button>
              <button type="button" className="btn btn-warning mx-2 mb-3">
                <Link
                  style={{
                    color: "#2c3e50",
                    textDecoration: "none",
                  }}
                  to={`/updateRecruitment/${props.recruitment._id}`}
                >
                  Cập Nhật
                </Link>
              </button>
              <button
                onClick={btnDeleteMyRecruitment}
                type="button"
                className="btn btn-danger mx-2 mb-3"
              >
                Xoá
              </button>
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  );
}

export default MyTableRecruitment;
