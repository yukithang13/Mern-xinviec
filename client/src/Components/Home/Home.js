import React from "react";
import Header from "../Header/Header";
import CVMoiNhat from "../CVMoiNhat/CVMoiNhat";
import "./index.css";
import { Helmet } from "react-helmet";
import SPFooter from "../Footer/SpFooter";

function Home() {
  return (
    <>
      <Helmet>
        <title>Trang Chủ</title>
      </Helmet>
      <div className="main">
        <Header />
        <CVMoiNhat />
        <SPFooter/>
      </div>
    </>
  );
}

export default Home;
