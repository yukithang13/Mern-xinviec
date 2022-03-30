import React, { useEffect, useState } from "react";
import "./index.css";
import { Helmet } from "react-helmet";
import RecruimentService from "../../Services/RecruimentService";
import RecruitmentItem from "./RecruitmentItem";
import CityService from "../../Services/CityService";
import CareerService from "../../Services/CareerService";
function SearchCityOrCareer(props) {
  const id = props.match.params.id;
  const [reacruitment, setRecruitment] = useState("");
  const [city, setCity] = useState("");
  const [career, setCareer] = useState("");
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(null);
  const [animationLoad, setAnimationLoad] = useState(0);
  const [emty, setEmty] = useState(null);
  const [dem, setdem] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0.1, behavior: "smooth" });

    const variableID = {
      idcity: id,
      idcareer: id,
    };

    CityService.getCityById(variableID).then((data) => {
      setCity(data.ct);
    });

    CareerService.getCareerById(variableID).then((data) => {
      setCareer(data.career);
    });

    setTimeout(() => {
      const variable = {
        idcity: id,
        idcareer: id,
        skip: skip,
      };
      getRecruitment(variable);
    }, 750);
  }, []);

  const getRecruitment = (variable) => {
    RecruimentService.loadRecruitmentByIdLoadMore(variable).then((data) => {
      if (data.success) {
        setRecruitment([...reacruitment, data.rcm]);
        setTotal(data.total);
        setEmty(data.emty);
      }
    });
  };

  const newRecruitment = [...reacruitment];

  const renderList = newRecruitment.map((recruitment, index) => (
    <RecruitmentItem recruitment={recruitment} key={index} />
  ));

  const loadMore = () => {
    const Skip = skip + 3;
    const Dem = dem + 1;
    const variable = {
      idcity: id,
      idcareer: id,
      skip: Skip,
    };

    const top = animationLoad + 450;

    window.scrollTo({ top: top, behavior: "smooth" });

    getRecruitment(variable);

    setSkip(Skip);
    setdem(Dem);
    setAnimationLoad(top);
  };

  const totalLoadMore = Math.ceil(total / 3);

  return (
    <>
      <Helmet>
        {city ? (
          <title>{city.name}</title>
        ) : career ? (
          <title>{career.name}</title>
        ) : null}
      </Helmet>
      <section className="page-section my-3 search">
        <div className="container" style={{ minHeight: "535px" }}>
          {!city && !career ? (
            <h2 className="page-section-heading text-center text-uppercase text-secondary mb-0">
              ???????
            </h2>
          ) : city ? (
            <h2 className="page-section-heading text-center text-uppercase text-secondary mb-0">
              {city.name}
            </h2>
          ) : (
            <h2 className="page-section-heading text-center text-uppercase text-secondary mb-0">
              {career.name}
            </h2>
          )}

          <div className="divider-custom">
            <div className="divider-custom-line" />
            <div className="divider-custom-icon">
              <i className="fas fa-star" />
            </div>
            <div className="divider-custom-line" />
          </div>
          {!reacruitment ? (
            <div className="row">
              <div className="col">
                <p
                  className="d-flex justify-content-center"
                  style={{
                    color: "#1d365ac7",
                    fontWeight: "bold",
                    fontSize: 100,
                    minHeight: 300,
                    marginTop: 33,
                  }}
                >
                  Loading...
                </p>
              </div>
            </div>
          ) : emty ? (
            <>
              <div className="row mt-5 mb-5 no-select">
                <div className="col d-flex justify-content-center">
                  <img
                    src="assets/img/broke.svg"
                    alt="search"
                    className="img-search"
                    style={{
                      maxWidth: "30%",
                    }}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="row" style={{ paddingBottom: "-50px" }}>
                {renderList}
              </div>
              {dem === totalLoadMore || total <= 3 ? null : (
                <div className="row">
                  <div className="col mx-auto d-flex justify-content-center">
                    <i
                      className="icon fas fa-chevron-down loadMore"
                      onClick={loadMore}
                    ></i>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default SearchCityOrCareer;
