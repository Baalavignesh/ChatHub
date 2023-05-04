import { Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

import { HubConnectionBuilder } from "@microsoft/signalr";
function WelcomePage() {
  // const val = useSelector((state) => state.counter.value);
  // const dispatch = useDispatch();

  let [message1, setMessage1] = useState("");
  let [message2, setMessage2] = useState("");
  let [message3, setMessage3] = useState("");

  let [connection, setConnection] = useState();
  let [allMessage1, setAllMessage1] = useState([]);
  let [allMessage2, setAllMessage2] = useState([]);
  let [allMessage3, setAllMessage3] = useState([]);

  let handleMessage = async (message, toUser) => {
    console.log(connection);
    if (connection) {
      try {
        await connection.send("SendMessage", toUser, message);
      } catch (e) {
        console.log(e);
      }
    } else {
      alert("No connection to server yet.");
    }
  };

  useEffect(() => {
    let connection = new HubConnectionBuilder()
      .withUrl("https://localhost:7164/singleChatHub")
      .withAutomaticReconnect()
      .build();
    setConnection(connection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection.start().then((result) => {
        console.log("Connected");
        connection.on("ReceiveMessage", (user, message) => {
          console.log(user, message);
          if (user === "baalavignesh") {
            setAllMessage1([...allMessage1, message]);
          } else if (user === "prakash") {
            setAllMessage2([...allMessage2, message]);
          } else if (user === "abishek") {
            setAllMessage3([...allMessage3, message]);
          }
        });
      });
    }
  }, [connection, allMessage1, allMessage2, allMessage3]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        justifyContent: "space-around",
      }}
    >
      <div style={{ display: "flex",alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <h1>Baalavignesh</h1>
          <TextField
            value={message1}
            name="message"
            onChange={(e) => setMessage1(e.target.value)}
          ></TextField>

          <Button
            onClick={() => handleMessage(message1, "prakash")}
            type="contained"
            color="primary"
          >
            Send Message
          </Button>
        </div>
        <div>
          {allMessage1.map((val, index) => {
            return <h1 key={index}>{val}</h1>;
          })}
        </div>
      </div>

      <div style={{ display: "flex",alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <h1>Prakash</h1>
          <TextField
            value={message2}
            name="message"
            onChange={(e) => setMessage2(e.target.value)}
          ></TextField>

          <Button
            onClick={() => handleMessage(message2, "baalavignesh")}
            type="contained"
            color="primary"
          >
            Send Message
          </Button>
        </div>

        <div>
          {allMessage2.map((val, index) => {
            return <h1 key={index}>{val}</h1>;
          })}
        </div>
      </div>

      <div style={{ display: "flex",alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <h1>Abishek</h1>
          <TextField
            value={message3}
            name="message"
            onChange={(e) => setMessage3(e.target.value)}
          ></TextField>

          <Button
            onClick={() => handleMessage(message3, "baalavignesh")}
            type="contained"
            color="primary"
          >
            Send Message
          </Button>
        </div>

        <div>
          {allMessage3.map((val, index) => {
            return <h6 key={index}>{val}</h6>;
          })}
        </div>
      </div>

      {/* <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: "center",
          flex: 1,
        }}
      >
        <h1 style={{ margin: "1rem" }}>Current Value = {val}</h1>
        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => dispatch(increment())}
          >
            Increment Value by 1
          </Button>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => dispatch(decrement())}
          >
            Decrement by 1
          </Button>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => dispatch(setValue(10))}
          >
            Increment Value by 10
          </Button>
        </div>
      </div> */}
    </div>
  );
}

export default WelcomePage;
