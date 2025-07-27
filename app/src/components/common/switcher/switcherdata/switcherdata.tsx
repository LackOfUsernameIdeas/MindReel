import { useState } from "react";
import store from "../../../../redux/store";
import { MENUITEMS } from "../../sidebar/menuitems";

export function Dark(actionfunction: any) {
  const theme = store.getState();
  actionfunction({
    ...theme,
    lang: "bg",
    dir: "ltr",
    class: "dark",
    dataHeaderStyles: "dark",
    dataMenuStyles: "dark",
    dataNavLayout: "horizontal",
    dataVerticalStyle: "overlay",
    toggled: "",
    dataNavStyle: "menu-click",
    horStyle: "",
    dataPageStyle: "modern",
    dataWidth: "fullwidth",
    dataMenuPosition: "fixed",
    dataHeaderPosition: "fixed",
    loader: "disable",
    iconOverlay: "",
    colorPrimaryRgb: "3 102 102",
    colorPrimary: "3 102 102",
    colorSecondaryRgb: "36 130 119",
    colorSecondary: "36 130 119",
    colorTertiaryRgb: "70 157 137",
    colorTertiary: "70 157 137",
    bodyBg: "",
    Light: "",
    darkBg: "",
    inputBorder: "",
    bgImg: "",
    iconText: "",
    body: {
      class: ""
    }
  });
  localStorage.setItem("artdarktheme", "dark");
  localStorage.removeItem("artlighttheme");
  localStorage.removeItem("artlighttheme");
  localStorage.removeItem("darkBgRGB");
}
export function Light(actionfunction: any) {
  const theme = store.getState();
  actionfunction({
    ...theme,
    lang: "bg",
    dir: "ltr",
    class: "light",
    dataHeaderStyles: "light",
    dataMenuStyles: "light",
    dataNavLayout: "horizontal",
    dataVerticalStyle: "overlay",
    toggled: "",
    dataNavStyle: "menu-click",
    horStyle: "",
    dataPageStyle: "modern",
    dataWidth: "fullwidth",
    dataMenuPosition: "fixed",
    dataHeaderPosition: "fixed",
    loader: "disable",
    iconOverlay: "",
    colorPrimaryRgb: "3 102 102",
    colorPrimary: "3 102 102",
    colorSecondaryRgb: "36 130 119",
    colorSecondary: "36 130 119",
    colorTertiaryRgb: "70 157 137",
    colorTertiary: "70 157 137",
    bodyBg: "",
    Light: "",
    darkBg: "",
    inputBorder: "",
    bgImg: "",
    iconText: "",
    body: {
      class: ""
    }
  });
  localStorage.setItem("artlighttheme", "light");
  localStorage.removeItem("artdarktheme");
  localStorage.removeItem("Light");
  localStorage.removeItem("bodyBgRGB");
  localStorage.removeItem("darkBgRGB");
}
export function Ltr(actionfunction: any) {
  const theme = store.getState();
  actionfunction({ ...theme, dir: "ltr" });
  localStorage.setItem("artltr", "ltr");
  localStorage.removeItem("artrtl");
}
export function Rtl(actionfunction: any) {
  const theme = store.getState();
  actionfunction({ ...theme, dir: "rtl" });
  localStorage.setItem("artrtl", "rtl");
  localStorage.removeItem("artltr");
}

