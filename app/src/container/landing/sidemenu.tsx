import React, { useEffect } from "react";

const Navbar2 = () => {
  const onScroll = () => {
    const sections = document.querySelectorAll(".side-menu__item");
    const scrollPos =
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.querySelector("body")?.scrollTop ||
      0;

    sections.forEach((elem) => {
      const value = elem.getAttribute("href") ?? "";
      const refElement = document.querySelector(value) as HTMLElement; // Cast to HTMLElement
      if (refElement) {
        const scrollTopMinus = scrollPos + 73;
        if (
          refElement.offsetTop <= scrollTopMinus &&
          refElement.offsetTop + refElement.offsetHeight > scrollTopMinus
        ) {
          elem.classList.add("active");
        } else {
          elem.classList.remove("active");
        }
      }
    });
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const target = e.currentTarget.getAttribute("href");
    const location = document.getElementById(target!.substring(1))?.offsetTop;
    if (location !== undefined) {
      window.scrollTo({
        left: 0,
        top: location - 64,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const pageLinks = document.querySelectorAll(".side-menu__item");
    pageLinks.forEach((elem) => {
      elem.addEventListener("click", handleClick as unknown as EventListener);
    });

    return () => {
      // Clean up event listeners when the component unmounts
      pageLinks.forEach((elem) => {
        elem.removeEventListener(
          "click",
          handleClick as unknown as EventListener
        );
      });
    };
  }, []);
  return (
    <>
      <ul className="main-menu">
        <li className="slide">
          <a className="side-menu__item active" href="#home">
            <span className="side-menu__label active">Начало</span>
          </a>
        </li>
        <li className="slide">
          <a href="#description" className="side-menu__item">
            <span className="side-menu__label">Описание</span>
          </a>
        </li>
        <li className="slide">
          <a href="#aianalysis" className="side-menu__item">
            <span className="side-menu__label">AI Анализ</span>
          </a>
        </li>
        <li className="slide">
          <a href="#bookAdaptations" className="side-menu__item">
            <span className="side-menu__label">Адаптации</span>
          </a>
        </li>
        <li className="slide">
          <a href="#musicStats" className="side-menu__item">
            <span className="side-menu__label">Песни</span>
          </a>
        </li>
        <li className="slide">
          <a href="#accordion" className="side-menu__item">
            <span className="side-menu__label">Разяснения</span>
          </a>
        </li>
        <li className="slide">
          <a href="#additionalStats" className="side-menu__item">
            <span className="side-menu__label">Други статистики</span>
          </a>
        </li>
      </ul>
    </>
  );
};

export default Navbar2;
