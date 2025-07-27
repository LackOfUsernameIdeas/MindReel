const initialState = {
  lang: "bg",
  dir: "ltr",
  class: `${import.meta.env.VITE_DEFAULT_THEME}`,
  dataMenuStyles: `${import.meta.env.VITE_DEFAULT_THEME}`,
  dataNavLayout: "vertical",
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
};

export default function reducer(state = initialState, action: any) {
  const { type, payload } = action;

  switch (type) {
    case "ThemeChanger":
      state = {
        ...payload,
        colorPrimaryRgb: payload.class === "dark" ? "86 171 145" : "3 102 102",
        colorPrimary: payload.class === "dark" ? "86 171 145" : "3 102 102",
        colorSecondaryRgb:
          payload.class === "dark" ? "120 198 163" : "36 130 119",
        colorSecondary: payload.class === "dark" ? "120 198 163" : "36 130 119",
        colorTertiaryRgb:
          payload.class === "dark" ? "153 226 180" : "70 157 137",
        colorTertiary: payload.class === "dark" ? "153 226 180" : "70 157 137",
        dataNavLayout: "vertical"
      };
      return state;

    default:
      return state;
  }
}

export function reducerLanding(state = initialState, action: any) {
  const { type, payload } = action;

  switch (type) {
    case "ThemeChanger":
      state = {
        ...payload,
        colorPrimaryRgb: payload.class === "dark" ? "86 171 145" : "3 102 102",
        colorPrimary: payload.class === "dark" ? "86 171 145" : "3 102 102",
        colorSecondaryRgb:
          payload.class === "dark" ? "120 198 163" : "36 130 119",
        colorSecondary: payload.class === "dark" ? "120 198 163" : "36 130 119",
        colorTertiaryRgb:
          payload.class === "dark" ? "153 226 180" : "70 157 137",
        colorTertiary: payload.class === "dark" ? "153 226 180" : "70 157 137",
        lang: "bg",
        dir: "ltr",
        dataNavLayout: "horizontal",
        dataVerticalStyle: "overlay",
        toggled: "close",
        dataNavStyle: "menu-click",
        horStyle: "",
        dataPageStyle: "modern",
        dataWidth: "fullwidth",
        dataMenuPosition: "fixed",
        dataHeaderPosition: "fixed",
        loader: "disable",
        iconOverlay: "",
        bodyBg: "",
        Light: "",
        darkBg: "",
        inputBorder: "",
        bgImg: "",
        iconText: "",
        body: {
          class: ""
        }
      };
      return state;

    default:
      return state;
  }
}
