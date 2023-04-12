import React from "react";
import { useState, useEffect } from "react";
import articles from "../store/slices/articles";
import { getAllArticles } from "../store/slices/articles";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import styles from "../components/cssmodules/homelanding.module.css";
// eslint-disable-next-line react/prop-types

function Landing() {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [posts, setPosts] = useState([]);
  const page = 1;
  const limit = 5;

  // get all articles for homepage toolkit
  const dispatch = useDispatch();
  const { loading, articles, error } = useSelector((state) => state.articles);
  // end get all articles for homepage toolkit
  useEffect(() => {
    dispatch(getAllArticles({ page, limit }))
      .unwrap()
      .then((data) => {
        const { posts } = data;
        setPosts(posts);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [dispatch]);

  useEffect(() => {
    setErrorMsg(error);
    setIsLoading(loading);
  }, [loading, articles, error]);

  // get all posts
  // const tryUrl = "http://192.168.1.8:5000/posts/home/";
  // const {
  //   data: allposts,
  //   errorMsg: error,
  //   Looding: Lood,
  // } = useAxiosPost(tryUrl);

  // useEffect(() => {
  //   setIsLoading(Lood);
  //   setErrorMsg(error);
  //   setPosts(allposts);
  // }, [error, allposts, Lood]);

  // eslint-disable-next-line react/prop-types
  const finalPost = posts.map(
    ({ _id, title, image, text, author }, idx) =>
      idx !== 0 && (
        <div className={`  col-12  col-lg-6   mt-3 mb-3  `} key={_id}>
          <Link
            to={`/articles/${_id}`}
            className="text-none textDecorationNone"
          >
            <div className={` ${styles.titleAnimation} ms-auto`}>
              <h4
                className={` card-title text-end mb-4 arabicDirection  mt-4 textDecorationNone`}
              >
                {[...title].length >= 90 ? title.slice(0, 90) + "..." : title}
              </h4>
            </div>
            <div
              className={` ${styles.mainarticleonlyforhover}  ${styles.homeArticlesCardsize} rounded   `}
            >
              <div className={`overFlowHidden `}>
                <img
                  src={image}
                  className={` ${styles.homeArticlesImg} w-100  rounded `}
                  alt="img"
                ></img>
              </div>
              <hr className="text-warning pe-3 ps-3 ms-3 me-3" />

              <div className={`w-xs-50 w-md-100`}>
                <p
                  className=" text-end ms-2 me-2 text-white fs-5 cardTextBreak 
             "
                >
                  {`${text.slice(0, 145)}  `}
                  <span className="text-warning ">... أكمل القراءة</span>
                </p>
              </div>
            </div>
          </Link>
        </div>
      )
  );

  const firstEl = posts.map(
    ({ _id, title, image, text, author }, idx) =>
      idx === 0 && (
        <div
          className={` ${styles.homeArticlesCardsize} col-12 col-lg-7 me-3 pt-5 mt-5 mb-5 ms-auto `}
          key={_id}
        >
          <Link
            to={`/articles/${_id}`}
            className="text-none textDecorationNone"
          >
            <div className={`${styles.titleAnimation} ms-auto`}>
              <h3
                className={`  card-title text-end  mb-4  mt-3 textDecorationNone`}
              >
                {[...title].length >= 90 ? title.slice(0, 90) + "..." : title}
              </h3>
            </div>
            <div
              className={` ${styles.mainarticleonlyforhover} ${styles.homeArticlesCardsize} rounded mt-5 mb-5 `}
            >
              <div className={``}>
                <img
                  src={image}
                  className={` ${styles.homeArticlesImg2} w-100 rounded `}
                  alt="img"
                ></img>
              </div>
              <hr className="text-warning pe-3 ps-3 ms-3 me-3" />
              <p
                className=" text-end ms-2 me-2 text-white fs-5 cardTextBreak
            textDecorationNone "
              >
                {`${text.slice(0, 180)}  `}
                <span className="text-warning">... أكمل القراءة</span>
              </p>
            </div>
          </Link>
        </div>
      )
  );

  return (
    <div className={`container`}>
      <div
        className={`${styles.errorback} ${
          errorMsg && !isLoading
            ? "d-block d-flex justify-content-center align-items-center "
            : posts
            ? "d-none"
            : "d-none"
        }`}
      >
        {errorMsg && !isLoading ? errorMsg : null}
      </div>
      <div
        className={`${styles.errorback} ${
          isLoading !== false && errorMsg === ""
            ? "d-block d-flex justify-content-center align-items-center "
            : "d-none"
        }`}
      >
        {isLoading !== false && errorMsg === "" ? <div>Loading...</div> : null}
      </div>
      <div>
        {posts.length === 0 && isLoading !== true && errorMsg === "" ? (
          <div
            className={`${styles.errorback} ${
              posts.length === 0 && isLoading !== true && errorMsg === ""
                ? " d-flex justify-content-center align-items-center "
                : "d-none"
            } `}
          >
            No Posts To Show.
          </div>
        ) : null}
      </div>
      <div className="container">
        <div className="row ">{firstEl}</div>
        <div className="row">{finalPost}</div>
      </div>
    </div>
  );
}

export default Landing;
