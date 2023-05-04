import { Container, Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import "./login.styles.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginUser } from "../../api_calls/UserAuth.";
import { reactLocalStorage } from "reactjs-localstorage";
import { useDispatch } from "react-redux";
import { setValue } from "../../features/userInfo/userSlice";

function LoginPage() {
  let [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  let [errorMessage, setErrorMessage] = useState("");
  let dispatch = useDispatch();

  useEffect(() => {
    console.log("Login Page");
  }, []);

  let navigate = useNavigate();

  let handleLogin = async (e) => {
    e.preventDefault();

    const formEntries = new FormData(e.target).entries();
    const loginInput = Object.fromEntries(formEntries);
    let response = await LoginUser(loginInput);

    if (response.status === 200) {
      const responseData = await response.json();
      console.log(responseData);
      reactLocalStorage.set("userInfo", responseData.userId);
      reactLocalStorage.set("authToken", responseData.jwt);

      dispatch(setValue(responseData));

      navigate("/app");
    } else {
      console.log(response);
      await response.json().then((data) => {
        console.log(data.error);
        if (data.error === "Wrong Password") {
          setErrorMessage("");
          setPasswordErrorMessage(data.error);
        } else {
          setErrorMessage(data.error);
        }
      });
    }
  };

  return (
    <div className="login-main">
      <Container>
        <div className="login-component">
          <Grid container>
            <Grid item lg={6} md={12} sm={12} sx={12}>
              <div className="login-left">
                <div className="login-content">
                  <h1 style={{ textAlign: "center", fontSize: "36px" }}>
                    Welcome Back
                  </h1>
                  <p className="login-sub-info">
                    Login and start chatting with your friends
                  </p>
                </div>

                <div className="login-form-component">
                  <form onSubmit={handleLogin} className="login-form">
                    <TextField
                      error={!!errorMessage}
                      label="Username"
                      color="secondary"
                      name="username"
                      helperText={errorMessage}
                    />

                    <TextField
                      error={!!passwordErrorMessage}
                      label="Password"
                      color="secondary"
                      type="password"
                      name="password"
                      helperText={passwordErrorMessage}
                    />

                    <button className="my-button">Login</button>
                  </form>

                  <button
                    type="submit"
                    className="my-button plain"
                    onClick={() => {
                      navigate("/signup");
                    }}
                  >
                    Sign Up
                  </button>
                </div>
                <div></div>
              </div>
            </Grid>
            <Grid item lg={6} sx={0}>
              <div
                className="login-right"
                style={{
                  backgroundImage:
                    "url(https://herobot.app/wp-content/uploads/2022/11/26-1024x1024.jpg)",
                }}
              ></div>
            </Grid>
          </Grid>
        </div>
      </Container>
    </div>
  );
}

export default LoginPage;
