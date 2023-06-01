import { useState } from "react";
import style from "@/styles/usersettings.module.css";
import UserData from "@/components/UserSettingsComponents/UserData";
import UserPreferences from "@/components/UserSettingsComponents/UserPreferences";
import Notifycations from "@/components/UserSettingsComponents/Notifycations";
import Premium from "@/components/UserSettingsComponents/Premium";
import Seo from "@/components/Seo";

const UserSettings = () => {
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
      component: <Notifycations />,
    },
    {
      name: "Premium",
      component: <Premium />,
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
