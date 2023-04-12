import React from "react";
import styles from "../components/cssmodules/PostsView.module.css";
import { Link } from "react-router-dom";
function WithGuard({ children }) {
  const accessToken = sessionStorage.getItem("accessToken");
  return accessToken ? (
    <div>{children}</div>
  ) : (
    <div className={` ${styles.background} d-flex  flex-column `}>
      <p
        className={`d-flex justify-content-center flex-column align-items-center text-center ${styles.errorback}`}
      >
        please login first
        <Link
          to={`/users/login/`}
          className="text-none  textDecorationNone mt-2 text-white-50"
        >
          <button type="button" className="btn btn-primary ">
            login
          </button>
        </Link>
      </p>
    </div>
  );
}

export default WithGuard;
