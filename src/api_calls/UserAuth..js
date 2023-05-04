import RootApi from "./ApiRoute";

async function LoginUser(loginInput) {
  const response = await fetch(RootApi + "/Auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginInput),
  });

  return response;
}

async function RegisterUser(registerInput) {
  const response = await fetch(RootApi + "/Auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerInput),
  });

  return response;
}


export {LoginUser, RegisterUser};
