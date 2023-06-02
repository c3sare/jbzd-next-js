import { useState } from "react";
import style from "@/styles/usersettings.module.css";
import UserData from "@/components/UserSettingsComponents/UserData";
import UserPreferences from "@/components/UserSettingsComponents/UserPreferences";
import Notifycations from "@/components/UserSettingsComponents/Notifycations";
import Premium from "@/components/UserSettingsComponents/Premium";
import Seo from "@/components/Seo";
import useSWR from "swr";
import Loading from "@/components/Loading";
import { withSessionSSR } from "@/lib/AuthSession/session";

const UserSettings = () => {
  const {
    data: dataPremium,
    isLoading: isLoadingPremium,
    error: errorPremium,
    mutate: refreshPremium,
  } = useSWR("/api/user/premium", {
    refreshInterval: 0,
    keepPreviousData: true,
    revalidateOnMount: true,
  });
  const {
    data: dataNotify,
    isLoading: isLoadingNotify,
    error: errorNotify,
    mutate: refreshNotify,
  } = useSWR("/api/user/notifications", {
    refreshInterval: 0,
    keepPreviousData: true,
    revalidateOnMount: true,
  });
  const [currentTab, setCurrentTab] = useState<number>(0);

  const tabs = [
    {
      name: "Dane",
      component: <UserData />,
    },
    {
      name: "Preferencje",
      component: <UserPreferences />,
    },
    {
      name: "Notyfikacje",
      component:
        dataNotify && !isLoadingNotify && !errorNotify ? (
          <Notifycations
            data={dataNotify}
            isLoading={isLoadingNotify}
            error={errorNotify}
            refreshForm={refreshNotify}
          />
        ) : (
          <Loading />
        ),
    },
    {
      name: "Premium",
      component:
        dataPremium && !isLoadingPremium && !errorPremium ? (
          <Premium
            data={dataPremium}
            isLoading={isLoadingPremium}
            error={errorPremium}
            refreshForm={refreshPremium}
          />
        ) : (
          <Loading />
        ),
    },
  ];

  return (
    <>
      <Seo title="Ustawienia" />
      <section>
        <div className={style.settingsContainer}>
          <ul className={style.tabs}>
            {tabs.map((tab, i) => (
              <li key={i} className={currentTab === i ? style.active : ""}>
                <button onClick={() => setCurrentTab(i)}>{tab.name}</button>
              </li>
            ))}
          </ul>
          <div className={style.tabContainer}>{tabs[currentTab].component}</div>
        </div>
      </section>
    </>
  );
};

export default UserSettings;

export const getServerSideProps = withSessionSSR(
  async function getServerSideProps({ req }): Promise<any> {
    const session = req.session?.user;
    if (!session?.logged || !session.login)
      return {
        redirect: {
          destination: "/logowanie",
          permament: false,
        },
      };

    return {
      props: {},
    };
  }
);
