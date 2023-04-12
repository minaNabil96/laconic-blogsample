import React from "react";
import styles from "../components/cssmodules/PostsView.module.css";
import { Link } from "react-router-dom";
function WithGuardAdmin({ children }) {
  const admin = sessionStorage.getItem("admin");
  return admin === "true" ? (
    <div className={` ${styles.background}`}>{children}</div>
  ) : (
    <div className={` ${styles.background} d-flex  flex-column `}>
      <p
        className={`d-flex justify-content-center flex-column align-items-center text-center ${styles.errorback}`}
      >
        can't access, acces is denied
        <Link
          to={`/`}
          className="text-none  textDecorationNone mt-2 text-white-50"
        >
          <button type="button" className="btn btn-primary ">
            home page
          </button>
        </Link>
      </p>
    </div>
  );
}

export default WithGuardAdmin;
