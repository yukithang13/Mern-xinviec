import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "../Home/Home";
import Login from "../Login/Login";
import PostRecruitment from "../PostRecruitment/PostRecruitment";
import Register from "../Register/Register";
import Search from "../Search/Search";
import UpdateRecruitment from "../UpdateRecruitment/UpdateRecruitment";
import PrivateRouter from "../../ProtectingRouter/PrivateRouter";
import UnPrivateRouter from "../../ProtectingRouter/UnPrivateRouter";
import DetailRecruitment from "../DetailRecruitment/DetailRecruitment";
import MyRecruitment from "../MyRecruitment/MyRecruitment";
import Account from "../Admin/Account/Account";
import Recruitment from "../Admin/Recruitment/Recruitment";
import RecruitmentFalse from "../Admin/Recruitment/RecruitmentFalse";
import HoSo from "../HoSo/Mail";
import HoSoChecked from "../HoSo/MailChecked";
import SearchCityOrCareer from "../Search/SearchCityOrCareer";
import Profile from "../Profile/Profile";
import CreateProfile from "../Profile/CreateProfile";
import UpdateProfile from "../Profile/UpdateProfile";

function DuongDanURL() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <UnPrivateRouter path="/login" component={Login} />
      <UnPrivateRouter path="/register" component={Register} />
      <PrivateRouter
        path="/postRecruitment"
        roles={["recruiter", "admin", "spadmin"]}
        component={PostRecruitment}
      />
      <PrivateRouter
        path="/updateRecruitment/:id"
        roles={["recruiter", "admin", "spadmin"]}
        component={UpdateRecruitment}
      />
      <Route path="/search" component={Search} />
      <Route path="/recruitment/:id" component={DetailRecruitment} />
      <PrivateRouter
        path="/myRecruitment/:id-page=:page"
        roles={["recruiter", "admin", "spadmin"]}
        component={MyRecruitment}
      />
      <PrivateRouter
        path="/admin/account/:id&page=:page"
        roles={["admin", "spadmin"]}
        component={Account}
      />
      <PrivateRouter
        path="/admin/recruitment/:id&page=:page&true"
        roles={["admin", "spadmin"]}
        component={Recruitment}
      />
      <PrivateRouter
        path="/admin/recruitment/:id&page=:page&false"
        roles={["admin", "spadmin"]}
        component={RecruitmentFalse}
      />
      <PrivateRouter
        path="/mail/:id&false&page=:page"
        roles={["admin", "spadmin", "recruiter"]}
        component={HoSo}
      />
      <PrivateRouter
        path="/mail/:id&true&page=:page"
        roles={["admin", "spadmin", "recruiter"]}
        component={HoSoChecked}
      />
      <PrivateRouter
        path="/profile"
        roles={["candidate"]}
        component={Profile}
      />
      <PrivateRouter
        path="/:id/createProfile"
        roles={["candidate"]}
        component={CreateProfile}
      />
      <PrivateRouter
        path="/:person/updateProfile"
        roles={["candidate"]}
        component={UpdateProfile}
      />
      <Route path="/:id/search=:thanhpho" component={SearchCityOrCareer} />
    </Switch>
  );
}

export default DuongDanURL;
