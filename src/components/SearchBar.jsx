import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux/es/exports";
import search from "../store/slices/search";
import { getSearched } from "../store/slices/search";
import styles from "./cssmodules/searchbar.module.css";
import { Form } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

function SearchBar() {
  const [term, setTerm] = useState("");
  const searcheHandler = (e) => {
    setTerm(e.target.value);
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const searchButton = (e) => {
    e.preventDefault();

    navigate("/all-articles");
    dispatch(getSearched({ term }))
      .unwrap()
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <div className={`${styles.searchContainer} me-2 p-0 rounded`}>
      <div
        className={` ${styles.searchSize} d-flex  rounded justify-content-md-center align-items-md-center me-3 mb-2`}
      >
        <input
          type="search"
          placeholder="البحث"
          className={` ${styles.searchSize} rounded search-style border border-black border-right`}
          aria-label="Search"
          onChange={(e) => searcheHandler(e)}
        />
        <button
          type="button "
          className={` ${styles.searchIcon} rounded m-0  btn border border-black border-right btn-warning`}
          onClick={(e) => searchButton(e)}
        >
          <FaSearch className="text-black-50" />
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
