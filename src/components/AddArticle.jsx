import React from "react";
import { useSelector } from "react-redux";
import styles from "./cssmodules/Article.module.css";
import Tiptap2 from "./Tiptap2";

function AddPost() {
  const { title, imageView } = useSelector((state) => state.addPostSlice);

  return (
    <div className={`${styles.background} pt-5 `}>
      <section className={`container pt-5`}>
        <div
          className={`text-end position-relative rounded pt-5 mt-5 ${styles.articleStyle} `}
        >
          <div className="div pt-5">
            <h2
              className={` ${styles.articleMargin} mt-5 end-0 bottom-50 position-absolute  me-3 text-center text-warning text-sm-end mb-3 mt-5 pt-5`}
            >
              {title
                ? [...title].length >= 150
                  ? title.slice(0, 150)
                  : title
                : "no title"}
            </h2>
          </div>
        </div>
        <hr className="text-warning" />
        <div
          className={`text-center img-fluid ${styles.backgroundArticle} rounded`}
        >
          <img
            className={` mb-2 ${styles.imgWands} `}
            src={imageView ? imageView : "image"}
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
            <Tiptap2 />
          </div>
        </div>
        <br />
      </section>
    </div>
  );
}

export default AddPost;
