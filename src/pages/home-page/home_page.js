import { Avatar, Button, Grid, Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import LogoutIcon from "@mui/icons-material/Logout";
import { deepOrange } from "@mui/material/colors";
import "./home.styles.css";
import { GetMyChats } from "../../api_calls/UserInfo";
import ChatWindow from "../../components/chat-window/chat-window";
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";
import SettingsIcon from "@mui/icons-material/Settings";
import { ReactComponent as WelcomeSvg } from "../../assets/svgs/welcome-chatscreen.svg";
import { HubConnectionBuilder } from "@microsoft/signalr/dist/esm";
import { useDispatch, useSelector } from "react-redux";
import { setChat, setValue } from "../../features/userInfo/userSlice";
import AvatarBadge from "../../components/avatar-badge/avatar";

function HomePage() {
  let navigate = useNavigate();
  let [myChats, setMyChats] = useState([]);
  let [loading, setLoading] = useState();
  let [connection, setConnection] = useState();
  const [tabValue, setTabValue] = React.useState(0);

  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.userId);
  const currentChat = useSelector((state) => state.user.currentChat);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  let getUserChats = async () => {
    let response = await GetMyChats(userId);

    const responseData = await response.json();
    setMyChats(responseData);
    console.log(responseData);
  };

  useEffect(() => {
    if (userId !== 0) {
      getUserChats();
      let new_connection = new HubConnectionBuilder()
        .withUrl(
          `https://localhost:7164/singleChatHub?userId=${userId.toString()}`
        )
        .withAutomaticReconnect()
        .build();
      setConnection(new_connection);
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [userId]);

  // Home Screen, set everything to redux
  useEffect(() => {
    let localUser = reactLocalStorage.get("userInfo");
    let localUserJwt = reactLocalStorage.get("jwt");
    dispatch(
      setValue({
        userId: localUser,
        jwt: localUserJwt,
      })
    );
    // eslint-disable-next-line
  }, []);

  // start the connection once object is created
  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("Connected");
        })
        .catch((error) => {
          console.log("props.connection error:", error);
        });
    }
  }, [connection]);

  let handleLogout = () => {
    reactLocalStorage.clear();
    navigate("/login");
  };

  let handleImage = () => {
    console.log("upload image");
  };

  return loading ? (
    <div>Loading</div>
  ) : (
    <div className="homepage-main">
      <Grid
        container
        style={{
          flex: 1,
          height: "100%",
          boxShadow: "rgba(0, 0, 0, 0.15) 0px 5px 15px 0px",
        }}
        className="homepage-container"
      >
        <Grid
          item
          lg={3}
          sm={12}
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="mychats-window">
            <div className="mychats-window-heading">
              <h2>ChatHub</h2>
              <Avatar
                className="logout-button"
                onClick={handleLogout}
                sx={{ bgcolor: deepOrange[500] }}
                variant="rounded"
              >
                <LogoutIcon />
              </Avatar>
            </div>
            <Tabs
              value={tabValue}
              onChange={handleChange}
              aria-label="icon label tabs example"
              variant="fullWidth"
              centered
              textColor="primary"
              TabIndicatorProps={{
                style: {
                  backgroundColor: "#845EF1",
                },
              }}
            >
              <Tab
                icon={<PersonIcon />}
                className={tabValue !== 0 ? "inactiveTab" : ""}
                label="Chats"
              />
              <Tab
                icon={<GroupsIcon />}
                className={tabValue !== 1 ? "inactiveTab" : ""}
                label="Groups"
              />
              <Tab
                icon={<SettingsIcon />}
                className={tabValue !== 2 ? "inactiveTab" : ""}
                label="Profile"
              />
            </Tabs>
            {tabValue === 0 ? (
              myChats.map((value, index) => {
                return (
                  <div
                    key={value.receiverId}
                    className="single-chat-row"
                    onClick={() => {
                      console.log(value);
                      dispatch(setChat(value));
                    }}
                  >
                    <AvatarBadge
                      name={value.receiverName}
                      isOnline={value.isOnline}
                    />

                    <h3>
                      {value.receiverId === userId
                        ? value.senderName
                        : value.receiverName}
                    </h3>
                  </div>
                );
              })
            ) : tabValue == 1 ? (
              <div>Group</div>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "90%",
                }}
              >
                <h1 style={{ padding: "2rem" }}>Settings</h1>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleImage}
                  style={{ width: "50%" }}
                >
                  Change Profile Picture
                </Button>
              </div>
            )}
          </div>
        </Grid>
        <Grid
          item
          lg={9}
          sm={12}
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="chat-window">
            {currentChat == null ? (
              <div className="welcome-message">
                <div style={{ width: "300px", height: "300px" }}>
                  <WelcomeSvg style={{ width: "100%", height: "100%" }} />
                </div>
                <h1 className="welcome-chat-text">ChatHub</h1>
                <p className="welcome-chat-text-p">
                  Send and receive messages without keeping your phone online.
                </p>
                <p className="welcome-chat-text-p">
                  ChatHub is your doorway to seamless communication and
                  meaningful connections.{" "}
                </p>
              </div>
            ) : (
              <ChatWindow connection={connection} />
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default HomePage;
