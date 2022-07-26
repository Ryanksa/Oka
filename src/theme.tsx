import { createTheme } from "@mui/material/styles";

// theme is a subset of the colour theme defined in styles/global.css
const theme = createTheme({
  palette: {
    primary: {
      main: "#5e6cd5",
      light: "#868eff",
    },
    info: {
      main: "#4479ce",
      light: "#4e92ffcf",
      dark: "#369",
    },
    error: {
      main: "#c74b42",
    },
  },
});

export default theme;
