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
  modifyPlusList: any;
  favourites: string[];
  modifyFavouriteList: any;
  observedList: string[];
  blackList: string[];
  modifyBlackList: any;
  modifyObservedList: any;
}

export const GlobalContext = createContext<GlobalContextInterface | null>(null);

export default function Context({ children }: any) {
  const { data: categories = [] } = useSWR("/api/categories", {
    refreshInterval: 0,
  });
  const { data: login = { logged: false, login: "" }, mutate: refreshLogin } =
    useSWR("/api/checklogin");
  const { data: coins = 0, mutate: refreshCoins } = useSWR("/api/coins", {
    refreshInterval: 0,
  });
  const {
    isLoading: isLoadingProfileData,
    data: profileData,
    error: profileDataError,
  } = useSWR(login?.logged ? "/api/profile" : null);
  const [plused, setPlused] = useState<string[]>([]);
  const [favourites, setFavourites] = useState<string[]>([]);
  const [observedList, setObservedList] = useState<string[]>([]);
  const [blackList, setBlackList] = useState<string[]>([]);
  const [notifys, setNotifys] = useState<any[]>([]);

  const modifyBlackList = (type: "ADD" | "ODD", username: string) => {
    if (type === "ADD" && !blackList.find((item) => item === username)) {
      setBlackList((prev) => [...prev, username]);
      if (observedList.find((item) => item === username))
        setObservedList((prev) => prev.filter((item) => item !== username));
    } else if (type === "ODD" && blackList.find((item) => item === username)) {
      setBlackList((prev) => prev.filter((item) => item !== username));
    }
  };

  const modifyObservedList = (type: "ADD" | "ODD", username: string) => {
    if (type === "ADD" && !observedList.find((item) => item === username)) {
      setObservedList((prev) => [...prev, username]);
      if (blackList.find((item) => item === username))
        setBlackList((prev) => prev.filter((item) => item !== username));
    } else if (
      type === "ODD" &&
      observedList.find((item) => item === username)
    ) {
      setObservedList((prev) => prev.filter((item) => item !== username));
    }
  };

  const modifyPlusList = (type: string, id: string) => {
    if (type === "PLUS") {
      setPlused((prevState) => {
        const newState = [...prevState];
        return [...newState, id];
      });
    } else if (type === "UNPLUS") {
      setPlused((prevState) => prevState.filter((item: string) => item !== id));
    }
  };

  const modifyFavouriteList = (type: string, id: string) => {
    if (type === "LIKED") {
      setFavourites((prevState) => {
        const newState = [...prevState];
        return [...newState, id];
      });
    } else if (type === "UNLIKED") {
      setFavourites((prevState) =>
        prevState.filter((item: string) => item !== id)
      );
    }
  };

  useEffect(() => {
    if (login.logged) {
      fetch("/api/user/pluslist")
        .then((res) => res.json())
        .then((data) => {
          if (login.logged) setPlused(data);
        })
        .catch((err) => console.error(err));
      fetch("/api/user/favouritelist")
        .then((res) => res.json())
        .then((data) => {
          if (login.logged) setFavourites(data);
        })
        .catch((err) => console.error(err));
    } else {
      if (plused.length !== 0) {
        setPlused([]);
      }
      if (favourites.length !== 0) {
        setFavourites([]);
      }
    }
  }, [login]);

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
        modifyPlusList,
        favourites,
        modifyFavouriteList,
        blackList,
        observedList,
        modifyBlackList,
        modifyObservedList,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
