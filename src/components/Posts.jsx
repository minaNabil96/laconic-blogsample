import React, { useState, useEffect } from "react";
import axios from "axios";
import Post from "./Post";
import styles from "../components/cssmodules/PostsView.module.css";
import { useDispatch, useSelector } from "react-redux";
import articles, { getAllArticles } from "../store/slices/articles";
import search from "../store/slices/search";
import { getSearched } from "../store/slices/search";
import ReactPaginate from "react-paginate";
function Posts() {
  // paginataion
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3);
  const [posts, setposts] = useState([]);
  const [numOfPages, setNumOfPages] = useState(0);
  const [numOfDocuments, setNumOfDocuments] = useState(0);
  const [nextPage, setNextPage] = useState("");
  const [prevPage, setPrevPage] = useState(1);
  const [searchedData, setSearchedData] = useState([]);
  const [errorMsg, seterrorMsg] = useState("");
  const [Looding, setLooding] = useState(false);
  const [searchStatus, setSearchStatus] = useState("");
  // end pagination

  // redux toolkit

  const dispatch = useDispatch();
  const { loading, error, articles } = useSelector((state) => state.articles);
  const {
    loading: loading2,
    error: error2,
    articles: searched,
  } = useSelector((state) => state.search);

  const { status, search } = searchedData;
  useEffect(() => {
    dispatch(getAllArticles({ page, limit }))
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
  }, [dispatch, page, limit]);

  // end-redux toolkit

  useEffect(() => {
    setSearchedData(searched);
    setSearchStatus(status);

    if (loading || error) {
      setLooding(loading);
      seterrorMsg(error);
    } else if (loading2 || error2) {
      setLooding(loading2);
      seterrorMsg(error2);
    }
  }, [loading, error, loading2, error2, searched, status]);

  const toTop = () => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 1200);
  };

  // paginate

  const paginate = ({ selected }) => {
    setPage(selected + 1);
  };
  const [DividePosts, setDividePosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(3);

  // ...

  // let indexOfLastPost = currentPage * postsPerPage;
  // let indexOfFirstPost = indexOfLastPost - postsPerPage;
  // let currentPosts = posts && posts.slice(indexOfFirstPost, indexOfLastPost);

  // end of paginate
  return (
    <div className={`${styles.background}`}>
      <div
        className={`${styles.errorback} ${
          errorMsg && !loading
            ? "d-block d-flex justify-content-center align-items-center "
            : posts
            ? "d-none"
            : "d-none"
        }`}
      >
        {errorMsg && !loading ? errorMsg : null}
      </div>
      <div
        className={`${styles.errorback} ${
          searchStatus && searchStatus.includes("no")
            ? "d-block d-flex justify-content-center align-items-center "
            : "d-none"
        }`}
      >
        {searchStatus && searchStatus.includes("no") ? searchStatus : null}
      </div>
      <div
        className={`${styles.errorback} ${
          loading && !errorMsg && posts.length === 0
            ? "d-block d-flex justify-content-center align-items-center "
            : "d-none"
        }`}
      >
        {loading && !errorMsg && posts.length === 0 ? (
          <div>loading...</div>
        ) : null}
      </div>
      <div>
        {posts.length === 0 && !loading && !errorMsg ? (
          <div
            className={`${styles.errorback} ${
              posts.length === 0 && loading !== true && errorMsg === ""
                ? " d-flex justify-content-center align-items-center "
                : "d-none"
            } `}
          >
            No Posts To Show.
          </div>
        ) : null}
      </div>

      <div
        className={`blog-content-section ${
          searchStatus && searchStatus.includes("no") ? "d-none" : "d-block"
        }`}
      >
        {
          <Post
            // posthandler={currentPosts}
            searchMsg={searchStatus}
            allposts={search ? search : posts}
            className={`${
              !errorMsg && loading !== true ? "d-block" : "d-none"
            }`}
          />
        }
        <div
          className={`pagination ${
            searchStatus && (searchStatus || errorMsg || posts.length === 0)
              ? "d-none"
              : "d-block"
          }`}
        >
          <ReactPaginate
            breakLabel="..."
            breakClassName="page-link rounded-pill page-number text-black"
            onPageChange={paginate}
            pageRangeDisplayed="2"
            pageCount={numOfPages}
            previousLabel={"Prev"}
            nextLabel={"Next"}
            containerClassName={"pagination  pagination"}
            pageLinkClassName={"page-link rounded-pill page-number"}
            previousLinkClassName={`  ${
              errorMsg || posts.length === 0 ? "d-none" : "d-block"
            } page-link  page-link-next rounded-pill page-number`}
            nextLinkClassName={` ${
              errorMsg || posts.length === 0 ? "d-none" : "d-block"
            } page-link page-link-next rounded-pill page-number`}
            activeLinkClassName={`  page-link active`}
            onClick={() => toTop()}
          />
        </div>
      </div>
    </div>
  );
}

export default Posts;
