import { reactLocalStorage } from "reactjs-localstorage";
import RootApi from "./ApiRoute";

async function GetSingleChat(chatId) {
  console.log(chatId);
  let token = reactLocalStorage.get("authToken");
  const response = await fetch(
    RootApi + `/SingleChat/GetSingleChat/${chatId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },
    }
  );

  return response;
}

async function AddMessageToChat(messageInfo) {
  let token = reactLocalStorage.get("authToken");
  const response = await fetch(RootApi + `/SingleChat/AddSingleChatMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${token}`,
    },
    body: JSON.stringify(messageInfo),
  });

  return response;
}

export { GetSingleChat, AddMessageToChat };
