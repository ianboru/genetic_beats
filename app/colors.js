import chroma from "chroma-js"


const colors = {
  gray: {
    lightest : "#c2c4c6",
    light   : "#292B30",
    darkest : "#1d1f27",
  },
  blue: {
    lighter : "#3A9FCC",
    light   : "#1495CC",
    base    : "#0980B2",
  },
  red: {
    //salmon      : "#D1949E",
    lighter : "#D1949E",
    base    : "#FF002A",
    //burntOrange : "#A30700",
    darker  : "#A30700",
  },
  green: {
    base : "#32B209",
  },
  yellow: {
    base   : "#FFF419",
    dark   : "#b2ae00",
    darker : chroma("#b2ae00").darken(0.5),
  },
}

//panelBackground     : lightGray,
//headerFooterBgColor : darkerBlueGray,
//itemBgColor         : darkerBlueGray,

const semanticColors = {
  primary: {},
  neutral: {},
  accents: {
    default: {},
    warning: {},
    danger: {},
    info: {},
  },
}


const getColor = {
}

export {
  colors,
  getColor,
}
