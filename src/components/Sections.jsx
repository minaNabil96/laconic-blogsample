import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import sections from "../store/slices/sections";
import { getAllSections } from "../store/slices/sections";
import styles from "./cssmodules/sections.module.css";
import { Link } from "react-router-dom";
const Features = ({ Translate }) => {
  const { sections, loading, error } = useSelector((state) => state.sections);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllSections());
  }, [dispatch]);
  console.log(error);
  const sectionsMap =
    sections &&
    sections.map(({ sectionName, _id, image }, idx) => (
      <div className="col-12 col-md-6 col-lg-4 pt-5 mt-5 mb-3" key={_id}>
        <div className="features-box features-box-active text-center mt-4 mb-4">
          <Link
            to={`/sections/${_id}`}
            className="textDecorationNone text-light"
          >
            <h4 className="mb-3">{sectionName}</h4>
            <img
              className={`${
                idx === 1 || idx === 2
                  ? ` ${styles.sections_img2}`
                  : `${styles.sections_img} `
              } rounded`}
              src={image}
              alt="img"
            ></img>
          </Link>
        </div>
      </div>
    ));

  return (
    <div className={`${styles.background} `}>
      <div className="container">
        {error ? (
          <div
            className={`${styles.errorback}  "d-block d-flex justify-content-center align-items-center " }`}
          >
            {error ? error : ""}
          </div>
        ) : loading ? (
          <div
            className={`${styles.errorback}  "d-block d-flex justify-content-center align-items-center " }`}
          >
            {loading ? loading : ""}
          </div>
        ) : sections && sections.length === 0 && !loading && !error ? (
          <div
            className={`${styles.errorback}  "d-block d-flex justify-content-center align-items-center " }`}
          >
            {`there's no sections`}
          </div>
        ) : (
          <div className="row ">{sectionsMap}</div>
        )}
      </div>
    </div>
  );
};

export default Features;