function closeMenuFn() {
  const closeMenuRecursively = (items: any) => {
    items?.forEach((item: any) => {
      item.active = false;
      closeMenuRecursively(item.children);
    });
  };
  closeMenuRecursively(MENUITEMS);
}
export const HorizontalClick = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    lang: "bg",
    dir: "ltr",
    class: "light",
    dataHeaderStyles: "light",
    dataMenuStyles: "light",
    dataNavLayout: "horizontal",
    dataVerticalStyle: "overlay",
    toggled: "",
    dataNavStyle: "menu-click",
    horStyle: "",
    dataPageStyle: "modern",
    dataWidth: "fullwidth",
    dataMenuPosition: "fixed",
    dataHeaderPosition: "fixed",
    loader: "disable",
    iconOverlay: "",
    colorPrimaryRgb: "3 102 102",
    colorPrimary: "3 102 102",
    colorSecondaryRgb: "36 130 119",
    colorSecondary: "36 130 119",
    colorTertiaryRgb: "70 157 137",
    colorTertiary: "70 157 137",
    bodyBg: "",
    Light: "",
    darkBg: "",
    inputBorder: "",
    bgImg: "",
    iconText: "",
    body: {
      class: ""
    }
  });
  localStorage.setItem("artlayout", "horizontal");
  localStorage.removeItem("artverticalstyles");
  closeMenuFn();
  const Sidebar: any = document.querySelector(".main-menu");
  if (Sidebar) {
    Sidebar.style.marginInline = "0px";
  }
};
export const Vertical = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    lang: "bg",
    dir: "ltr",
    class: "light",
    dataHeaderStyles: "light",
    dataMenuStyles: "light",
    dataNavLayout: "horizontal",
    dataVerticalStyle: "overlay",
    toggled: "",
    dataNavStyle: "menu-click",
    horStyle: "",
    dataPageStyle: "modern",
    dataWidth: "fullwidth",
    dataMenuPosition: "fixed",
    dataHeaderPosition: "fixed",
    loader: "disable",
    iconOverlay: "",
    colorPrimaryRgb: "3 102 102",
    colorPrimary: "3 102 102",
    colorSecondaryRgb: "36 130 119",
    colorSecondary: "36 130 119",
    colorTertiaryRgb: "70 157 137",
    colorTertiary: "70 157 137",
    bodyBg: "",
    Light: "",
    darkBg: "",
    inputBorder: "",
    bgImg: "",
    iconText: "",
    body: {
      class: ""
    }
  });
  localStorage.setItem("artlayout", "horizontal");
  localStorage.removeItem("artnavstyles");
};

export const Menuclick = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    dataNavStyle: "menu-click",
    dataVerticalStyle: "",
    toggled: "menu-click-closed"
  });
  localStorage.setItem("artnavstyles", "menu-click");
  localStorage.removeItem("artverticalstyles");
  const Sidebar: any = document.querySelector(".main-menu");
  if (Sidebar) {
    Sidebar.style.marginInline = "0px";
  }
};
export const MenuHover = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    dataNavStyle: "menu-hover",
    dataVerticalStyle: "",
    toggled: "menu-hover-closed",
    horStyle: ""
  });
  localStorage.setItem("artnavstyles", "menu-hover");
  localStorage.removeItem("artverticalstyles");
  const Sidebar: any = document.querySelector(".main-menu");
  if (Sidebar) {
    Sidebar.style.marginInline = "0px";
  }
};
export const IconClick = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    dataNavStyle: "icon-click",
    dataVerticalStyle: "",
    toggled: "icon-click-closed"
  });
  localStorage.setItem("artnavstyles", "icon-click");
  localStorage.removeItem("artverticalstyles");
  const Sidebar: any = document.querySelector(".main-menu");
  if (Sidebar) {
    Sidebar.style.marginInline = "0px";
  }
};

