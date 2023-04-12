import React from "react";
import { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import axios from "axios";
import styles from "../components/cssmodules/PostsView.module.css";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { getUserArticles } from "../store/slices/userIf";
import { useSelector, useDispatch } from "react-redux/es/exports";
// eslint-disable-next-line react/prop-types
function MyArticles(auth) {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [articlesNum, setArticlesNum] = useState("");
  const [arabicName, setArabicName] = useState("");
  const [articles, setArticles] = useState([]);

  axios.defaults.withCredentials = true;
  // get all posts

  const dispatch = useDispatch();
  const { loading, error, userArticles, username } = useSelector(
    (state) => state.userIf
  );
  let token = sessionStorage.getItem("accessToken");
  useEffect(() => {
    // if (accessToken) {
    //   dispatch(getUserArticles({ accessToken }));
    // }
    if (token) {
      dispatch(getUserArticles())
        .unwrap()
        .then((data) => {
          setArticles(data);
          const [
            {
              author: { arabicname },
            },
          ] = data;
          arabicname ? setArabicName(arabicname) : setArabicName("");
          data ? setArticlesNum(data.length) : setArticlesNum("");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [dispatch, token]);
  const myArticlesMap =
    articles && articles.length !== 0 ? (
      articles.map(({ title, _id, author }) => (
        <div className={`${styles.menuItem} h-100 rounded`} key={_id}>
          <Link
            to={`/users/my-articles/editable/${_id}`}
            className="text-none  textDecorationNone overFlowScroll text-white-50"
          >
            <p className="text-center m-1 b-1">
              {" "}
              {title && [...title].length >= 40 ? title.slice(0, 40) : title}
            </p>
          </Link>
        </div>
      ))
    ) : (
      <div className="d-flex justify-content-center align-items-center">
        <p className="text-warning">there's no posts</p>
      </div>
    );
  return (
    <div className={`${styles.background} container`}>
      {loading ? (
        <div
          className={` ${styles.errorback} d-flex justify-content-center align-items-center `}
        >{`Loading...`}</div>
      ) : error ? (
        <div
          className={` ${styles.errorback} d-flex justify-content-center align-items-center `}
        >
          {error}
        </div>
      ) : (
        <div className="row d-flex justify-content-center align-items-center">
          <aside className={`${styles.myarticles_aside} rounded  col-12  `}>
            <p className={`text-end text-warning mt-5 mb-5 arabicDirection`}>
              <span className="text-white ms-2 arabicDirection"> الاسم : </span>
              {`${arabicName ? arabicName : " "}`}
            </p>
            <p className={`text-end text-warning mt-5 mb-5 arabicDirection`}>
              <span className="text-white ms-2 arabicDirection">
                عدد المقالات :
              </span>
              {`${articlesNum ? articlesNum : "0"}`}
            </p>
            <div className={`d-flex justify-content-around align-items-center`}>
              <DropdownButton
                className={`text-start ms-2 text-light mt-5 mb-5 `}
                id="dropdown-basic-button"
                title="جميع مقالاتي"
              >
                {myArticlesMap ? myArticlesMap : "لا توجد مقالات"}
              </DropdownButton>
              <p className={`text-end text-light mt-5 mb-5 text-white`}>
                الإدارة والتحكم في المقالات
              </p>
            </div>
            <Link
              to={`/users/add-article/`}
              className="text-none  textDecorationNone overFlowScroll text-white-50"
            >
              <button type="button" className="btn btn-success">
                إضافة مقالة
              </button>
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}

export default MyArticles;
