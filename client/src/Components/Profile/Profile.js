import React, { useContext, useEffect, useState } from "react";
import Helmet from "react-helmet";
import ProfileService from "../../Services/ProfileService";
import ProfileItem from "./ProfileItem";
import { AuthContext } from "../../Context/AuthContext";

function Profile(props) {
  const [profile, setProfile] = useState(1);
  const [existProfile, setExitsProfile] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    ProfileService.getProfile().then((data) => {
      setTimeout(() => {
        if (data || data.success) {
          const { existProfile } = data;
          setExitsProfile(existProfile);
          setProfile(data.prof);
        }
      }, 750);
    });
  }, []);

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
          <title>Hồ Sơ Cá Nhân</title>
        </Helmet>
        <section className="page-section my-3 login">
          <div className="container" style={{ minHeight: 488 }}>
            <h2 className="page-section-heading text-center text-uppercase text-secondary mb-0 no-select">
              hồ sơ cá nhân
            </h2>
            <div className="divider-custom">
              <div className="divider-custom-line" />
              <div className="divider-custom-icon">
                <i className="fas fa-star" />
              </div>
              <div className="divider-custom-line" />
            </div>
            {existProfile ? (
              <div className="row mx-auto">
                <ProfileItem profile={profile} />
              </div>
            ) : (
              <div className="alert alert-warning no-select" role="alert">
                <strong>
                  <span role="img" aria-label="warning">
                    ⚠️
                  </span>{" "}
                  Tài khoản này chưa được tạo hồ sơ, bạn cần tạo một hồ sơ để có
                  thể ứng tuyển vào công việc mong muốn. Tạo hồ sơ{" "}
                  <a
                    href={`/${user._id}/createProfile`}
                    className="text-uppercase"
                  >
                    Tại Đây!
                  </a>
                </strong>
              </div>
            )}
          </div>
        </section>
      </>
    );
  }
}

export default Profile;