export const IconHover = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    dataNavStyle: "icon-hover",
    dataVerticalStyle: "",
    toggled: "icon-hover-closed"
  });
  localStorage.setItem("artnavstyles", "icon-hover");
  localStorage.removeItem("artverticalstyles");
  const Sidebar: any = document.querySelector(".main-menu");
  if (Sidebar) {
    Sidebar.style.marginInline = "0px";
  }
  closeMenuFn();
};
export const Fullwidth = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    dataWidth: "fullwidth"
  });
  localStorage.setItem("artfullwidth", "Fullwidth");
  localStorage.removeItem("artboxed");
};
export const Boxed = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    dataWidth: "boxed"
  });
  localStorage.setItem("artboxed", "Boxed");
  localStorage.removeItem("artfullwidth");
};
export const FixedMenu = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    dataMenuPosition: "fixed"
  });
  localStorage.setItem("artmenufixed", "MenuFixed");
  localStorage.removeItem("artmenuscrollable");
};
export const scrollMenu = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    dataMenuPosition: "scrollable"
  });
  localStorage.setItem("artmenuscrollable", "Menuscrolled");
  localStorage.removeItem("artmenufixed");
};
export const Headerpostionfixed = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    dataHeaderPosition: "fixed"
  });
  localStorage.setItem("artheaderfixed", "FixedHeader");
  localStorage.removeItem("artheaderscrollable");
};
export const Headerpostionscroll = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    dataHeaderPosition: "scrollable"
  });
  localStorage.setItem("artheaderscrollable", "ScrollableHeader");
  localStorage.removeItem("artheaderfixed");
};
export const Regular = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    dataPageStyle: "regular"
  });
  localStorage.setItem("artregular", "Regular");
  localStorage.removeItem("artclassic");
  localStorage.removeItem("artmodern");
};
export const Classic = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    dataPageStyle: "classic"
  });
  localStorage.setItem("artclassic", "Classic");
  localStorage.removeItem("artregular");
  localStorage.removeItem("artmodern");
};
export const Modern = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    dataPageStyle: "modern"
  });
  localStorage.setItem("artmodern", "Modern");
  localStorage.removeItem("artregular");
  localStorage.removeItem("artclassic");
};

export const Defaultmenu = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    lang: "bg",
    dir: "ltr",
    class: "light",
    dataHeaderStyles: "light",
    dataMenuStyles: "light",
    dataNavLayout: "horizontal",
    dataVerticalStyle: "overlay",
    toggled: "",
    dataNavStyle: "menu-click",
    horStyle: "",
    dataPageStyle: "modern",
    dataWidth: "fullwidth",
    dataMenuPosition: "fixed",
    dataHeaderPosition: "fixed",
    loader: "disable",
    iconOverlay: "",
    colorPrimaryRgb: "3 102 102",
    colorPrimary: "3 102 102",
    colorSecondaryRgb: "36 130 119",
    colorSecondary: "36 130 119",
    colorTertiaryRgb: "70 157 137",
    colorTertiary: "70 157 137",
    bodyBg: "",
    Light: "",
    darkBg: "",
    inputBorder: "",
    bgImg: "",
    iconText: "",
    body: {
      class: ""
    }
  });
  localStorage.removeItem("artnavstyles");
  localStorage.setItem("artverticalstyles", "default");
  var icon = document.getElementById(
    "switcher-default-menu"
  ) as HTMLInputElement;
  if (icon) {
    icon.checked = true;
  }
};
export const Closedmenu = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    dataNavLayout: "horizontal",
    dataVerticalStyle: "closed",
    toggled: "close-menu-close",
    dataNavStyle: ""
  });
  localStorage.setItem("artverticalstyles", "closed");
  localStorage.removeItem("artnavstyles");
};

function icontextOpenFn() {
  let html = document.documentElement;
  if (html.getAttribute("data-toggled") === "icon-text-close") {
    html.setAttribute("icon-text", "open");
  }
}
function icontextCloseFn() {
  let html = document.documentElement;
  if (html.getAttribute("data-toggled") === "icon-text-close") {
    html.removeAttribute("icon-text");
  }
}
export const iconTextfn = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    dataNavLayout: "horizontal",
    dataVerticalStyle: "icontext",
    toggled: "icon-text-close",
    dataNavStyle: ""
  });
  localStorage.setItem("artverticalstyles", "icontext");
  localStorage.removeItem("artnavstyles");

  const MainContent = document.querySelector(".main-content");
  const appSidebar = document.querySelector(".app-sidebar");

  appSidebar?.addEventListener("click", () => {
    icontextOpenFn();
  });
  MainContent?.addEventListener("click", () => {
    icontextCloseFn();
  });
};
export const iconOverayFn = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    dataNavLayout: "horizontal",
    dataVerticalStyle: "overlay",
    toggled: "icon-overlay-close",
    dataNavStyle: ""
  });
  localStorage.setItem("artverticalstyles", "overlay");
  localStorage.removeItem("artnavstyles");
  var icon = document.getElementById(
    "switcher-icon-overlay"
  ) as HTMLInputElement;
  if (icon) {
    icon.checked = true;
  }
  const MainContent = document.querySelector(".main-content");
  const appSidebar = document.querySelector(".app-sidebar");
  appSidebar?.addEventListener("click", () => {
    DetachedOpenFn();
  });
  MainContent?.addEventListener("click", () => {
    DetachedCloseFn();
  });
};

