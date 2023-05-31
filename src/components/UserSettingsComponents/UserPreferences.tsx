import { GlobalContext, GlobalContextInterface } from "@/context/ContextNew";
import style from "@/styles/usersettings.module.css";
import createNotifycation from "@/utils/createNotifycation";
import { useContext } from "react";
import { IoClose } from "react-icons/io5";

const UserPreferences = () => {
  const { lists, refreshLists, setNotifys } = useContext(
    GlobalContext
  ) as GlobalContextInterface;

  const users = lists.user;
  const tags = lists.tag;
  const sections = lists.section;

  const handleDeleteFromList = async (
    name: string,
    type: "user" | "section" | "tag",
    method: "follow" | "block"
  ) => {
    const req = await fetch(`/api/user/lists/${type}/${method}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    const res = await req.json();

    if (req.status === 200) {
      refreshLists();
    } else {
      createNotifycation(setNotifys, "info", res.message);
    }
  };

  return (
    <section>
      <div className={style.contentBoxWrapper}>
        <h1>Zarządzanie tagami</h1>
        {tags.follow.length > 0 && (
          <div>
            <header>Obserwowane</header>
            <ul>
              {tags.follow.map((tag) => (
                <li key={tag}>
                  <span>#{tag}</span>
                  <button
                    onClick={() => handleDeleteFromList(tag, "tag", "follow")}
                  >
                    <IoClose />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {tags.block.length > 0 && (
          <div>
            <header>Czarna lista</header>
            <ul>
              {tags.block.map((tag) => (
                <li key={tag}>
                  <span>#{tag}</span>
                  <button
                    onClick={() => handleDeleteFromList(tag, "tag", "block")}
                  >
                    <IoClose />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className={style.contentBoxWrapper}>
        <h1>Zarządzanie użytkownikami</h1>
        {users.follow.length > 0 && (
          <div>
            <header>Obserwowane</header>
            <ul>
              {users.follow.map((user) => (
                <li key={user}>
                  <span>{user}</span>
                  <button
                    onClick={() => handleDeleteFromList(user, "user", "follow")}
                  >
                    <IoClose />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {users.block.length > 0 && (
          <div>
            <header>Czarna lista</header>
            <ul>
              {users.block.map((user) => (
                <li key={user}>
                  <span>{user}</span>
                  <button
                    onClick={() => handleDeleteFromList(user, "user", "block")}
                  >
                    <IoClose />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className={style.contentBoxWrapper}>
        <h1>Zarządzanie działami</h1>
        {sections.follow.length > 0 && (
          <div>
            <header>Obserwowane</header>
            <ul>
              {sections.follow.map((section) => (
                <li key={section}>
                  <span>{section}</span>
                  <button
                    onClick={() =>
                      handleDeleteFromList(section, "section", "follow")
                    }
                  >
                    <IoClose />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default UserPreferences;
