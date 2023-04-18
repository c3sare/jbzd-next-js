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
import { useState } from "react";
import Link from "next/link";
import { Category, categories } from "../data/categories";
import Image from "next/image";

const Navigation = () => {
  const [showSearch, setShowSearch] = useState<Boolean>(false);
  const [showMobileMenu, setShowMobileMenu] = useState<Boolean>(false);

  const categoryContainer = categories.map(
    (group: Category[], index: number) => (
      <ul key={index}>
        {group.map((category: Category, indexCategory: number) => (
          <li key={indexCategory}>
            <Link
              style={category.color ? { color: category.color } : {}}
              href={category.to}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    )
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
          <Link href="/upload">Dodaj</Link>
          <span className={style.navLink} id="departments">
            Działy <MdArrowDropDown />
            <div className={style.departmentsMenu}>{categoryContainer}</div>
          </span>
          <Link id="coins" href="/">
            <Image
              height={20}
              style={{ marginRight: "10px" }}
              src={coin}
              alt="Moneta"
            />{" "}
            0
          </Link>
          <Link id="icon" href="/">
            <MdEmail />
          </Link>
          <Link id="icon" href="/">
            <MdNotifications />
          </Link>
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
          <div className={style.departmentsMenuMobile}>{categoryContainer}</div>
        </div>
      )}
    </div>
  );
};

export default Navigation;
