import React, { useEffect, useRef, useState } from "react";
import { AddMessageToChat, GetSingleChat } from "../../api_calls/SingleChat";
import { Avatar } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import "./chatwindow.styles.css";
import "../../assets/chatbackground.jpg";
import { useSelector } from "react-redux";

function ChatWindow(props) {
  let [allMessages, setAllMessages] = useState([]);
  let [message, setMessage] = useState("");

  const userId = useSelector((state) => state.user.userId);
  const chatInfo = useSelector((state) => state.user.currentChat);

  const chatContainerRef = useRef(null);

  let getChatInfo = async () => {
    if (chatInfo) {
      console.log(chatInfo);
      let response = await GetSingleChat(chatInfo.singleChatId);
      const responseData = await response.json();
      setAllMessages(responseData.data);
    }
  };

  let getMessageTime = (timestamp) => {
    const date = new Date(timestamp);

    const timeString = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return timeString.replace(" ", "").toLowerCase();
  };

  // Enter key to send message
  let handleEnterKey = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Add the message to the Databse
  let handleSendMessage = async () => {
    if (message.length > 0) {
      await AddMessageToChat({
        senderId: chatInfo.senderId || userId,
        receiverId: chatInfo.receiverId || chatInfo.,
        message: message,
      });

      setAllMessages((oldMessage) => [
        ...oldMessage,
        {
          message: message,
          senderId: chatInfo.senderId,
          timestamp: Date.now(),
        },
      ]);
    }

    // Send message through socket
    if (props.connection) {
      try {
        await props.connection.send(
          "SendMessage",
          chatInfo.receiverId.toString(),
          message
        );
      } catch (e) {
        console.log(e);
      }
    } else {
      alert("No props.connection to server yet.");
    }
    setMessage("");
  };

  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [allMessages]);

  useEffect(() => {
    if (chatInfo) {
      getChatInfo();
    }
    // eslint-disable-next-line
  }, [chatInfo]);

  // Once props.connection is created it will keep listenting to messages
  useEffect(() => {
    const handleMessageReceived = (message, user) => {
      console.log("Message Received: ", user, message);
      setAllMessages((oldMessages) => [
        ...oldMessages,
        {
          message: message,
          senderId: user,
          timestamp: Date.now(),
        },
      ]);
    };

    props.connection.on("ReceiveMessage", handleMessageReceived);

    return () => {
      props.connection.off("ReceiveMessage", handleMessageReceived);
    };
  }, [props.connection]);

  return (
    <>
      <div className="chat-window-heading-main">
        <Avatar
          alt={chatInfo.receiverName || chatInfo.username}
          sx={{ width: 40, height: 40 }}
          style={{
            marginRight: "2rem",
            border: "1px solid #845EF1",
          }}
        />
        <h2 className="chat-window-heading">
          {chatInfo.receiverName || chatInfo.username}
        </h2>
      </div>
      <div className="chat-messages-container">
        <div className="all-messages" ref={chatContainerRef}>
          {allMessages &&
            allMessages.map((message, index) => {
              return (
                <div
                  className={
                    message.senderId === chatInfo.senderId
                      ? "sender-message-bubble"
                      : "receiver-message-bubble"
                  }
                  key={index}
                >
                  <div className="bubble-and-info">
                    <div className="my-message">{message.message}</div>
                    {message.senderId === chatInfo.senderId ? (
                      <div className="my-message-info">
                        You
                        <p style={{ paddingRight: "1rem", fontSize: "12px" }}>
                          {getMessageTime(message.timestamp)}
                        </p>
                      </div>
                    ) : (
                      <div className="receiver-message-info">
                        {chatInfo.receiverName}
                        <p style={{ paddingLeft: "1rem", fontSize: "12px" }}>
                          {getMessageTime(message.timestamp)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <div className="input-chat">
        <input
          className="input-chat-style"
          placeholder="Type a message"
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          value={message}
          onKeyDown={handleEnterKey}
        ></input>

        <SendIcon onClick={handleSendMessage} />
      </div>
    </>
  );
}

export default ChatWindow;
