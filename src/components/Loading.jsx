import React from "react";
import styles from "./cssmodules/PostsView.module.css";
import { Spinner } from "react-bootstrap";
function Loading() {
  return (
    <div
      className={` ${styles.errorback} ${styles.background} d-flex justify-content-center align-items-center `}
    >
      <Spinner
        as="span"
        animation="border"
        size="lg"
        role="status"
        aria-hidden="true"
        className={``}
      />
    </div>
  );
}

export default Loading;
