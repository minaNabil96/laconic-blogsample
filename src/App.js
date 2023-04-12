import { useState } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  // translation
  const [finalTranslate, setfinalTranslate] = useState(false);
  const translationHandler = (Translate) => {
    setfinalTranslate(Translate);
  };

  return (
    <div className={`Marhey`}>
      <Navbar Translation={translationHandler} />
      <Outlet context={finalTranslate} />
      <Footer Translate={finalTranslate} />
    </div>
  );
}

export default App;
