import style from "@/styles/navigation.module.css";
import logo from "@/images/logo.png";
import coin from "@/images/coin.png";
import defaultAvatar from "@/images/avatars/default.jpg";
import {
  MdCampaign,
  MdSearch,
  MdEmail,
  MdNotifications,
  MdMenu,
  MdArrowDropDown,
  MdAccessTime,
  MdStar,
  MdOutlineFileUpload,
  MdSettings,
} from "react-icons/md";
import { GiDiceSixFacesTwo } from "react-icons/gi";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AiOutlinePoweroff } from "react-icons/ai";
import createNotifycation from "@/utils/createNotifycation";
import { GlobalContext, GlobalContextInterface } from "@/context/ContextNew";
import { useRouter } from "next/router";

const Navigation = ({ loginPanel }: { loginPanel: JSX.Element }) => {
  const router = useRouter();
  const [showSearch, setShowSearch] = useState<Boolean>(false);
  const [showMobileMenu, setShowMobileMenu] = useState<Boolean>(false);
  const {
    categories,
    login: { login, logged },
    setNotifys,
    coins,
  } = useContext(GlobalContext) as GlobalContextInterface;

  useEffect(() => {
    if (showMobileMenu) setShowMobileMenu(false);
  }, [router.pathname]);

  const normalCategories =
    categories !== null
      ? categories.filter((item) => !item.nsfw && !item.asPage)
      : [];
  const nsfwCategories =
    categories !== null ? categories.filter((item: any) => item.nsfw) : [];
  const pageCategories =
    categories !== null
      ? categories.filter((item) => item.asPage && !item.nsfw)
      : [];

  const categoriesContainer = (
    <>
      <ul>
        {normalCategories.map((category, indexCategory) => (
          <li key={indexCategory}>
            <Link
              style={category.color ? { color: category.color } : {}}
              href={"/kategoria/" + category.slug}
            >
              {category.name}
            </Link>
          </li>
        ))}
        {logged && (
          <>
            <hr />
            {pageCategories.map((category, indexCategory) => (
              <li key={indexCategory}>
                <Link
                  style={category.color ? { color: category.color } : {}}
                  href={"/" + category.slug}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </>
        )}
      </ul>
      {logged && (
        <ul>
          <span>nsfw:</span>
          {nsfwCategories.map((category, indexCategory) => (
            <li key={indexCategory}>
              <Link
                style={category.color ? { color: category.color } : {}}
                href={"/" + category.slug}
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );

  return (
    <div className={style.nav}>
      <div className={style.navContent}>
        <div className={style.left}>
          <Link href="/" className={style.logo}>
            <Image
              height={35}
              src={logo}
              alt="logo"
              style={{ margin: "5px" }}
            />
          </Link>
          <Link href="/mikroblog/gorace">
            <MdCampaign /> Mikroblog
          </Link>
          <span
            className={style.navLink}
            onClick={(e) => {
              e.preventDefault();
              setShowSearch(!showSearch);
            }}
          >
            <MdSearch /> Szukaj
          </span>
        </div>
        <div className={style.right}>
          <Link href="/oczekujace">Oczekujące</Link>
          {logged && (
            <span className={style.navLink} id="observed">
              Obserwowane <MdArrowDropDown />
              <div className={style.departmentsMenu}>
                <ul>
                  <li>
                    <Link href="/obserwowane/dzialy">Działy</Link>
                  </li>
                  <li>
                    <Link href="/obserwowane/uzytkownicy">Użytkownicy</Link>
                  </li>
                </ul>
              </div>
            </span>
          )}
          <Link href="/losowe">Losowe</Link>
          <span className={style.navLink} id="departments">
            Działy <MdArrowDropDown />
            <div className={style.departmentsMenu}>{categoriesContainer}</div>
          </span>
          <Link
            className={style.coins}
            href="/"
            onClick={(e) => {
              e.preventDefault();
              if (!logged) {
                createNotifycation(
                  setNotifys,
                  "info",
                  "Nie jesteś zalogowany!"
                );
              }
            }}
          >
            <Image
              height={20}
              style={{ marginRight: "10px" }}
              src={coin}
              alt="Moneta"
            />{" "}
            {coins}
          </Link>
          {logged && (
            <>
              <Link id="icon" href="/">
                <MdEmail />
              </Link>
              <Link id="icon" href="/">
                <MdNotifications />
              </Link>
            </>
          )}
          <span
            className={style.mobileMenu}
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <MdMenu />
          </span>
        </div>
      </div>
      {showSearch && (
        <div className={style.search}>
          <div className={style.searchContent}>
            <form>
              <div className={style.inputs}>
                <input placeholder="Wpisz szukaną wartość..." />
                <button>
                  <MdSearch />
                </button>
              </div>
              <div className={style.searchIn}>
                <label>
                  <input type="radio" name="search" /> Wszystkie
                </label>
                <label>
                  <input type="radio" name="search" /> Obrazki
                </label>
                <label>
                  <input type="radio" name="search" /> Tagi
                </label>
                <label>
                  <input type="radio" name="search" /> Użytkownicy
                </label>
              </div>
            </form>
          </div>
        </div>
      )}
      {showMobileMenu && (
        <div className={style.mobileMenuContainer}>
          {logged ? (
            <div className={style.loginInfo}>
              <Link href={"/uzytkownik/" + login}>
                <Image src={defaultAvatar} alt="Avatar" />
                <span>{login}</span>
              </Link>
              <Link href="/wyloguj">
                <AiOutlinePoweroff />
              </Link>
            </div>
          ) : (
            loginPanel
          )}
          <div className={style.mainMenuMobileContainer}>
            <Link href="/mikroblog">
              <span className={style.iconMenu}>
                <MdCampaign />
              </span>
              <span>Mikroblog</span>
            </Link>
            <Link href="/wyszukaj">
              <span className={style.iconMenu}>
                <MdSearch />
              </span>
              <span>Szukaj</span>
            </Link>
            <Link href="/oczekujace">
              <span className={style.iconMenu}>
                <MdAccessTime />
              </span>
              <span>Oczekujące</span>
            </Link>
            <Link href="/ulubione" className={!logged ? style.inactive : ""}>
              <span className={style.iconMenu}>
                <MdStar />
              </span>
              <span>Ulubione</span>
            </Link>
            <Link href="/losowe">
              <span className={style.iconMenu}>
                <GiDiceSixFacesTwo />
              </span>
              <span>Losowe</span>
            </Link>
            {logged && (
              <Link href="/upload">
                <span className={style.iconMenu}>
                  <MdOutlineFileUpload />
                </span>
                <span>Upload</span>
              </Link>
            )}
            <Link
              href="/uzytkownik/ustawienia"
              className={!logged ? style.inactive : ""}
            >
              <span className={style.iconMenu}>
                <MdSettings />
              </span>
              <span>Ustawienia</span>
            </Link>
          </div>
          <div className={style.departmentsMenuMobile}>
            {categoriesContainer}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navigation;
