import { useState } from "react";
import { Snackbar, CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import "./App.css";
import Header from "./components/Header.jsx";
import Home from "./components/Home.jsx";
import Bookmarks from "./components/Bookmarks.jsx";



function App() {
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const closeSnackbar = () => setSnackbarVisible(false);
  const openSnackbar = (text) => {
    setSnackbarMessage(text);
    setSnackbarVisible(true);
  };

  const [page, setPage] = useState("home");

   const theme = createTheme({
    palette: {
      primary: {
        main: "#2e7d32", 
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Header
        appTitle="P1 (a_marouf)"
        log={openSnackbar}
        page={page}
        setPage={setPage}
      />

      {page === "home" && <Home log={openSnackbar} />}
      {page === "bookmarks" && <Bookmarks log={openSnackbar} />}

      <Snackbar
        sx={{ zIndex: 99 }}
        open={snackbarVisible}
        autoHideDuration={5000}
        onClose={closeSnackbar}
        message={snackbarMessage}
      />
    </ThemeProvider>
  );
}

export default App;
