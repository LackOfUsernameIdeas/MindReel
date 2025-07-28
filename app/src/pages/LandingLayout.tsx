import { Fragment, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Provider } from "react-redux";
import { storeLanding } from "../redux/store";
import Landingswitcher from "../components/common/switcher/landingswitcher";
import Footer from "@/components/common/footer/footer";

import gradientDark from "../assets/images/menu-bg-images/layered-peaks-haikei-dark.svg";
import gradientLight from "../assets/images/menu-bg-images/layered-peaks-haikei-light.svg";

function Landinglayout() {
  useEffect(() => {
    import("preline");
  }, []);

  const Bodyclickk = () => {
    if (window.innerWidth > 992) {
      let html = document.documentElement;
      if (html.getAttribute("icon-overlay") === "open") {
        html.setAttribute("icon-overlay", "");
      }
    }
  };

  return (
    <Fragment>
      <Provider store={storeLanding}>
        <Landingswitcher />
        <div className="page">
          <div className="landing-content main-index">
            <div className="landing-main-content" onClick={Bodyclickk}>
              <Outlet />
            </div>
          </div>
          <Footer />
        </div>
        {/* Gradient Background */}
        <img
          src={gradientLight}
          alt="Gradient Background Light"
          className="absolute bottom-0 left-0 w-full h-auto dark:hidden z-[-1]"
        />
        <img
          src={gradientDark}
          alt="Gradient Background Dark"
          className="absolute bottom-0 left-0 w-full h-auto hidden dark:block z-[-1]"
        />
      </Provider>
    </Fragment>
  );
}

export default Landinglayout;
