import React from "react";
import styles from "./cssmodules/homelanding.module.css";
function Error404() {
  return (
    <div
      className={`${styles.error404background} d-flex justify-content-center align-items-center  `}
    >
      <div
        className={`${styles.error404} d-flex justify-content-center align-items-center flex-column `}
      >
        <span className="text-center fs-1">oOPS! ...</span>
        <span className="text-start fs-1">Page Not Found</span>
      </div>
    </div>
  );
}

export default Error404;
