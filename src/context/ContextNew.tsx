import { useState, createContext } from "react";
import useSWR from "swr";

interface MonitInterface {
  fadeout: boolean;
  open: boolean;
  title: string;
  text: string;
  func: any;
}

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
  profileData: {
    isLoadingProfileData: boolean;
    profileDataError: any;
    profileData: {
      avatar: string;
      createDate: Date;
      allPosts: number;
      acceptedPosts: number;
      comments: number;
    };
  };
  monit: MonitInterface;
  createMonit: (title: string, text: string, func: any) => void;
  closeMonit: () => void;
}

export const GlobalContext = createContext<GlobalContextInterface | null>(null);

export default function Context({ children }: any) {
  const { data: categories = [] } = useSWR("/api/categories", {
    refreshInterval: 0,
  });
  const { data: login = { logged: false, login: "" }, mutate: refreshLogin } =
    useSWR("/api/checklogin");
  const { data: coins = 0, mutate: refreshCoins } = useSWR(
    login.logged ? "/api/coins" : null,
    {
      refreshInterval: 0,
    }
  );
  const {
    isLoading: isLoadingProfileData,
    data: profileData,
    error: profileDataError,
  } = useSWR(login?.logged ? "/api/profile" : null);
  const [notifys, setNotifys] = useState<any[]>([]);
  const [monit, setMonit] = useState<MonitInterface>({
    fadeout: false,
    open: false,
    title: "",
    text: "",
    func: null,
  });

  const createMonit = (title: string, text: string, func: any) => {
    setMonit({
      fadeout: false,
      open: true,
      title,
      text,
      func,
    });
  };

  const closeMonit = () => {
    setMonit((prev) => ({
      fadeout: true,
      open: true,
      title: prev.title,
      text: prev.text,
      func: null,
    }));
    setTimeout(() => {
      setMonit((prev) => ({
        fadeout: false,
        open: false,
        title: "",
        text: "",
        func: null,
      }));
    }, 500);
  };

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
        profileData: { isLoadingProfileData, profileData, profileDataError },
        monit,
        createMonit,
        closeMonit,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