function DetachedOpenFn() {
  if (window.innerWidth > 992) {
    let html = document.documentElement;
    if (
      html.getAttribute("data-toggled") === "detached-close" ||
      html.getAttribute("data-toggled") === "icon-overlay-close"
    ) {
      html.setAttribute("icon-overlay", "open");
    }
  }
}
function DetachedCloseFn() {
  if (window.innerWidth > 992) {
    let html = document.documentElement;
    if (
      html.getAttribute("data-toggled") === "detached-close" ||
      html.getAttribute("data-toggled") === "icon-overlay-close"
    ) {
      html.removeAttribute("icon-overlay");
    }
  }
}

export const DetachedFn = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    dataNavLayout: "horizontal",
    dataVerticalStyle: "detached",
    toggled: "detached-close",
    dataNavStyle: ""
  });
  localStorage.setItem("artverticalstyles", "detached");
  localStorage.removeItem("artnavstyles");

  const MainContent = document.querySelector(".main-content");
  const appSidebar = document.querySelector(".app-sidebar");

  appSidebar?.addEventListener("click", () => {
    DetachedOpenFn();
  });
  MainContent?.addEventListener("click", () => {
    DetachedCloseFn();
  });
};

export const DoubletFn = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    dataNavLayout: "horizontal",
    dataVerticalStyle: "doublemenu",
    toggled: "double-menu-open",
    dataNavStyle: ""
  });
  localStorage.setItem("artverticalstyles", "doublemenu");
  localStorage.removeItem("artnavstyles");
};
export const bgImage1 = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    bgImg: "bgimg1"
  });
  localStorage.setItem("bgimage1", "bgimg1");
  localStorage.removeItem("bgimage2");
  localStorage.removeItem("bgimage3");
  localStorage.removeItem("bgimage4");
  localStorage.removeItem("bgimage5");
};
export const bgImage2 = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    bgImg: "bgimg2"
  });
  localStorage.setItem("bgimage2", "bgimg2");
  localStorage.removeItem("bgimage1");
  localStorage.removeItem("bgimage3");
  localStorage.removeItem("bgimage4");
  localStorage.removeItem("bgimage5");
};
export const bgImage3 = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    bgImg: "bgimg3"
  });
  localStorage.setItem("bgimage3", "bgimg3");
  localStorage.removeItem("bgimage1");
  localStorage.removeItem("bgimage2");
  localStorage.removeItem("bgimage4");
  localStorage.removeItem("bgimage5");
};
export const bgImage4 = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    bgImg: "bgimg4"
  });
  localStorage.setItem("bgimage4", "bgimg4");
  localStorage.removeItem("bgimage1");
  localStorage.removeItem("bgimage2");
  localStorage.removeItem("bgimage3");
  localStorage.removeItem("bgimage5");
};
export const bgImage5 = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    bgImg: "bgimg5"
  });
  localStorage.setItem("bgimage5", "bgimg5");
  localStorage.removeItem("bgimage1");
  localStorage.removeItem("bgimage2");
  localStorage.removeItem("bgimage3");
  localStorage.removeItem("bgimage4");
};

export const colorMenu = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    dataMenuStyles: "color"
  });
  localStorage.setItem("artMenu", "color");
  localStorage.removeItem("gradient");
};

