import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./cssmodules/Login.module.css";
import LoginModal from "./LoginModal";
import auth from "../store/slices/auth";
import { login } from "../store/slices/auth";
import { useSelector, useDispatch } from "react-redux";
import {
  showModal,
  modalStatus,
  modalMessage,
  closeModal,
} from "../store/uiSlices/modalSlice";

const Login = ({ Translate }) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState(false);
  const [loginMsg, setLoginMsg] = useState("");
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  const dateNow = new Date();
  axios.defaults.withCredentials = true;

  // start toolkit login
  const dispatch = useDispatch();
  const { loading, error, username, accessToken, status } = useSelector(
    (state) => state.auth
  );

  const user = {
    username: userName,
    password: password,
    date: dateNow,
  };
  // end toolkit login

  const Login = (e) => {
    e.preventDefault();
    dispatch(showModal());
    if (e.key === "Enter" || !e.key) {
      if (!userName || !password) {
        dispatch(modalStatus(true));
        dispatch(
          modalMessage({
            status: "please enter your login info",
            color: "info",
          })
        );
        setTimeout(() => {
          dispatch(modalStatus(false));
          dispatch(closeModal());
        }, 1000);

        // setTimeout(() => {
        //   setLoginStatus(false);

        // }, 2000);
      } else {
        dispatch(login(user))
          .unwrap()
          .then((login) => {
            const { status, accessToken, admin, isSuper, username } = login;

            if (accessToken || status === "matched") {
              dispatch(modalStatus(true));
              dispatch(
                modalMessage({
                  status: `welcome :   ${username}`,
                  color: "success",
                })
              );
              sessionStorage.setItem("accessToken", accessToken);
              sessionStorage.setItem("username", username);
              sessionStorage.setItem("admin", admin);
              sessionStorage.setItem("isSuper", isSuper);
              setTimeout(() => {
                dispatch(modalStatus(false));
                dispatch(closeModal());
                if (isSuper === true && admin === false) {
                  navigate("/users/userif");
                } else if (admin === true) {
                  navigate("/users/adminif");
                }
              }, 2000);
              //
              // setTimeout(() => {
              //   navigate("/users/userif");
              // }, 1500);
            } else if (!accessToken || !username || status !== "matched") {
              sessionStorage.clear();
              dispatch(modalStatus(true));
              dispatch(modalMessage({ status, color: "danger" }));
              setTimeout(() => {
                dispatch(modalStatus(false));
                dispatch(closeModal());
              }, 1000);
              // setTimeout(() => {
              //   setLoginStatus(false);
              //   dispatch(closeModal());
              // }, 2000);
            }
          })
          .catch((error) => {
            dispatch(modalStatus(true));
            dispatch(modalMessage({ status: "error", color: "danger" }));
            setTimeout(() => {
              dispatch(modalStatus(false));
            }, 1000);
            setTimeout(() => {
              setLoginStatus(false);
              dispatch(closeModal());
            }, 2000);
          });
      }
    }
  };

  let token = sessionStorage.getItem("accessToken");

  useEffect(() => {
    token ? setLoggedIn(true) : setLoggedIn(false);
  }, [token]);

  const userNameHandler = (e) => {
    setUserName(e.target.value.trim());
  };
  const userPasswordHandler = (e) => {
    setPassword(e.target.value.trim());
  };
  return (
    <div
      className={` ${styles.loginback} slide-show  d-flex align-items-center justify-content-center`}
    >
      <div className=" d-flex flex-column position-relative mt-5">
        <div className="row mt-5 w-100">
          <div className="slideshow-text-container text-center col-12">
            {loggedIn ? (
              <h3 className={`text-warning bold`}> already loggedIn </h3>
            ) : (
              <div className="ms-4">
                <form
                  className={`${styles.login_form_size} ${styles.form_background}  my-3 bg-gradient rounded `}
                >
                  <div
                    className={`d-flex flex-column align-items-center justify-content-around my-2 mx-5`}
                  >
                    <LoginModal loginStatus={loginStatus} loginMsg={loginMsg} />
                    <label
                      htmlFor="username"
                      className="visually me-auto m-2 mt-5 text-info"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      autoComplete="true"
                      placeholder="username"
                      className={`${styles.login_inputs_size} form-control rounded mx-4 my-2`}
                      id="username"
                      onChange={(e) => userNameHandler(e)}
                    ></input>
                  </div>
                  <div
                    className={`d-flex flex-column align-items-center justify-content-around my-2 mx-5`}
                  >
                    <label
                      htmlFor="inputPassword2"
                      className="visually me-auto m-2 text-info"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      autoComplete="true"
                      className={`${styles.login_inputs_size} form-control rounded mx-4 my-2`}
                      id="inputPassword2"
                      placeholder="Password"
                      onChange={(e) => userPasswordHandler(e)}
                      onKeyDown={(e) => (e.key === "Enter" ? Login(e) : "")}
                    ></input>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="btn btn-info mb-3 mt-2"
                      onClick={(e) => Login(e)}
                    >
                      Login
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
