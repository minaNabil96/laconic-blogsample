import React from "react";
import styles from "../components/cssmodules/homelanding.module.css";
import Landing from "../components/Landing";

import { useOutletContext } from "react-router-dom";
const Home = () => {
  const Translate = useOutletContext();
  return (
    <>
      <div className={`${styles.background}`}>
        <Landing />
      </div>
      {/* <Features Translate={Translate} />
      <Ourwork Translate={Translate} /> */}
    </>
  );
};

export default Home;
