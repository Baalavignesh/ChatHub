import { Container, Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import "./signup.styles.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterUser } from "../../api_calls/UserAuth.";

function SignupPage() {
  let [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    console.log("Signup Page");
  }, []);

  let navigate = useNavigate();

  let handleSignup = async (e) => {
    e.preventDefault();

    const formEntries = new FormData(e.target).entries();
    const signupInput = Object.fromEntries(formEntries);

    if (signupInput.password === signupInput.reenterpassword) {
      let response = await RegisterUser(signupInput);

      if (response.status === 200) {
        navigate("/login");
      } else {
        const responseError = await response.json();
        setErrorMessage(responseError);
        console.log(errorMessage);
      }

      if (response) {
        setErrorMessage(response);
      }
    } else {
    }

    navigate("/app");
  };

  return (
    <div className="signup-main">
      <Container>
        <div className="signup-component">
          <Grid container>
            <Grid item lg={6} md={12} sm={12} sx={12}>
              <div className="signup-left">
                <div className="signup-content">
                  <h1 style={{ textAlign: "center", fontSize: "36px" }}>
                    Welcome Back
                  </h1>
                  <p className="signup-sub-info">
                    Signup and find new friends to chat
                  </p>
                </div>
                <div className="signup-form-component">
                  <form onSubmit={handleSignup} className="signup-form">
                    <TextField
                      label="Username"
                      color="secondary"
                      name="username"
                    />

                    <TextField
                      label="New Password"
                      color="secondary"
                      type="password"
                      name="password"
                    />

                    <TextField
                      label="Re-Enter Password"
                      color="secondary"
                      type="password"
                      name="reenterpassword"
                    />

                    <button className="my-button">Signup</button>
                  </form>

                  <button
                    type="submit"
                    className="my-button plain"
                    onClick={() => {
                      navigate("/login");
                    }}
                  >
                    Login
                  </button>
                </div>
                <div></div>
              </div>
            </Grid>
            <Grid item lg={6} sx={0}>
              <div
                className="signup-right"
                style={{
                  backgroundImage:
                    "url(https://static.vecteezy.com/system/resources/previews/008/296/859/original/concept-illustration-of-man-and-woman-friends-having-online-conversation-messaging-chatting-communication-texting-messages-in-mobile-phone-apps-flat-cartoon-style-free-vector.jpg)",
                }}
              ></div>
            </Grid>
          </Grid>
        </div>
      </Container>
    </div>
  );
}

export default SignupPage;
