import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import styles from "./cssmodules/Navbar.module.css";
import { useEffect, useState } from "react";
// import logo from "../images/PicsArt_23-01-08_15-19-55-850.png";
import axios from "axios";
import SearchBar from "./SearchBar";
import articles from "../store/slices/articles";
import { getSearched } from "../store/slices/search";
import auth from "../store/slices/auth";
import { logOut } from "../store/slices/auth";
import { useSelector, useDispatch } from "react-redux/es/exports";
import { GrClose } from "react-icons/gr";
import { restart } from "../store/slices/search";
import { NavDropdown } from "react-bootstrap";
const Navbar = ({ Translation }) => {
  let logo = `https://res.cloudinary.com/minatry/image/upload/v1680476080/uf4cjc3lcgcif9bihfrp.png`;
  // english to arabic
  const [Translate, setTranslate] = useState(false);
  const [token, setToken] = useState(false);
  let accessToken = sessionStorage.getItem("accessToken");
  let isAdmin = sessionStorage.getItem("admin");
  useEffect(() => {
    accessToken ? setToken(true) : setToken(false);
  }, [accessToken]);

  // const translateHandler = () => {
  //   setTranslate(!Translate);
  //   Translation(!Translate);
  // };
  const localhost = process.env.REACT_APP_LOCALHOST;
  // const accessToken = sessionStorage.getItem("accessToken")
  // logout

  const navigate = useNavigate();

  const logout = (e) => {
    e.preventDefault();
    sessionStorage.clear();

    dispatch(logOut())
      .unwrap()
      .then((res) => {
        const { status } = res;
        if (status) {
          if (status.includes("success")) {
            sessionStorage.clear();
            setTimeout(() => {
              navigate(`/users/login/`);
              setTimeout(() => {
                handleNavCollapse();
              }, 1500);
            }, 500);
          }
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
    // if (accessToken) {
    //   try {
    //     const logout = await axios.post(`${localhost}/users/logout`);
    //     const data = await logout.data;
    //     console.log(data)
    //     ;
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }
  };

  // end logout
  const dispatch = useDispatch();
  const {
    loading: loading2,
    error: error2,
    articles: articles2,
  } = useSelector((state) => state.search);

  // scrolltotoponclick
  const toTop = (e) => {
    window.scrollTo(0, 0);
    handleNavCollapse();

    dispatch(restart());
  };
  // nav color changer
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [changeIcons, setChangeIcon] = useState(false);
  const [NavBackground, setNavBackground] = useState(false);
  const handleNavCollapse = () => {
    setIsNavCollapsed(!isNavCollapsed);
    setNavBackground(true);
    setChangeIcon(!changeIcons);
  };

  const scrollHandler = useEffect(() => {
    const scrollHandler = () => {
      setTimeout(() => {
        setIsNavCollapsed(true);
        setChangeIcon(false);
      }, 100);

      if (window.scrollY >= 66) {
        setNavBackground(true);
      } else {
        setNavBackground(false);
      }
      window.addEventListener("scroll", scrollHandler);
    };
    scrollHandler();
  }, []);

  // const [term, setTerm] = useState("");
  // const searcheHandler = (e) => {
  //   setTerm(e.target.value);
  // };

  const { loading, error, articles } = useSelector((state) => state.articles);

  // const searchButton = (e) => {
  //   e.preventDefault();

  //   navigate("all-articles");
  //   dispatch(getSearched({ term }));
  // };

  return (
    <nav
      className={`navbar navbar-expand-sm fixed-top ${
        NavBackground || !isNavCollapsed
          ? `${styles.navbarback2}`
          : `${styles.navbarback1}`
      }`}
      onScroll={() => scrollHandler()}
    >
      <div className="container">
        <Link
          className="navbar-brand logo-container"
          to="/"
          onClick={(e) => toTop(e)}
        >
          <div className={`${styles.logoImgSize}  pt-1 pb-1`}>
            <img className={`${styles.logoImgSize}`} src={logo} alt="."></img>
          </div>
        </Link>

        <button
          onClick={() => handleNavCollapse()}
          className="navbar-toggler"
          type="button"
          data-bs-toggle="navbar-collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded={!isNavCollapsed ? true : false}
          aria-label="Toggle navigation"
        >
          <i
            className={`${
              isNavCollapsed ? "text-light" : "navbutton"
            } lni lni-menu ${changeIcons ? "d-none" : "d-block"}`}
          ></i>
          <GrClose className={` ${changeIcons ? "d-block" : "d-none"}`} />
        </button>
        <div
          className={`${isNavCollapsed ? "collapse" : ""} navbar-collapse`}
          id="navbarSupportedContent"
        >
          <ul
            className={` navbar-nav  gap-lg-2 ms-auto mb-lg-0 d-md-flex justify-content-md-center align-items-md-center`}
          >
            <li>
              <SearchBar />
            </li>
            <li className={`  nav-item`}>
              <NavLink
                className={`    ${styles.titleAnimation} nav-link ${
                  token ? "d-block" : "d-none"
                }`}
                to="/users/add-article/"
                onClick={(e) => toTop(e)}
              >
                {Translate ? "Add Article" : "إضافة مقالة"}
              </NavLink>
            </li>
            <NavDropdown
              className={`align-middle mb-1  ${
                token && isAdmin === "true" ? "d-block" : "d-none"
              }`}
              title="التحكم"
              id="basic-nav-dropdown"
            >
              <li className={`  nav-item`}>
                <NavLink
                  className={`  ${styles.titleAnimation} nav-link text-center ${
                    token && isAdmin === "true" ? "d-block" : "d-none"
                  }`}
                  to="/users/adminif"
                  onClick={(e) => toTop(e)}
                >
                  {Translate ? "Admin if" : "لوحة الأدمن"}
                </NavLink>
              </li>
              <li className={`  nav-item`}>
                <NavLink
                  className={`  ${styles.titleAnimation} nav-link text-center ${
                    token && isAdmin === "true" ? "d-block" : "d-none"
                  }`}
                  to="/users/userif"
                  onClick={(e) => toTop(e)}
                >
                  {Translate ? "Add Article" : "لوحة الكاتب"}
                </NavLink>
              </li>
            </NavDropdown>
            <li className={`  nav-item`}>
              <NavLink
                className={`  ${styles.titleAnimation} nav-link ${
                  token && isAdmin !== "true" ? "d-block" : "d-none"
                }`}
                to="/users/userif"
                onClick={(e) => toTop(e)}
              >
                {Translate ? "Add Article" : "لوحة الكاتب"}
              </NavLink>
            </li>
            <li className={` ${token ? "d-none" : "d-block"} nav-item`}>
              <NavLink
                className={`  ${styles.titleAnimation} nav-link`}
                to="/contact"
                onClick={(e) => toTop(e)}
              >
                {Translate ? "Contact" : "التواصل"}
              </NavLink>
            </li>
            <li className={`  nav-item`}>
              <NavLink
                className={`  ${styles.titleAnimation} nav-link`}
                to="/sections"
                onClick={(e) => toTop(e)}
              >
                {Translate ? "Sections" : "الأقسام"}
              </NavLink>
            </li>
            <li className={`  nav-item`}>
              <NavLink
                className={`  ${styles.titleAnimation} nav-link`}
                to="/all-articles"
                onClick={(e) => toTop(e)}
              >
                {Translate ? "All Articles" : "جميع المقالات"}
              </NavLink>
            </li>
            <li className={`  nav-item`}>
              <NavLink
                end
                onClick={(e) => toTop(e)}
                className={`home-link   ${styles.titleAnimation} nav-link `}
                aria-current="page"
                to="/"
              >
                {Translate ? "Home" : "الرئيسية"}
              </NavLink>
            </li>
            <li className={`nav-item ${token ? "d-none" : "d-block"}`}>
              <NavLink
                className={`  ${styles.titleAnimation} nav-link`}
                to="/users/login"
                onClick={(e) => toTop(e)}
              >
                {Translate ? "Login" : "تسجيل الدخول"}
              </NavLink>
            </li>
          </ul>
          <Link
            className={` me-2   ${token ? "d-block" : "d-none"}`}
            to="/users/login"
            onClick={(e) => toTop(e)}
          >
            <button
              onClick={(e) => logout(e)}
              type="button"
              className={`btn ms-2 btn-warning rounded-pill `}
            >
              {Translate ? "Logout" : "الخروج"}
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
