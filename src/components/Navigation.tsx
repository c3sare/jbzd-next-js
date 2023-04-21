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
import { useContext, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CategoryContext } from "@/context/categories";
import { LoginContext } from "@/context/login";

const Navigation = () => {
  const [showSearch, setShowSearch] = useState<Boolean>(false);
  const [showMobileMenu, setShowMobileMenu] = useState<Boolean>(false);
  const categories = useContext(CategoryContext);
  const { login, logged } = useContext(LoginContext);

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
        <hr />
        {pageCategories.map((category, indexCategory) => (
          <li key={indexCategory}>
            <Link
              style={category.color ? { color: category.color } : {}}
              href={category.slug}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
      <ul>
        <span>nsfw:</span>
        {nsfwCategories.map((category, indexCategory) => (
          <li key={indexCategory}>
            <Link
              style={category.color ? { color: category.color } : {}}
              href={category.slug}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
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
          <Link href="/losowe">Losowe</Link>
          {logged && <Link href="/upload">Dodaj</Link>}
          <span className={style.navLink} id="departments">
            Działy <MdArrowDropDown />
            <div className={style.departmentsMenu}>{categoriesContainer}</div>
          </span>
          <Link id="coins" href="/" onClick={(e) => e.preventDefault()}>
            <Image
              height={20}
              style={{ marginRight: "10px" }}
              src={coin}
              alt="Moneta"
            />{" "}
            0
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
          <div className={style.loginInfo}>
            <Link href="/login">
              <Image src={defaultAvatar} alt="Avatar" />
              <span>Niezalogowany</span>
            </Link>
          </div>
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
            <Link href="/ulubione">
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
            <Link href="/upload">
              <span className={style.iconMenu}>
                <MdOutlineFileUpload />
              </span>
              <span>Upload</span>
            </Link>
            <Link href="/uzytkownik/ustawienia">
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
