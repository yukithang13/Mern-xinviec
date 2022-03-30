import React, { useEffect, useState } from "react";
import "./index.css";
import { Helmet } from "react-helmet";
import RecruitmentItem from "./RecruitmentItem";
import RecruimentService from "../../Services/RecruimentService";
import CityService from "../../Services/CityService";
import CareerService from "../../Services/CareerService";
import ListCity from "./ListCity";
import ListCareer from "./ListCareer";

function Search(props) {
  const [recruitmentSearch, setrecruitmentSearch] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [skip, setSkip] = useState(0);
  const [exist, setExist] = useState(true);
  const [total, setTotal] = useState(0);
  const [animationLoad, setAnimationLoad] = useState(0);
  const [cities, setCities] = useState([]);
  const [careers, setCareers] = useState([]);
  const [dem, setdem] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0.1, behavior: "smooth" });

    CityService.getCity().then((data) => {
      if (data.success) {
        setCities(data.ct);
      }
    });

    CareerService.getCareer().then((data) => {
      if (data.success) {
        setCareers(data.cv);
      }
    });
  }, []);

  const getRecruitment = (variable) => {
    RecruimentService.searchRecruitment(variable).then((data) => {
      const { result, exist, total } = data;

      setrecruitmentSearch([...recruitmentSearch, result]);
      setExist(exist);
      setTotal(total);
    });
  };

  const onChangeInputSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const onSearch = (e) => {
    e.preventDefault();
    const variable = {
      searchTerm: searchTerm,
      skip: 0,
    };

    if (searchTerm) {
      setSkip(0);
      recruitmentSearch.splice(0, recruitmentSearch.length);
      getRecruitment(variable);
      window.scrollTo({ top: 14.5, behavior: "smooth" });
    } else {
      setrecruitmentSearch([]);
      setExist(true);
      window.scrollTo({ top: 0.1, behavior: "smooth" });
    }
  };

  const newRcmSearch = [...recruitmentSearch];

  const renderList = newRcmSearch.map((recruitment, index) => (
    <RecruitmentItem recruitment={recruitment} key={index} />
  ));

  const loadMore = () => {
    const Skip = skip + 3;
    const Dem = dem + 1;

    const variable = {
      searchTerm: searchTerm,
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

  const newCities = [...cities];
  const newCarrers = [...careers];

  const renderListCity = newCities.map((item, i) => (
    <ListCity city={item} key={i} />
  ));

  const renderListCareer = newCarrers.map((item, i) => (
    <ListCareer career={item} key={i} />
  ));

  return (
    <>
      <Helmet>
        <title>Tìm Kiếm</title>
      </Helmet>
      <section className="page-section my-3 search">
        <div className="container">

          
        <h2 className="page-section-heading text-center text-uppercase text-secondary mb-0">
            Tìm kiếm theo vùng và ngành nghề
          </h2>
          <div className="divider-custom">
            <div className="divider-custom-line" />
            <div className="divider-custom-icon">
            <i class="fas fa-briefcase"></i>
            </div>
            <div className="divider-custom-line" />
          </div>
          
          <div className="row d-fex justify-content-center mb-2 mx-auto">
            <div className="card mx-auto mb-3" style={{ width: "20rem" }}>
              <div className="card-header bg-secondary text-light">
                Thành Phố
              </div>
              <div
                className="body-list-search"
                style={{ height: "260px", overflowY: "scroll" }}
              >
                <ul className="list-group list-group-flush">
                  {renderListCity}
                </ul>
              </div>
            </div>
            <div className="card mx-auto mb-3" style={{ width: "20rem" }}>
              <div className="card-header bg-secondary text-light">
                Ngành Nghề
              </div>
              <div
                className="body-list-search"
                style={{ height: "260px", overflowY: "scroll" }}
              >
                <ul className="list-group list-group-flush">
                  {renderListCareer}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Search;
