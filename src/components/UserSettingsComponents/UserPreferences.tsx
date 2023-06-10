import { GlobalContext, GlobalContextInterface } from "@/context/ContextNew";
import style from "@/styles/usersettings.module.css";
import createNotifycation from "@/utils/createNotifycation";
import { useContext } from "react";
import { IoClose } from "react-icons/io5";
import useSWR, { mutate } from "swr";
import Loading from "../Loading";

const UserPreferences = () => {
  const {
    setNotifys,
    login: { logged },
  } = useContext(GlobalContext) as GlobalContextInterface;
  const {
    data: lists = {
      user: { follow: [], block: [] },
      tag: { follow: [], block: [] },
      section: { follow: [] },
    },
    isLoading,
    error,
    mutate: refreshLists,
  } = useSWR(logged ? "/api/user/lists" : null, {
    refreshInterval: 0,
  });

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
      {isLoading ? (
        <Loading />
      ) : error ? (
        <div>
          <p>Wystąpił błąd podczas ładowania!</p>
          <button onClick={mutate}>Ponów próbę</button>
        </div>
      ) : (
        <>
          <div className={style.contentBoxWrapper}>
            <h1>Zarządzanie tagami</h1>
            {tags.follow.length > 0 && (
              <div>
                <header>Obserwowane</header>
                <ul>
                  {tags.follow.map((tag: string) => (
                    <li key={tag}>
                      <span>#{tag}</span>
                      <button
                        onClick={() =>
                          handleDeleteFromList(tag, "tag", "follow")
                        }
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
                  {tags.block.map((tag: string) => (
                    <li key={tag}>
                      <span>#{tag}</span>
                      <button
                        onClick={() =>
                          handleDeleteFromList(tag, "tag", "block")
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
          <div className={style.contentBoxWrapper}>
            <h1>Zarządzanie użytkownikami</h1>
            {users.follow.length > 0 && (
              <div>
                <header>Obserwowane</header>
                <ul>
                  {users.follow.map((user: string) => (
                    <li key={user}>
                      <span>{user}</span>
                      <button
                        onClick={() =>
                          handleDeleteFromList(user, "user", "follow")
                        }
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
                  {users.block.map((user: string) => (
                    <li key={user}>
                      <span>{user}</span>
                      <button
                        onClick={() =>
                          handleDeleteFromList(user, "user", "block")
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
          <div className={style.contentBoxWrapper}>
            <h1>Zarządzanie działami</h1>
            {sections.follow.length > 0 && (
              <div>
                <header>Obserwowane</header>
                <ul>
                  {sections.follow.map((section: string) => (
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
        </>
      )}
    </section>
  );
};

export default UserPreferences;
