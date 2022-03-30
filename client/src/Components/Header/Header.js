import React from "react";
import "./index.css";

function Header() {
  return (
    <>
     <header class="masthead no-select  header-page">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-md-6 text-md-start text-center py-6">
              <h1 class="mb-4 fs-9 fw-bold"> Tìm kiếm việc làm online</h1>
              <p class="mb-6 lead text-secondary">Không Có Gì Quan Trọng Hơn
                <br class="d-none d-xl-block" />Tuyển Dụng Và Phát Triển Các Tài Năng.
              </p>
              <div class="text-center text-md-start">
                <a class="btn btn-warning me-3 btn-lg" href="#!" role="button">Xem việc</a>
                <a class="btn btn-link text-warning fw-medium" href="/search" role="button">
                <span class="fas fa-search"> </span> Tìm kiếm ngay </a></div>
            </div>
            <div class="col-md-6 text-end"><img class="pt-7 pt-md-0 img-fluid" src="assets/img/hero-img.png" alt="" /></div>
          </div>
        </div>
      </header>
      
    </>
  );
}

export default Header;
