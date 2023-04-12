import React from "react";
import styles from "../components/cssmodules/PostsView.module.css";

import MyArticles from "./MyArticles";

function UserIF() {
  return (
    <div className={`${styles.background}`}>
      <MyArticles />
    </div>
  );
}

export default UserIF;
