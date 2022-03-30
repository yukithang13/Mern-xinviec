import React, { useEffect, useState } from "react";
import Select from "react-select";
import CareerService from "../../Services/CareerService";
import CityService from "../../Services/CityService";

function Selects(props) {
  const [citys, setCitys] = useState([]);
  const [careers, setCareers] = useState([]);

  useEffect(() => {
    CityService.getCity().then((data) => {
      if (data.success) {
        setCitys(data.ct);
      }
    });

    CareerService.getCareer().then((data) => {
      if (data.success) {
        setCareers(data.cv);
      }
    });
  }, []);

  const cityOption = [];
  const careerOption = [];

  citys.map((ct, index) => [
    cityOption.push({ value: ct._id, label: ct.name }),
  ]);

  careers.map((cv, index) => [
    careerOption.push({ value: cv._id, label: cv.name }),
  ]);

  const handleCity = (value) => {
    props.handleCity(value);
  };

  const handleCareer = (value) => {
    props.handleCareer(value);
  };

  const onKeyEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <>
      <div className="control-group">
        <div className="form-group  mb-0 pb-2">
          <h5 style={{ color: "#2c3e50" }}>Thành Phố:</h5>
          <Select
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: 9999,
              }),
            }}
            noOptionsMessage={(e) => "Không có dữ liệu!!!"}
            placeholder="Chọn Thành Phố..."
            maxMenuHeight="300px"
            name="color"
            value={props.city}
            defaultValue={{ value: props.city.value, label: props.city.label }}
            onChange={handleCity}
            options={cityOption}
            onKeyDown={onKeyEnter}
          />
        </div>
      </div>
      <div className="control-group">
        <div className="form-group  mb-0 pb-2">
          <h5 style={{ color: "#2c3e50" }}>Ngành Nghề:</h5>
          <Select
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: 9999,
              }),
            }}
            noOptionsMessage={(e) => "Không có dữ liệu!!!"}
            placeholder="Chọn Nghành Nghề..."
            maxMenuHeight="300px"
            name="color"
            value={props.career}
            defaultValue={{
              value: props.career.value,
              label: props.career.label,
            }}
            onChange={handleCareer}
            options={careerOption}
            onKeyDown={onKeyEnter}
          />
        </div>
      </div>
    </>
  );
}

export default Selects;
