import { Fragment, useEffect, useState } from "react";
import Footer from "../components/common/footer/footer";
import Sidebar from "../components/common/sidebar/sidebar";
import Switcher from "../components/common/switcher/switcher";
import Header from "../components/common/header/header";
import { Helmet, HelmetProvider } from "react-helmet-async";
import store from "../redux/store";
import { Provider } from "react-redux";
import { Outlet } from "react-router-dom";

import gradientDark from "../assets/images/menu-bg-images/layered-peaks-haikei-dark.svg";
import gradientLight from "../assets/images/menu-bg-images/layered-peaks-haikei-light.svg";

function App() {
  const [MyclassName, setMyClass] = useState("");

  const Bodyclickk = () => {
    if (localStorage.getItem("artverticalstyles") == "icontext") {
      setMyClass("");
    }
    if (window.innerWidth > 992) {
      let html = document.documentElement;
      if (html.getAttribute("icon-overlay") === "open") {
        html.setAttribute("icon-overlay", "");
      }
    }
  };

  useEffect(() => {
    import("preline");
  }, []);
  return (
    <Fragment>
      <Provider store={store}>
        <HelmetProvider>
          <Helmet
            htmlAttributes={{
              lang: "en",
              dir: "ltr",
              "data-menu-styles": `${import.meta.env.VITE_DEFAULT_THEME}`,
              class: "light",
              "data-nav-layout": "vertical",
              "data-header-styles": "light",
              "data-vertical-style": "overlay",
              loader: "disable",
              "data-icon-text": MyclassName
            }}
          />
          <Switcher />
          <div className="page">
            <Header />
            <Sidebar />
            <div className="content main-index">
              <div className="main-content" onClick={Bodyclickk}>
                <Outlet />
              </div>
              <Footer />
            </div>
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
        </HelmetProvider>
      </Provider>
    </Fragment>
  );
}

export default App;
