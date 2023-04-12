import React, { useState, useEffect } from "react";
import axios from "axios";
import Post from "./Post";
import styles from "../components/cssmodules/PostsView.module.css";
import ReactPaginate from "react-paginate";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import oneSection from "../store/slices/oneSection";
import { getOneSectionArticles } from "../store/slices/oneSection";
function Posts() {
  // pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3);
  const [posts, setposts] = useState([]);
  const [numOfPages, setNumOfPages] = useState(0);
  const [numOfDocuments, setNumOfDocuments] = useState(0);
  const [nextPage, setNextPage] = useState("");
  const [prevPage, setPrevPage] = useState(1);
  const [Loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  // end pagination

  // routing
  const params = useParams();
  const currentParam = params.id;

  const toTop = () => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 1200);
  };

  // start toolkit get one section articles
  const dispatch = useDispatch();
  const { oneSection, loading, error } = useSelector(
    (state) => state.oneSection
  );

  useEffect(() => {
    dispatch(getOneSectionArticles({ currentParam, page, limit }))
      .unwrap()
      .then((data) => {
        const { posts, numOfDocuments, numOfPages, nextPage, prevPage } = data;
        setposts(posts);
        setNumOfDocuments(numOfDocuments);
        setNumOfPages(numOfPages);
        setNextPage(nextPage);
        setPrevPage(prevPage);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [dispatch, currentParam, page, limit]);

  useEffect(() => {
    setLoading(loading);
    setErrorMsg(error);
  }, [loading, error]);

  // end toolkit get one section articles

  // paginate

  const paginate = ({ selected }) => {
    setPage(selected + 1);
  };
  // const [DividePosts, setDividePosts] = useState([]);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [postsPerPage] = useState(3);

  // // ...

  // let indexOfLastPost = currentPage * postsPerPage;
  // let indexOfFirstPost = indexOfLastPost - postsPerPage;
  // let currentPosts = oneSection.slice(indexOfFirstPost, indexOfLastPost);

  // end of paginate

  return (
    <div className={`${styles.background}`}>
      <div
        className={`${styles.errorback} ${
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
        {loading !== false && error === "" ? <div>loading...</div> : null}
      </div>
      <div>
        {oneSection.length === 0 && !loading && !error ? (
          <div
            className={`${styles.errorback} ${
              oneSection.length === 0 && !loading && !error
                ? " d-flex justify-content-center align-items-center "
                : "d-none"
            } `}
          >
            No Posts To Show.
          </div>
        ) : null}
      </div>

      <div className="blog-content-section">
        {
          <Post
            // posthandler={currentPosts}
            allposts={posts}
            className={error && loading !== true ? "d-none" : "d-block"}
          />
        }
        <div className="pagination">
          <ReactPaginate
            onPageChange={paginate}
            pageCount={numOfPages}
            previousLabel={"Prev"}
            nextLabel={"Next"}
            containerClassName={"pagination pagination"}
            pageLinkClassName={"page-link  rounded-pill page-number"}
            previousLinkClassName={
              "page-link page-link-next rounded-pill page-number"
            }
            nextLinkClassName={
              "page-link page-link-next rounded-pill page-number"
            }
            activeLinkClassName={"page-link active"}
            onClick={() => toTop()}
          />
        </div>
      </div>
    </div>
  );
}

export default Posts;
