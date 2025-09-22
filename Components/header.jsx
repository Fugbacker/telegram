import React, { useState, useEffect, useRef } from "react";
import style from "../styles/File.module.css";
import Link from "next/link";
import { FaBars, FaRegChartBar, FaTimes } from "react-icons/fa";
import { GrCatalog } from "react-icons/gr";
import { TbDeviceDesktopAnalytics } from "react-icons/tb";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  return (
    <header className={style.headerMainContainer}>
      <div className={style.headerInnerContainer}>
        <div className={style.headerTopBarContainer}>
          <Link href="/" className={style.headerLogoLink}>
            <div className={style.headerLogoContainer}>
              <div className={style.headerLogoSvgContainer}>
                {/* <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#ff9d30" />
                  <path d="M2 17L12 22L22 17" stroke="#ff9d30" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 12L12 17L22 12" stroke="#ff9d30" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg> */}

              <svg
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
              >
                <title>TELE 5</title>
                <path
                  d="M.006 0v5.027H3.83V0h-.685v4.18H2.23V.074h-.677V4.18h-.87V0H.007zm5.623.004v14.154h8.658V7.254h8.791V.004H5.628zM3.145 6.076v3.9H.005v.85H3.83v-4.75h-.685zM23 9.926 5.389 18.502c2.371 4.857 8.236 6.874 13.1 4.506v.002C23.352 20.64 25.372 14.783 23 9.926zM.006 12.129v5.027H3.83V12.13h-.685v4.18H2.23v-4.106h-.677v4.106h-.87v-4.18H.007zm0 6.07v5.791h.687v-2.47H3.83v-.848H.693v-2.473H.006z"
                  fill="#ffffff"
                />
              </svg>
              </div>
              <span className={style.headerLogoText}>Teletype</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className={style.headerDesktopMenuContainer}>
            <ul className={style.headerDesktopMenuList}>
              <li className={style.headerDesktopMenuItem}>
                <Link href="/" className={style.headerDesktopMenuLink}>
                  <GrCatalog />
                  <span>Каталог</span>
                </Link>
              </li>
              <li className={style.headerDesktopMenuItem}>
                <Link href="/" className={style.headerDesktopMenuLink}>
                  <TbDeviceDesktopAnalytics />
                  <span>Аналитика</span>
                </Link>
              </li>
              <li className={style.headerDesktopMenuItem}>
                <Link href="/" className={style.headerDesktopMenuLink}>
                  <FaRegChartBar />
                  <span>Рейтинг</span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* Mobile Burger */}
          <button
            className={style.headerMobileMenuButton}
            onClick={toggleMenu}
            aria-label="Открыть меню"
          >
            <FaBars color="#fff"/>
          </button>
        </div>
      </div>

      {/* Mobile Slide Menu */}
      <nav
        ref={menuRef}
        className={`${style.headerMobileMenuContainer} ${isMenuOpen ? style.headerMobileMenuContainerOpen : ""}`}
      >
        <button className={style.headerMobileMenuCloseButton} onClick={toggleMenu} aria-label="Закрыть меню">
          <FaTimes color="#fff"/>
        </button>
        <ul className={style.headerMobileMenuList}>
          <li className={style.headerMobileMenuItem}>
            <Link href="/" className={style.headerMobileMenuLink} onClick={() => setIsMenuOpen(false)}>
              <GrCatalog />
              <span>Каталог</span>
            </Link>
          </li>
          <li className={style.headerMobileMenuItem}>
            <Link href="/" className={style.headerMobileMenuLink} onClick={() => setIsMenuOpen(false)}>
              <TbDeviceDesktopAnalytics />
              <span>Аналитика</span>
            </Link>
          </li>
          <li className={style.headerMobileMenuItem}>
            <Link href="/" className={style.headerMobileMenuLink} onClick={() => setIsMenuOpen(false)}>
              <FaRegChartBar />
              <span>Рейтинг</span>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