export const lightMenu = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    dataMenuStyles: "light"
  });
  localStorage.setItem("artMenu", "light");
  localStorage.removeItem("light");
};

export const darkMenu = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    dataMenuStyles: "dark"
  });
  localStorage.setItem("artMenu", "dark");
  localStorage.removeItem("light");
};

export const gradientMenu = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    dataMenuStyles: "gradient"
  });
  localStorage.setItem("artMenu", "gradient");
  localStorage.removeItem("color");
};
export const transparentMenu = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    dataMenuStyles: "transparent"
  });
  localStorage.setItem("artMenu", "transparent");
  localStorage.removeItem("gradient");
};

export const lightHeader = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    dataHeaderStyles: "light"
  });
  localStorage.setItem("artHeader", "light");
  localStorage.removeItem("dark");
};
export const darkHeader = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    dataHeaderStyles: "dark"
  });
  localStorage.setItem("artHeader", "dark");
  localStorage.removeItem("light");
};
export const colorHeader = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    dataHeaderStyles: "color"
  });
  localStorage.setItem("artHeader", "color");
  localStorage.removeItem("dark");
};
export const gradientHeader = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    dataHeaderStyles: "gradient"
  });
  localStorage.setItem("artHeader", "gradient");
  localStorage.removeItem("transparent");
};
export const transparentHeader = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    dataHeaderStyles: "transparent"
  });
  localStorage.removeItem("gradient");
  localStorage.setItem("artHeader", "transparent");
};

export const primaryColor1 = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    colorPrimaryRgb: "58, 88, 146",
    colorPrimary: "58 88 146"
  });
  localStorage.setItem("primaryRGB", "58, 88, 146");
  localStorage.setItem("primaryRGB1", "58 88 146");
};
export const primaryColor2 = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    colorPrimaryRgb: "92, 144 ,163",
    colorPrimary: "92 144 163"
  });
  localStorage.setItem("primaryRGB", "92, 144, 163");
  localStorage.setItem("primaryRGB1", "92 144 163");
};
export const primaryColor3 = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    colorPrimaryRgb: "161, 90 ,223",
    colorPrimary: "161 90 223"
  });
  localStorage.setItem("primaryRGB", "161, 90, 223");
  localStorage.setItem("primaryRGB1", "161 90 223");
};
export const primaryColor4 = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    colorPrimaryRgb: "78, 172, 76",
    colorPrimary: "78 172 76"
  });
  localStorage.setItem("primaryRGB", "78, 172, 76");
  localStorage.setItem("primaryRGB1", "78 172 76");
};
export const primaryColor5 = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    colorPrimaryRgb: "223, 90, 90",
    colorPrimary: "223 90 90"
  });
  localStorage.setItem("primaryRGB", "223, 90, 90");
  localStorage.setItem("primaryRGB1", "223 90 90");
};

