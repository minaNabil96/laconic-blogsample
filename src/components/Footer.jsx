import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaSnapchat } from "react-icons/fa";
import { Link } from "react-router-dom";
import styles from ".//cssmodules/Footer.module.css";
// import logo from "../images/PicsArt_23-01-08_15-21-53-063.png";
const Footer = ({ Translate }) => {
  let logo = `https://res.cloudinary.com/minatry/image/upload/v1680476538/swwpontgwnog3yzuejgz.png`;
  const toTop = () => {
    window.scrollTo(0, 0);
  };

  const date = new Date();
  let year = date.getFullYear();

  return (
    <footer className={` ${styles.body} pt-5`}>
      <div className="container ">
        <div className="row text-center  text-lg-end">
          <div className="col-12 col-md-6 border d-flex align-items-center justify-content-center">
            <div className="info ">
              <div className="cobyright text-center pt-3">
                <Link to="/">
                  <img className="w-25 mb-5" src={logo} alt=""></img>
                </Link>
                <p className="text-dark user-select-none">
                  Created by{" "}
                  <span className="info-span user-select-none">Mina Nabil</span>
                  <br />
                  <span className="text-black-50 user-select-none">
                    all rights resaved &copy; {year}
                  </span>
                </p>
                <div className="cobyright-sign d-flex gap-3 user-select-none"></div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6  border">
            <h4 className="text-black pb-4 mt-5 mb-4 arabicDirection me-auto user-select-none">
              {Translate ? "Order Now" : "أطلب الآن"}
            </h4>
            <p className="text-black mt-3 mb-3 arabicDirection me-auto user-select-none">
              نموذج لمدونة كاملة بتصميم مميز responsive يتكيف مع جميع احجام
              وانواع الشاشات والموبايل , مع text editor متميز يتيح لك التحكم كما
              تريد في كتابة وتعديل المقالات ومشاهدة كيف ستبدو المقالة قبل نشرها
              , وبالمثل التعديل عليها كما تريد بعد ذلك و إعادة رفعها , يمكن
              اضافة اقسام والتعديل عليها بالاضافة الى نظام تسجيل دخول ولوحة تحكم
              خاصة بالأدمن فقط للتحكم في الأعضاء وصلاحياتهم واضافة الأقسام
              والتعديل عليها مع لوحة خاصة للكُتاب فقط والمزيد...
              <br />
              يمكن التعديل على اي شيء واضافة ما يتم طلبه.
              <br />
              <br /> للاستعلام و الشراء اضغط على التواصل
            </p>
            <Link to="/contact" className="text-decoration-none text-white">
              <button
                className="btn footer-btn rounded-pill d-inline w-50 mb-4 mt-4 text-light"
                onClick={() => toTop()}
              >
                {Translate ? "Contact" : "التواصل"}
              </button>
            </Link>

            <div className="social-icons text-center text-lg-end ">
              <ul className="list-unstyled  d-flex justify-content-center justify-content-lg-end gap-4">
                <li>
                  <a
                    href="https://www.facebook.com/login/"
                    className="text-primary"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fa-brands fa-facebook">
                      <FaFacebook />
                    </i>
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com/i/flow/login?input_flow_data=%7B%22requested_variant%22%3A%22eyJsYW5nIjoiYXIifQ%3D%3D%22%7D"
                    className="text-info"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fa-brands fa-twitter">
                      <FaTwitter />
                    </i>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/login/ar"
                    className="text-primary"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fa-brands fa-linkedin">
                      <FaLinkedin />
                    </i>
                  </a>
                </li>
                <li>
                  <a
                    href="https://accounts.snapchat.com/accounts/v2/login?continue=%2Faccounts%2Fwelcome"
                    className="text-warning"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fa-brands  fa-snapchat-square">
                      <FaSnapchat />
                    </i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
