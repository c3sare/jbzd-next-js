import { GlobalContext, GlobalContextInterface } from "@/context/ContextNew";
import style from "@/styles/usersettings.module.css";
import { useContext } from "react";
import { IoClose } from "react-icons/io5";

const UserPreferences = () => {
  const { blackList, observedList, refreshBlacklist, refreshObservedlist } =
    useContext(GlobalContext) as GlobalContextInterface;

  return (
    <section>
      <div className={style.contentBoxWrapper}>
        <h1>Zarządzanie tagami</h1>
        <div>
          <header>Obserwowane</header>
          <ul></ul>
        </div>
        <div>
          <header>Czarna lista</header>
          <ul></ul>
        </div>
      </div>
      <div className={style.contentBoxWrapper}>
        <h1>Zarządzanie użytkownikami</h1>
        <div>
          <header>Obserwowane</header>
          <ul>
            {observedList.map((observed) => (
              <li key={observed}>
                <span>{observed}</span>
                <button>
                  <IoClose />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <header>Czarna lista</header>
          <ul>
            {blackList.map((blocked) => (
              <li key={blocked}>
                <span>{blocked}</span>
                <button>
                  <IoClose />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={style.contentBoxWrapper}>
        <h1>Zarządzanie działami</h1>
        <div>
          <header>Obserwowane</header>
          <ul></ul>
        </div>
        <div>
          <header>Czarna lista</header>
          <ul></ul>
        </div>
      </div>
    </section>
  );
};

export default UserPreferences;