export const backgroundColor1 = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    bodyBg: "34 44 110",
    darkBg: "20 30 96",
    inputBorder: "25 35 102",
    Light: "25 35 102",
    class: "dark",
    dataMenuStyles: "dark",
    dataHeaderStyles: "dark"
  });
  localStorage.setItem("darkBgRGB", "20 30 96");
  localStorage.setItem("bodyBgRGB", "34 44 110");
  localStorage.setItem("Light", "25 35 102");
};
export const backgroundColor2 = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    bodyBg: "22 92 129",
    Light: "13 83 120",
    darkBg: "8 78 115",
    inputBorder: "13 83 120",
    class: "dark",
    dataMenuStyles: "dark",
    dataHeaderStyles: "dark"
  });
  localStorage.setItem("darkBgRGB", "8 78 115");
  localStorage.setItem("bodyBgRGB", "22 92 129");
  localStorage.setItem("Light", "13 83 120");
};
export const backgroundColor3 = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    bodyBg: "104 51 149",
    Light: "95 42 140",
    darkBg: "90 37 135",
    inputBorder: "95 42 140",
    class: "dark",
    dataMenuStyles: "dark",
    dataHeaderStyles: "dark"
  });
  localStorage.setItem("darkBgRGB", "90 37 135");
  localStorage.setItem("bodyBgRGB", "104 51 149");
  localStorage.setItem("Light", "95 42 140");
};
export const backgroundColor4 = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    Light: "29 106 56",
    bodyBg: "38 115 64",
    darkBg: "24 101 51",
    inputBorder: "29 106 56;",
    class: "dark",
    dataMenuStyles: "dark",
    dataHeaderStyles: "dark"
  });
  localStorage.setItem("darkBgRGB", "24 101 51");
  localStorage.setItem("bodyBgRGB", "38 115 64");
  localStorage.setItem("Light", "29 106 56");
};
export const backgroundColor5 = (actionfunction: any) => {
  const theme = store.getState();
  actionfunction({
    ...theme,
    bodyBg: " 134 80 34",
    Light: "125 71 25",
    darkBg: "120 66 20",
    inputBorder: "125 71 25",
    class: "dark",
    dataMenuStyles: "dark",
    dataHeaderStyles: "dark"
  });
  localStorage.setItem("darkBgRGB", "120 66 20");
  localStorage.setItem("bodyBgRGB", "134 80 34");
  localStorage.setItem("Light", "125 71 25");
};

const ColorPicker = (props: any) => {
  return (
    <div className="color-picker-input">
      <input type="color" {...props} />
    </div>
  );
};

function hexToRgb(hex: any) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
}
const Themeprimarycolor = ({ actionfunction }: any) => {
  const theme = store.getState();
  const [state, updateState] = useState("#FFFFFF");

  const handleInput = (e: any) => {
    const rgb = hexToRgb(e.target.value);

    if (rgb !== null) {
      const { r, g, b } = rgb;
      updateState(e.target.value);
      actionfunction({
        ...theme,
        colorPrimaryRgb: `${r},  ${g},  ${b}`,
        colorPrimary: `${r} ${g} ${b}`
      });
      localStorage.setItem("dynamiccolor", `${r}, ${g} ,${b}`);
    }
  };

  return (
    <div className="Themeprimarycolor theme-container-primary pickr-container-primary">
      <ColorPicker onChange={handleInput} value={state} />
    </div>
  );
};

export default Themeprimarycolor;

//themeBackground
export const Themebackgroundcolor = ({ actionfunction }: any) => {
  const theme = store.getState();
  const [state, updateState] = useState("#FFFFFF");
  const handleInput = (e: any) => {
    const { r, g, b }: any = hexToRgb(e.target.value);
    updateState(e.target.value);
    actionfunction({
      ...theme,
      bodyBg: `${r} ${g} ${b}`,
      Light: `${r - 9} ${g - 9} ${b - 9}`,
      darkBg: `${r - 14} ${g - 14} ${b - 14}`,
      inputBorder: `${r - 27} ${g - 27} ${b - 27}`,
      class: "dark",
      dataHeaderStyles: "dark"
    });
    localStorage.setItem("darkBgRGB", `${r - 14} ${g - 14} ${b - 14}`);
    localStorage.setItem("Light", `${r - 9} ${g - 9} ${b - 9}`);
    localStorage.setItem("bodyBgRGB", `${r} ${g} ${b}`);
    localStorage.removeItem("artMenu");
    localStorage.removeItem("artHeader");
  };
  return (
    <div className="Themebackgroundcolor">
      <ColorPicker onChange={handleInput} value={state} />
    </div>
  );
};

