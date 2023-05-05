import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { ThemeProvider, createTheme } from "@mui/material";

const root = ReactDOM.createRoot(document.getElementById("root"));

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#6C63FF", // Customize the primary color
    },
    secondary: {
      main: "#f48fb1", // Customize the secondary color
    },
  },
  typography: {
    fontFamily: "Roboto", // Customize the font family
  },
});

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={darkTheme}>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
