import { React, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../components/cssmodules/Login.module.css";
function UsersRoot() {
  const [accessToken, setAccessToken] = useState("");
  const token = sessionStorage.getItem("accessToken");

  useEffect(() => {
    if (token !== "") {
      setAccessToken(token);
    }
  }, [token]);

  return (
    <div className={"Marhey"}>
      <Navbar accessToken={accessToken} />
      <Outlet context={accessToken} />
      <Footer />
    </div>
  );
}

export default UsersRoot;
