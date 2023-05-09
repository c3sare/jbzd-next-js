import { useState } from "react";
import style from "@/styles/usersettings.module.css";

const UserSettings = () => {
  const [currentTab, setCurrentTab] = useState<number>(0);

  const tabs = [
    {
      name: "Dane",
      component: <div></div>,
    },
    {
      name: "Preferencje",
      component: <div></div>,
    },
    {
      name: "Notyfikacje",
      component: <div></div>,
    },
    {
      name: "Premium",
      component: <div></div>,
    },
  ];

  return (
    <div>
      <ul className={style.tabs}>
        {tabs.map((tab, i) => (
          <li className={currentTab === i ? style.active : ""}>
            <button onClick={() => setCurrentTab(i)}>{tab.name}</button>
          </li>
        ))}
      </ul>
      <div>{tabs[currentTab].component}</div>
    </div>
  );
};

export default UserSettings;
