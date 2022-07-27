import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4c4c5f", // --emphasis
    },
    secondary: {
      main: "#363643", // --emphasis-dark
    },
    info: {
      main: "#676781", // --emphasis-light
      light: "#6767812f", // --emphasis-bg
    },
  },
});

export default theme;
