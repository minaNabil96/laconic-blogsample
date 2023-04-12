import { useDispatch, useSelector } from "react-redux";
import oneArticle from "../store/slices/oneArticle";
import { getArticleById } from "../store/slices/oneArticle";
import deleteArticle from "../store/slices/deleteArticle";
import auth from "../store/slices/auth";
import { login, getUserInfo } from "../store/slices/auth";
import { deleteArticleAsync } from "../store/slices/deleteArticle";
import addPostSlice from "../store/uiSlices/addPostSlice";
import { useEffect, useState, useLayoutEffect } from "react";
import axios from "axios";
import styles from "./cssmodules/Article.module.css";
import { useParams, useNavigate, Link } from "react-router-dom";
import { hideArticle, retrieveArticle } from "../store/slices/adminSlice";
import Tiptap3 from "./Tiptap3";
import LoginModal from "./LoginModal";
import {
  modalStatus,
  modalMessage,
  closeModal,
  formModal,
  modalType,
  showModal,
} from "../store/uiSlices/modalSlice";
function EditableArticle(params) {
  const param = useParams();
  let paramMatch = param.id;
  const navigate = useNavigate();
  const [body, setBody] = useState([]);
  const [articleD, setArticleD] = useState([]);
  const [latestThree, setLatestThree] = useState([]);
  const [isidentity, setIsIdentity] = useState({});
  const [adminId, setAdminId] = useState("");
  const [usernameFromGetUserInfo, setUsernameFromGetUserInfo] = useState("");

  // editable toolkit

  const dispatch = useDispatch();
  const { title: titleView, imageView } = useSelector(
    (state) => state.addPostSlice
  );
  const { oneArticle, loading, error } = useSelector(
    (state) => state.oneArticle
  );
  const username = sessionStorage.getItem("username");
  const isSuper = sessionStorage.getItem("isSuper");
  const admin = sessionStorage.getItem("admin");

  useEffect(() => {
    dispatch(getUserInfo())
      .unwrap()
      .then((user) => {
        const { _id, admin, username } = user;
        setUsernameFromGetUserInfo(username);

        if (admin === true) {
          setAdminId(_id);
          setUsernameFromGetUserInfo(username);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [dispatch]);

  //  var for useEffect only
  const checkStorageUsername = sessionStorage.getItem("username");
  const checkStorageIsSuper = sessionStorage.getItem("isSuper");
  const checkStorageAdmin = sessionStorage.getItem("admin");

  useEffect(() => {
    dispatch(getArticleById(param.id))
      .unwrap()
      .then((data) => {
        const { matched, latestThree } = data;
        const { author, body, visible } = matched;
        const { username, isSuper } = author;

        username ? setIsIdentity({ username, isSuper }) : setIsIdentity({});
        if (username !== checkStorageUsername) {
          if (checkStorageAdmin === "true") {
            setArticleD(matched);
            body ? setBody(body) : setBody([]);

            if (latestThree) {
              setLatestThree(latestThree);
            } else {
              navigate("/all-articles");
            }
          }
        } else if (username === checkStorageUsername && isSuper === true) {
          if (matched.visible === true) {
            setArticleD(matched);
            body ? setBody(body) : setBody([]);
          }

          if (latestThree) {
            setLatestThree(latestThree);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [checkStorageAdmin, checkStorageUsername, dispatch, navigate, param.id]);

  // useEffect(() => {

  //   if (username !== identity) {
  //     if (checkStorageAdmin === true) {
  //       setArticleD(matched);
  //       body ? setBody(body) : setBody([]);

  //       if (latestThree) {
  //         setLatestThree(latestThree);
  //       } else {
  //         navigate("/all-articles");
  //       }
  //     }
  //   }

  // }, [third])

  const [posts, setposts] = useState([]);
  const [loginStatus, setLoginStatus] = useState(false);
  const [loginMsg, setLoginMsg] = useState("");
  const [nextId, setNextID] = useState("");
  const [prevId, setPrevId] = useState("");
  const [allPostsList, setAllPostsList] = useState([]);
  const [gotoTop, setGoToTop] = useState(false);
  const [clicked, setClicked] = useState(false);
  // scrolltotop
  const toTop = () => {
    gotoTop && allPostsList
      ? setTimeout(() => {
          window.scrollTo({
            behavior: "smooth",
            top: 0,
          });
        }, 1000)
      : setGoToTop(false);
  };

  // get nextandprevid
  const { nextAndPrevId } = useSelector((state) => state.oneArticle);
  // end get nextprev id
  // edite and delete an article

  const deleteHandler = () => {
    if (admin === "true") {
      dispatch(hideArticle({ adminId, paramMatch }))
        .unwrap()
        .then((res) => {
          if (res.status === "deleted") {
            dispatch(showModal());
            dispatch(modalStatus(true));
            dispatch(modalMessage({ status: res.status, color: "success" }));
            setLoginStatus(true);
            setLoginMsg(res.status);
            setTimeout(() => {
              dispatch(closeModal());
            }, 3000);
          } else if (res.status === "failed") {
            dispatch(showModal());
            dispatch(modalStatus(true));
            dispatch(modalMessage({ status: res.status, color: "danger" }));
            setLoginStatus(true);
            setLoginMsg(res.status);
            setTimeout(() => {
              dispatch(closeModal());
            }, 3000);
          } else {
            setTimeout(() => {
              navigate("/users/login");
            }, 3000);
          }
        })
        .catch((err) => {
          console.log(err);
          setTimeout(() => {
            navigate("/users/login");
          }, 3000);
        });
    } else {
      dispatch(deleteArticleAsync(param.id))
        .unwrap()
        .then((res) => {
          if (res.status === "deleted") {
            dispatch(showModal());
            dispatch(modalStatus(true));
            dispatch(modalMessage({ status: res.status, color: "success" }));

            setTimeout(() => {
              dispatch(closeModal());
            }, 3000);
          } else if (res.status === "failed") {
            dispatch(showModal());
            dispatch(modalStatus(true));
            dispatch(modalMessage({ status: res.status, color: "danger" }));
            setLoginStatus(true);
            setLoginMsg(res.status);
            setTimeout(() => {
              dispatch(closeModal());
            }, 3000);
          } else {
            setTimeout(() => {
              navigate("/users/login");
            }, 3000);
          }
        })
        .catch((err) => {
          console.log(err);
          setTimeout(() => {
            navigate("/users/login");
          }, 3000);
        });
    }
  };
  const editeHandler = () => {
    setClicked(true);
  };

  const editeClose = () => {
    setClicked(false);
  };

  //  start retrieve for admin
  const retrieveHandler = (e) => {
    e.preventDefault();
    if (admin === "true" && adminId) {
      dispatch(retrieveArticle({ adminId, paramMatch }))
        .unwrap()
        .then((res) => {
          if (res.status === "retrieved") {
            dispatch(showModal());
            dispatch(modalStatus(true));
            dispatch(modalMessage({ status: res.status, color: "success" }));

            setTimeout(() => {
              dispatch(closeModal());
            }, 3000);
          } else if (res.status === "failed") {
            dispatch(showModal());
            dispatch(modalStatus(true));
            dispatch(modalMessage({ status: res.status, color: "danger" }));
            setLoginStatus(true);
            setLoginMsg(res.status);
            setTimeout(() => {
              dispatch(closeModal());
            }, 3000);
          } else {
            setTimeout(() => {
              navigate("/users/login");
            }, 3000);
          }
        })
        .catch((err) => {
          console.log(err);
          setTimeout(() => {
            navigate("/users/login");
          }, 3000);
        });
    } else {
      setTimeout(() => {
        navigate("/users/login");
      }, 3000);
    }
  };
  // end retrieve
  // main component
  // const hello = oneArticle.body ? oneArticle.body : "";

  return (
    <div className={styles.background}>
      {(isidentity.username === checkStorageUsername &&
        isidentity.isSuper === true) ||
      checkStorageAdmin === "true" ? (
        <>
          <div
            className={`${styles.errorback}
        ${
          error && !loading
            ? "d-block d-flex justify-content-center align-items-center "
            : "d-none"
        }`}
          >
            {error && !loading ? error : null}
          </div>
          <div
            className={`${styles.errorback} ${
              loading !== false && error === ""
                ? "d-block d-flex justify-content-center align-items-center "
                : "d-none"
            }`}
          >
            {loading !== false && !error ? <div>loading...</div> : null}
          </div>
          <div>
            {articleD.length === 0 &&
            allPostsList.length !== 0 &&
            loading !== true &&
            error === "" ? (
              <div
                className={`${styles.errorback} ${
                  !articleD && !loading && error
                    ? " d-flex justify-content-center align-items-center "
                    : "d-none"
                } `}
              >
                No Posts To Show.
              </div>
            ) : null}
          </div>
          <div
            className={`${styles.background} ${
              error || loading || !articleD ? "d-none" : "d-block"
            }`}
          >
            <section className="container">
              <div className={`  text-end   pt-5`}>
                <h2
                  className={` ${styles.articleMargin} ${
                    titleView ? "d-none" : "d-block"
                  } text-center text-light text-sm-end mb-3 mt-5 pt-3`}
                >
                  {articleD.title ? articleD.title : "title"}
                </h2>
                <h2
                  className={` ${styles.articleMargin} ${
                    titleView ? "d-block" : "d-none"
                  } text-center text-light text-sm-end mb-3 mt-5 pt-3`}
                >
                  {titleView
                    ? [...titleView].length >= 150
                      ? titleView.slice(0, 150)
                      : titleView
                    : "no title"}
                </h2>
                <div
                  className={` ${
                    isSuper === "true" &&
                    (isidentity.username === username || admin === "true")
                      ? "d-block"
                      : "d-none"
                  }`}
                >
                  <button
                    type="button"
                    className={`btn btn-warning mb-2 ms-auto ${
                      clicked ? "d-none" : "d-block"
                    }`}
                    onClick={() => editeHandler()}
                  >
                    تعديل المقال
                  </button>
                </div>
                <div>
                  <h5 className="text-white-50 text-start">{`  بقلم :   ${
                    articleD.author ? articleD.author.arabicname : "الكاتب"
                  }  `}</h5>
                  <h6 className="text-white-50 text-start ">{` ${
                    articleD.date ? articleD.date.slice(0, 10) : null
                  }`}</h6>
                </div>
              </div>
              <hr />
              <div className="text-center img-fluid ">
                <img
                  className={`mb-2 img-wands ${
                    imageView ? "d-none" : "d-block"
                  } `}
                  src={articleD.image ? articleD.image : "image"}
                  alt="img"
                />
                <img
                  className={`mb-2 img-wands ${
                    imageView ? "d-block" : "d-none"
                  } `}
                  src={imageView ? imageView : "image"}
                  alt="img"
                />
              </div>
              <hr className="pb-2" />
              <div
                className={`${styles.paragraphBackground} text-end mt-2 mb-5 pb-4 pt-4 border border-dark`}
              >
                <div
                  className={`${styles.paragraphText} cardTextBreak text-end text-black mt-2 mb-2 ps-3 pe-3`}
                >
                  <Tiptap3 data={body} clicked={clicked} />

                  <button
                    type="button"
                    className={`btn btn-danger mb-2 ms-auto ${
                      clicked && articleD.visible === true
                        ? "d-block"
                        : "d-none"
                    }`}
                    onClick={() => deleteHandler()}
                  >
                    {admin === "true" && username !== isidentity.username
                      ? "إخفاء المقال"
                      : "حذف المقال"}
                  </button>
                  <button
                    type="button"
                    className={`btn btn-primary mb-2 ms-auto ${
                      admin === "true" && articleD.visible === false
                        ? "d-block"
                        : "d-none"
                    }`}
                    onClick={(e) => retrieveHandler(e)}
                  >
                    {admin === "true" && articleD.visible === false
                      ? " استرجاع المقال ؟"
                      : " "}
                  </button>
                  <button
                    type="button"
                    className={`btn btn-primary mb-2 ms-auto ${
                      clicked ? "d-block" : "d-none"
                    }`}
                    onClick={() => editeClose()}
                  >
                    إنهاء
                  </button>
                </div>
              </div>
              <br />
              <div className="d-flex justify-content-between align-items-center">
                <Link
                  to={`/articles/${nextAndPrevId.prevPostId}`}
                  className={`textDecorationNone`}
                  onClick={toTop}
                >
                  <button
                    className={`btn btn-danger m-2 ${
                      nextAndPrevId.prevPostId === "noprev"
                        ? "d-none"
                        : "d-block"
                    }`}
                  >
                    Previous Article
                  </button>
                </Link>
                <Link
                  to={`/articles/${nextAndPrevId.nextPostId}`}
                  className={`textDecorationNone`}
                  onClick={toTop}
                >
                  <button
                    className={`btn btn-primary m-2 ${
                      nextAndPrevId.nextPostId === "nonext"
                        ? "d-none"
                        : "d-block"
                    }`}
                  >
                    Next Article
                  </button>
                </Link>
              </div>
            </section>
          </div>
        </>
      ) : (
        <div
          className={`${styles.errorback}
            d-flex justify-content-center align-items-center `}
        >
          {`Can't Access`}
        </div>
      )}
    </div>
  );
}

export default EditableArticle;
