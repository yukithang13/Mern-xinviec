import React, { useState, useEffect } from "react";
import { useWindowScroll } from "react-use";
import "./index.css";

function ScrollToTop() {
  const { y: pageYOffset } = useWindowScroll();
  const [visible, setVisiblity] = useState(false);

  useEffect(() => {
    if (pageYOffset > 1000) {
      setVisiblity(true);
    } else {
      setVisiblity(false);
    }
  }, [pageYOffset]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (!visible) {
    return false;
  }

  return (
    <div
      className="scrolls-to-top cursor-pointer text-center"
      onClick={scrollToTop}
    >
      <i className="icon fas fa-chevron-up"></i>
    </div>
  );
}

export default ScrollToTop;
