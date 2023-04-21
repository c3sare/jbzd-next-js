import React from "react";

interface Login {
  login: string;
  logged: boolean;
}

export const LoginContext = React.createContext<Login>({
  login: "",
  logged: false,
});

export const LoginReducer = React.createContext<any>(null);