export const Reset = (actionfunction: any) => {
  const theme = store.getState();
  Vertical(actionfunction);
  actionfunction({
    ...theme,
    lang: "bg",
    dir: "ltr",
    class: `${import.meta.env.VITE_DEFAULT_THEME}`,
    dataMenuStyles: `${import.meta.env.VITE_DEFAULT_THEME}`,
    dataNavLayout: "horizontal",
    dataHeaderStyles: `${import.meta.env.VITE_DEFAULT_THEME}`,
    dataVerticalStyle: "overlay",
    toggled: "",
    dataNavStyle: "menu-click",
    horStyle: "",
    dataPageStyle: "modern",
    dataWidth: "fullwidth",
    dataMenuPosition: "fixed",
    dataHeaderPosition: "fixed",
    loader: "disable",
    iconOverlay: "",
    colorPrimaryRgb: "3 102 102",
    colorPrimary: "3 102 102",
    colorSecondaryRgb: "36 130 119",
    colorSecondary: "36 130 119",
    colorTertiaryRgb: "70 157 137",
    colorTertiary: "70 157 137",
    bodyBg: "",
    Light: "",
    darkBg: "",
    inputBorder: "",
    bgImg: "",
    iconText: "",
    body: {
      class: ""
    }
  });
  localStorage.clear();
  var icon = document.getElementById(
    "switcher-default-menu"
  ) as HTMLInputElement;
  if (icon) {
    icon.checked = true;
  }
};
export const Reset1 = (actionfunction: any) => {
  const theme = store.getState();
  Vertical(actionfunction);
  actionfunction({
    ...theme,
    lang: "bg",
    dir: "ltr",
    class: `${import.meta.env.VITE_DEFAULT_THEME}`,
    dataMenuStyles: `${import.meta.env.VITE_DEFAULT_THEME}`,
    dataNavLayout: "horizontal",
    dataHeaderStyles: `${import.meta.env.VITE_DEFAULT_THEME}`,
    dataVerticalStyle: "overlay",
    toggled: "",
    dataNavStyle: "menu-click",
    horStyle: "",
    dataPageStyle: "modern",
    dataWidth: "fullwidth",
    dataMenuPosition: "fixed",
    dataHeaderPosition: "fixed",
    loader: "disable",
    iconOverlay: "",
    colorPrimaryRgb: "3 102 102",
    colorPrimary: "3 102 102",
    colorSecondaryRgb: "36 130 119",
    colorSecondary: "36 130 119",
    colorTertiaryRgb: "70 157 137",
    colorTertiary: "70 157 137",
    bodyBg: "",
    Light: "",
    darkBg: "",
    inputBorder: "",
    bgImg: "",
    iconText: "",
    body: {
      class: ""
    }
  });
  localStorage.clear();
  var icon = document.getElementById(
    "switcher-default-menu"
  ) as HTMLInputElement;
  if (icon) {
    icon.checked = true;
  }
};
export const LocalStorageBackup = (actionfunction: any) => {
  localStorage.artltr ? Ltr(actionfunction) : "";
  localStorage.artrtl ? Rtl(actionfunction) : "";
  localStorage.artdarktheme ? Dark(actionfunction) : "";
  localStorage.artlighttheme ? Light(actionfunction) : "";
  localStorage.artregular ? Regular(actionfunction) : "";
  localStorage.artclassic ? Classic(actionfunction) : "";
  localStorage.artmodern ? Modern(actionfunction) : "";
  localStorage.artfullwidth ? Fullwidth(actionfunction) : "";
  localStorage.artboxed ? Boxed(actionfunction) : "";
  localStorage.artmenufixed ? FixedMenu(actionfunction) : "";
  localStorage.artmenuscrollable ? scrollMenu(actionfunction) : "";
  localStorage.artheaderfixed ? Headerpostionfixed(actionfunction) : "";
  localStorage.artheaderscrollable ? Headerpostionscroll(actionfunction) : "";

  localStorage.artnavstyles === "menu-click" ? Menuclick(actionfunction) : "";
  localStorage.artnavstyles === "menu-hover" ? MenuHover(actionfunction) : "";
  localStorage.artnavstyles === "icon-click" ? IconClick(actionfunction) : "";
  localStorage.artnavstyles === "icon-hover" ? IconHover(actionfunction) : "";

  localStorage.bgimage1 ? bgImage1(actionfunction) : "";
  localStorage.bgimage2 ? bgImage2(actionfunction) : "";
  localStorage.bgimage3 ? bgImage3(actionfunction) : "";
  localStorage.bgimage4 ? bgImage4(actionfunction) : "";
  localStorage.bgimage5 ? bgImage5(actionfunction) : "";
  localStorage.artlayout == "horizontal" && HorizontalClick(actionfunction);
  localStorage.artlayout == "vertical" && Vertical(actionfunction);
  //primitive
  if (
    localStorage.getItem("artltr") == null ||
    localStorage.getItem("artltr") == "ltr"
  )
    if (localStorage.getItem("artrtl") == "rtl") {
      document.querySelector("body")?.classList.add("rtl");
      document.querySelector("html[lang=en]")?.setAttribute("dir", "rtl");
    }
  //

  // Theme Primary: Colors: Start
  switch (localStorage.primaryRGB) {
    case "58, 88,146":
      primaryColor1(actionfunction);

      break;
    case "92, 144, 163":
      primaryColor2(actionfunction);

      break;
    case "161, 90, 223":
      primaryColor3(actionfunction);

      break;
    case "78, 172, 76":
      primaryColor4(actionfunction);

      break;
    case "223, 90, 90":
      primaryColor5(actionfunction);

      break;
    default:
      break;
  }
  // Theme Primary: Colors: End

  switch (localStorage.darkBgRGB) {
    case "20 30 96":
      backgroundColor1(actionfunction);

      break;
    case "8 78 115":
      backgroundColor2(actionfunction);

      break;
    case "79 50 93":
      backgroundColor3(actionfunction);

      break;
    case "24 101 51":
      backgroundColor4(actionfunction);

      break;
    case "93 50 50":
      backgroundColor5(actionfunction);

      break;
    default:
      break;
  }

  //layout
  if (localStorage.artverticalstyles) {
    const verticalStyles = localStorage.getItem("artverticalstyles");

    switch (verticalStyles) {
      case "default":
        Defaultmenu(actionfunction);
        break;
      case "closed":
        Closedmenu(actionfunction);
        break;
      case "icontext":
        iconTextfn(actionfunction);
        break;
      case "overlay":
        iconOverayFn(actionfunction);
        break;
      case "detached":
        DetachedFn(actionfunction);
        break;
      case "doublemenu":
        DoubletFn(actionfunction);
        break;
    }
  }

  //Theme Primary:
  if (localStorage.dynamiccolor) {
    const theme = store.getState();
    actionfunction({
      ...theme,
      colorPrimaryRgb: localStorage.dynamiccolor,
      colorPrimary: localStorage.dynamiccolor
    });
  }
  //Theme BAckground:
  if (localStorage.darkBgRGB) {
    const theme = store.getState();
    actionfunction({
      ...theme,
      bodyBg: localStorage.bodyBgRGB,
      Light: localStorage.Light,
      darkBg: localStorage.darkBgRGB,
      class: "dark",
      dataHeaderStyles: "dark",
      dataMenuStyles: "dark"
    });
    // Dark(actionfunction);
  }
  // ThemeColor MenuColor Start
  switch (localStorage.artMenu) {
    case "light":
      lightMenu(actionfunction);
      break;
    case "dark":
      darkMenu(actionfunction);

      break;
    case "color":
      colorMenu(actionfunction);

      break;
    case "gradient":
      gradientMenu(actionfunction);

      break;
    case "transparent":
      transparentMenu(actionfunction);

      break;
    default:
      break;
  }
  // ThemeColor Header Colors: start
  switch (localStorage.artHeader) {
    case "light":
      lightHeader(actionfunction);

      break;
    case "dark":
      darkHeader(actionfunction);

      break;
    case "color":
      colorHeader(actionfunction);

      break;
    case "gradient":
      gradientHeader(actionfunction);

      break;
    case "transparent":
      transparentHeader(actionfunction);

      break;
    default:
      break;
  }
};
