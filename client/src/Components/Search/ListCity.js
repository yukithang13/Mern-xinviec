import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import RecruimentService from "../../Services/RecruimentService";
import chuyenDoiURL from "../../Shared/ChuyenDoiURL";

function ListCity(props) {
  const [totalRecruitment, setTotalRecruitment] = useState(0);
  useEffect(() => {
    const variable = {
      idcity: props.city._id,
      idcareer: props.city._id,
    };
    RecruimentService.loadRecruitmentById(variable).then((data) => {
      if (data.success) {
        setTotalRecruitment(data.total);
      }
    });
  }, [props.city._id]);

  return (
    <NavLink to={`/${props.city._id}/search=${chuyenDoiURL(props.city.name)}`}>
      <li className="list-group-item">
        {props.city.name + ` (${totalRecruitment})`}
      </li>
    </NavLink>
  );
}

export default ListCity;
