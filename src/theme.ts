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
      light: "#67678133", // --emphasis-bg
    },
  },
});

export default theme;
