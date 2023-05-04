import { reactLocalStorage } from "reactjs-localstorage";
import RootApi from "./ApiRoute";

async function GetAllUsers() {
  let token = reactLocalStorage.get("authToken");
  const response = await fetch(RootApi + "/Users/GetAllUser", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${token}`,
    },
  });

  return response;
}

async function GetMyChats(userId) {
  let token = reactLocalStorage.get("authToken");
  const response = await fetch(RootApi + `/Users/GetMyChats/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${token}`,
    },
  });

  return response;
}

export { GetAllUsers, GetMyChats };
