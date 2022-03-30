import React, { useEffect } from "react";
import "./App.css";
import Navigation from "./Components/Navigation/Navigation";
import Footer from "./Components/Footer/Footer";
import ScrollToTop from "./Components/ScrollToTop/ScrollToTop";
import DuongDanURL from "./Components/DuongDanURL/DuongDanURL";

function App() {
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 550);
  }, []);
  return (
    <div>
      <Navigation />
      <DuongDanURL />
      <ScrollToTop />
      <Footer />
    </div>
  );
}

export default App;
