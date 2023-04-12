import { useDispatch, useSelector } from "react-redux";
import oneArticle from "../store/slices/oneArticle";
import { getArticleById } from "../store/slices/oneArticle";
import { useEffect, useState } from "react";
import styles from "./cssmodules/Article.module.css";
import { Navigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Koala from "../images/Koala.jpg";

import Tiptap3 from "./Tiptap3";
function Article(params) {
  const param = useParams();
  let paramMatch = param.id;
  const [matched, setMatched] = useState([]);
  const [latestThree, setLatestThree] = useState([]);
  const [related, setRelated] = useState([]);

  // start toolkit get one article by id
  let img = Koala;
  const dispatch = useDispatch();
  const { oneArticle, loading, error } = useSelector(
    (state) => state.oneArticle
  );

  useEffect(() => {
    dispatch(getArticleById(paramMatch))
      .unwrap()
      .then((data) => {
        const { matched, latestThree, related } = data;

        if (matched) {
          setMatched(matched);
          if (latestThree) {
            setLatestThree(latestThree);
          }
          if (related) {
            setRelated(related);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [dispatch, paramMatch]);

  // end toolkit get one article by id

  // start toolkit get latest 3 articles

  const latestThreeMap =
    latestThree &&
    latestThree.map(({ _id, title }, idx) => (
      <div
        key={_id}
        className={`${
          idx === 2
            ? "align-self-end"
            : idx === 1
            ? "align-self-center"
            : "align-self-start"
        }`}
      >
        <Link
          className={` textDecorationNone `}
          // onClick={(e) => goto(e, _id)}
          to={`/articles/${_id}`}
        >
          <h6
            className={`${styles.latestArticlesTitles} cardTextBreak arabicDirection  align-self-end text-end m-3`}
          >
            {[...title].length >= 50 ? title.slice(0, 50) + "..." : title}
          </h6>
        </Link>
        <hr className="text-warning" />
      </div>
    ));
  // end toolkit get latest 3 articles
  // start toolkit get next and prev id

  const { nextAndPrevId } = useSelector((state) => state.oneArticle);

  //  end get next and prev id

  // let nextId = parseId + 1;
  // let prevId = parseId - 1;
  const [posts, setposts] = useState([]);

  const [gotoTop, setGoToTop] = useState(false);
  const [clicked, setClicked] = useState(false);
  // scrooltotop
  const toTop = () => {
    gotoTop
      ? setTimeout(() => {
          window.scrollTo({
            behavior: "smooth",
            top: 0,
          });
        }, 1000)
      : setGoToTop(false);
  };

  // edite and delete an article
  // main component
  // const hello = matched.body ? matched.body : "";
  //  related
  const relatedMap =
    related &&
    related.map(({ image, title, author: { arabicname }, _id }, idx) => (
      <div
        className={`col-6 overFlowHidden align-self-start ${
          idx === 0 ? "arabicDirection" : ""
        } w-100  p-2 ${styles.relatedBox2} mt-2 mb-2 rounded`}
        key={_id}
      >
        <Link to={`/articles/${_id}`} className={`textDecorationNone`}>
          <img src={image} alt="img" className={`  ${styles.relatedImg} `} />
        </Link>
        <hr className="text-warning" />

        <Link to={`/articles/${_id}`} className={`textDecorationNone`}>
          <p
            className={` ${styles.relatedTitles}  p-2 w-100 arabicDirection  ${
              idx === 1 ? "text-start" : "text-end"
            } `}
          >
            {[...title].length >= 90 ? title.slice(0, 90) + "..." : title}
          </p>
        </Link>
        <div className={`${idx === 0 ? "text-start" : "text-end"} w-50 pb-2`}>
          <span className={`text-light ms-2 `}>بقلم :</span>
          <span className={`text-light`}>{arabicname}</span>
        </div>
      </div>
    ));

  // end-related

  return (
    <div className={`${styles.background}`}>
      {/* <div
        className={`${styles.errorback} 
        ${
          error && !loading
            ? "d-block d-flex justify-content-center align-items-center "
            : "d-none"
        }`}
      >
        {error && !loading ? error : null}
      </div> */}
      <div className="container ">
        <div className={` row`}>
          <div className="col-md-4 d-none d-lg-block mt-5 pt-5 ">
            <div
              className={`${styles.articleAside}  ${
                error && !loading
                  ? "d-none d-flex justify-content-center align-items-center "
                  : "d-block"
              }  rounded `}
            >
              <div
                className={`overFlowHidden ${
                  latestThree.length > 0 ? "d-block" : "d-none"
                }  `}
              >
                <h5 className={`text-warning  text-end m-5 me-3`}>
                  أحدث مقالات الكاتب
                </h5>
                <hr className="text-warning" />
                <div
                  className={` ${styles.latestArticles} cardTextBreak d-flex flex-row-reverse  justify-content-center `}
                >
                  {latestThreeMap ? latestThreeMap : "لاتوجد مقالات"}
                </div>
              </div>
              <div
                className={`container ${styles.relatedBox} ${
                  related.length > 0 ? "d-block" : "d-none"
                }  mt-5 me-5 `}
              >
                <div
                  className={`row  cardTextBreak d-flex justify-content-between `}
                >
                  <h5 className="text-warning text-end">مقالات ذات صلة</h5>
                  {relatedMap}
                </div>
              </div>
            </div>
          </div>

          <div className={` m-0 p-0 col-12 col-lg-8 mb-3`}>
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
              {matched.length === 0 && loading !== true && error === "" ? (
                <div
                  className={`${styles.errorback} ${
                    !matched && !loading && !error
                      ? " d-flex justify-content-center align-items-center "
                      : "d-none"
                  } `}
                >
                  No Posts To Show.
                </div>
              ) : null}
            </div>

            <div
              className={`${styles.backgroundArticle} ${
                error || loading || !matched ? "d-none" : "d-block"
              }`}
            >
              <section className={`container mt-5 pt-5`}>
                <div
                  className={`text-end position-relative rounded mt-5 pt-5 ${styles.articleStyle} mt-3`}
                >
                  <h3
                    className={` ${styles.articleMargin} mt-5 end-0 bottom-50 position-absolute  me-3 text-center text-warning text-sm-end mb-3 mt-5 pt-3`}
                  >
                    {matched.title
                      ? [...matched.title].length >= 150
                        ? matched.title.slice(0, 150)
                        : matched.title
                      : "no title"}
                  </h3>

                  <div className={`ms-2 pb-2 position-absolute bottom-0`}>
                    <h5 className="text-white-50  text-start">{`  بقلم :   ${
                      matched.author ? matched.author.arabicname : "الكاتب"
                    }  `}</h5>
                    <h6 className="text-white-50 text-start ">{` ${
                      matched.date ? matched.date.slice(0, 10) : null
                    }`}</h6>
                  </div>
                </div>
                <hr className="text-warning" />
                <div
                  className={`text-center img-fluid ${styles.backgroundArticle} rounded`}
                >
                  <img
                    className={` mb-2 ${styles.imgWands} `}
                    src={matched.image ? matched.image : "image"}
                    alt="img"
                  />
                </div>
                <hr className="text-warning pb-2" />
                <div
                  className={`${styles.paragraphBackground} text-end mt-2 mb-5 pb-4 pt-4 border border-dark`}
                >
                  <div
                    className={`${styles.paragraphText} cardTextBreak text-end text-black mt-2 mb-2 ps-3 pe-3`}
                  >
                    <Tiptap3 data={matched.body} clicked={clicked} />
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
                        nextAndPrevId.prevPostId !== "noprev"
                          ? "d-block"
                          : "d-none"
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
                        nextAndPrevId.nextPostId !== "nonext"
                          ? "d-block"
                          : "d-none"
                      }`}
                    >
                      Next Article
                    </button>
                  </Link>
                </div>
                <div className={` d-lg-none rounded `}>
                  <div
                    className={`overFlowHidden ${
                      latestThree.length > 0 ? "d-block" : "d-none"
                    } `}
                  >
                    <h5 className={` text-warning  text-end m-5 me-3`}>
                      أحدث مقالات الكاتب
                    </h5>
                    <hr className="text-warning" />
                    <div
                      className={` ${styles.latestArticles}  cardTextBreak d-flex flex-row-reverse  justify-content-center `}
                    >
                      {latestThreeMap ? latestThreeMap : "لاتوجد مقالات"}
                    </div>
                  </div>
                  <hr className="text-warning" />
                  <div
                    className={` ${related.length > 0 ? "d-block" : "d-none"} `}
                  >
                    <h5 className="text-warning cardTextBreak  text-end m-5 me-3">
                      مقالات ذات صلة
                    </h5>
                    {relatedMap}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Article;
