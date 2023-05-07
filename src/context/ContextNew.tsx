import React from "react";

export interface GlobalContextInterface {
  categories: any[];
  setCategories: any;
  login: {
    login: string;
    logged: boolean;
  };
  setLogin: any;
  notifys: any[];
  setNotifys: any;
  favourites: string[];
  setFavourites: any;
  plused: string[];
  setPlused: any;
}

export const GlobalContext = React.createContext<GlobalContextInterface | null>(
  null
);

export default function Context({ children }: any) {
  const [categories, setCategories] = React.useState([]);
  const [login, setLogin] = React.useState({
    logged: false,
    login: "",
  });
  const [notifys, setNotifys] = React.useState([]);
  const [favourites, setFavourites] = React.useState([]);
  const [plused, setPlused] = React.useState([]);

  return (
    <GlobalContext.Provider
      value={{
        categories,
        setCategories,
        login,
        setLogin,
        notifys,
        setNotifys,
        favourites,
        setFavourites,
        plused,
        setPlused,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
