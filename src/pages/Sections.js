import React from "react";
import Sections from "../components/Sections";

import { useOutletContext } from "react-router-dom";
const Home = () => {
  const Translate = useOutletContext();
  return (
    <>
      <Sections />
    </>
  );
};

export default Home;
