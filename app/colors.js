import chroma from "chroma-js"

const colors = {
  gray: {
    lightest: "#c2c4c6",
    light: "#292B30",
    dark: chroma("#1d1f27").brighten(0.6),
    darker: chroma("#1d1f27").brighten(0.4),
    darkest: "#1d1f27",
  },
  blue: {
    lighter: "#3A9FCC",
    light: "#1495CC",
    base: "#0980B2",
  },
  red: {
    lighter: "#D1949E",
    base: "#FF002A",
    darker: "#A30700",
  },
  green: {
    lightest: chroma("#32B209").brighten(),
    light: chroma("#32B209").brighten(0.3),
    base: "#32B209",
  },
  yellow: {
    base: "#FFF419",
    dark: "#b2ae00",
    darker: chroma("#b2ae00").darken(0.5),
  },
}

const getColor = {}

export {colors, getColor}
