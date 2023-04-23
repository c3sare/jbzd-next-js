import React from "react";
import { CategoryContext, CategoryReducer } from "./categories";
import { LoginContext, LoginReducer } from "./login";
import { NotifyContext, NotifyReducer } from "./notify";

export default function Context({ children }: any) {
  const [categories, setCategories] = React.useReducer(categoryReducer, []);
  const [login, setLogin] = React.useReducer(loginReducer, {
    logged: false,
    login: "c3sare",
  });
  const [notifys, setNotifys] = React.useReducer(notifyReducer, []);

  return (
    <LoginContext.Provider value={login}>
      <LoginReducer.Provider value={setLogin}>
        <CategoryContext.Provider value={categories}>
          <CategoryReducer.Provider value={setCategories}>
            <NotifyContext.Provider value={notifys}>
              <NotifyReducer.Provider value={setNotifys}>
                {children}
              </NotifyReducer.Provider>
            </NotifyContext.Provider>
          </CategoryReducer.Provider>
        </CategoryContext.Provider>
      </LoginReducer.Provider>
    </LoginContext.Provider>
  );
}

function categoryReducer(_none: any, action: any) {
  switch (action.type) {
    case "ADD": {
      return action.categories;
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}

function loginReducer(_none: any, action: any) {
  switch (action.type) {
    case "LOGIN": {
      return action.login;
    }
    case "LOGOUT": {
      return {
        logged: false,
        login: "",
      };
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}

function notifyReducer(notifys: any[], action: any) {
  switch (action.type) {
    case "ADD": {
      return [
        ...notifys,
        {
          ...action.notify,
        },
      ];
    }
    case "DELETE": {
      return notifys.filter((item) => item.id !== action.id);
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}
