import { useEffect, useState, createContext } from "react";
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
  plused: string[];
  refreshPlused: any;
  favourites: string[];
  refreshFavourites: any;
  observedList: string[];
  refreshObservedlist: any;
  blackList: string[];
  refreshBlacklist: any;
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
  const { data: plused = [], mutate: refreshPlused } = useSWR(
    login.logged ? "/api/user/pluslist" : null,
    {
      refreshInterval: 0,
    }
  );
  const { data: favourites = [], mutate: refreshFavourites } = useSWR(
    login.logged ? "/api/user/favouritelist" : null,
    {
      refreshInterval: 0,
    }
  );
  const { data: blackList = [], mutate: refreshBlacklist } = useSWR(
    login.logged ? "/api/user/blacklist" : null,
    {
      refreshInterval: 0,
    }
  );
  const { data: observedList = [], mutate: refreshObservedlist } = useSWR(
    login.logged ? "/api/user/observelist" : null,
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
        plused,
        refreshPlused,
        favourites,
        refreshFavourites,
        blackList,
        refreshBlacklist,
        observedList,
        refreshObservedlist,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
