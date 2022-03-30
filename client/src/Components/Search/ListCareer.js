import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import RecruimentService from "../../Services/RecruimentService";
import chuyenDoiURL from "../../Shared/ChuyenDoiURL";

function ListCareer(props) {
  const [totalRecruitment, setTotalRecruitment] = useState(0);
  useEffect(() => {
    const variable = {
      idcity: props.career._id,
      idcareer: props.career._id,
    };
    RecruimentService.loadRecruitmentById(variable).then((data) => {
      if (data.success) {
        setTotalRecruitment(data.total);
      }
    });
  }, [props.career._id]);

  return (
    <NavLink
      to={`/${props.career._id}/search=${chuyenDoiURL(props.career.name)}`}
    >
      <li className="list-group-item">
        {props.career.name + ` (${totalRecruitment})`}
      </li>
    </NavLink>
  );
}

export default ListCareer;
