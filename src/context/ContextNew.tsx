import React from "react";
import useSWR from "swr";

export interface GlobalContextInterface {
  categories: any[];
  login: {
    login: string;
    logged: boolean;
  };
  refreshLogin: any;
  notifys: any[];
  setNotifys: any;
  coins: number;
  refreshCoins: any;
}

export const GlobalContext = React.createContext<GlobalContextInterface | null>(
  null
);

export default function Context({ children }: any) {
  const { data: categories = [] } = useSWR("/api/categories");
  const { data: login = { logged: false, login: "" }, mutate: refreshLogin } =
    useSWR("/api/checklogin");
  const { data: coins = 0, mutate: refreshCoins } = useSWR("/api/coins");
  const [notifys, setNotifys] = React.useState([]);

  return (
    <GlobalContext.Provider
      value={{
        categories,
        login,
        refreshLogin,
        notifys,
        setNotifys,
        coins,
        refreshCoins,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
