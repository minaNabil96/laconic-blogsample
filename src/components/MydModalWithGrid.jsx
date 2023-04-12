import React, { useState, useEffect } from "react";
import styles from "./cssmodules/Login.module.css";
import {
  closeModal,
  modalMessage,
  modalStatus,
  modalType,
  showModal,
} from "../store/uiSlices/modalSlice";
import { closeBigModal } from "../store/uiSlices/bigModalSlice";
import {
  AdminGetUserArticles,
  clearUserArticles,
} from "../store/slices/userIf";
import { useSelector, useDispatch } from "react-redux/es/exports";
import LoginModal from "./LoginModal";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";
import DropdownButton from "react-bootstrap/esm/DropdownButton";
import axios from "axios";
import {
  addSection,
  editSection,
  retrieveSection,
} from "../store/slices/adminSlice";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import { publishSpin } from "../store/uiSlices/addPostSlice";
let tryAddSection = addSection;
function MydModalWithGrid(props) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [arabicname, setArabicName] = useState("");
  const [userArabicName, setUserArabicName] = useState("");
  const [articlesNum, setArticlesNum] = useState("");
  const [userFullDataFromForm, setUserFullDataFromForm] = useState([]);
  const [articles, setArticles] = useState([]);
  const [invisibleArticles, setInvisibleArticles] = useState([]);
  const [author, setAuthor] = useState("");
  const [fileUrlToShow, setFileUrlToShow] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [message, setMessage] = useState("");
  const { fulledituserdata: editUserData, clearinputs } = props;

  const navigate = useNavigate();
  // toolkit
  const dispatch = useDispatch();
  const { modalName } = useSelector((state) => state.modalSlice);
  const { bigModalName, bigModalStatus, bigModalPayload } = useSelector(
    (state) => state.bigModalSlice
  );
  const { userArticles } = useSelector((state) => state.userIf);
  const { publishL } = useSelector((state) => state.addPostSlice);
  const { loading, error } = useSelector((state) => state.sections);

  useEffect(() => {
    if (clearinputs === "true") {
      dispatch(clearUserArticles());

      setAuthor("");
      setUserName("");
      setPassword("");
      setArabicName("");
      setUserFullDataFromForm([]);
    }
  }, [clearinputs, dispatch]);

  useEffect(() => {
    if (userArticles) {
      const { posts, invisiblePosts } = userArticles;
      setArticles(posts);
      if (invisiblePosts) {
        setInvisibleArticles(invisiblePosts);
      }
    }
  }, [userArticles]);

  useEffect(() => {
    if (articles && articles.length !== 0) {
      const [{ author }] = articles;
      setAuthor(author.arabicname);
    }
  }, [articles]);

  const myArticlesMap =
    articles && articles.length !== 0 ? (
      articles.map(({ title, _id, author }) => (
        <div className={`${styles.menuItem} h-100 rounded`} key={_id}>
          <Link
            to={`/users/my-articles/editable/${_id}`}
            className="text-none  textDecorationNone overFlowScroll text-black-50"
            onClick={() => dispatch(closeBigModal())}
          >
            <p className="text-center m-1 b-1">
              {" "}
              {title && [...title].length >= 40 ? title.slice(0, 40) : title}
            </p>
          </Link>
        </div>
      ))
    ) : (
      <div className="d-flex justify-content-center align-items-center">
        <p className="text-warning">لا توجد مقالات</p>
      </div>
    );

  const userNameHandler = (e) => {
    setUserName(e.target.value.trim());
  };
  const userPasswordHandler = (e) => {
    setPassword(e.target.value.trim());
  };
  const userArabicNameHandler = (e) => {
    setArabicName(e.target.value.trim());
  };
  const isOk = (e) => {
    e.preventDefault();
    if (!username && !password && !arabicname) {
      dispatch(showModal());
      dispatch(modalType(bigModalPayload.modalName));
      dispatch(modalStatus(true));
      dispatch(
        modalMessage({
          status: `please enter the data you want to change`,
          color: "info",
        })
      );
      setTimeout(() => {
        dispatch(closeModal());
      }, 1500);
    } else {
      dispatch(modalType(bigModalPayload.modalName));
      dispatch(modalStatus(true));
      dispatch(
        modalMessage({
          status: `are you sure you want to edit ${bigModalPayload.username}'s data ? `,
          color: "danger",
        })
      );

      const dataObject = { username, password, arabicname };
      const { _id: userIdFromForm } = bigModalPayload;
      let userConverted = {};

      const filterdData = Object.entries(dataObject).filter(
        ([, value]) => value !== ""
      );
      const convertFilterd = Object.fromEntries(filterdData);
      if (convertFilterd) {
        userConverted = convertFilterd;
      }

      setUserFullDataFromForm([
        userConverted,
        {
          userIdFromForm,
        },
      ]);
    }
  };

  // start add section

  const sectionImg = async (e) => {
    e.preventDefault();

    const file = e.target.files[0];
    setSelectedImage(file);
    const fileUrlToShowa = URL.createObjectURL(file);
    setFileUrlToShow(fileUrlToShowa);
  };

  const addSection = async (e) => {
    const url = "https://api.cloudinary.com/v1_1/minatry/image/upload";
    dispatch(publishSpin());

    if (selectedImage && username && password) {
      const formData = new FormData();
      formData.append("file", selectedImage);
      formData.append("upload_preset", "y14e5jtr");
      formData.append("cloud_name", "minatry");

      const req = await axios.post(url, formData, {
        withCredentials: false,
      });

      const data = await req.data;
      if (data) {
        console.log(data);
        const { secure_url } = data;
        if (secure_url) {
          const section = {
            sectionName: username,
            desc: password,
            image: secure_url,
          };
          dispatch(tryAddSection(section))
            .unwrap()
            .then((res) => {
              console.log(res);
              const { status } = res;
              setMessage(status);
              setTimeout(() => {
                dispatch(publishSpin());

                setMessage("");
                navigate("/sections");
                dispatch(closeBigModal());
              }, 5000);
            })
            .catch((err) => {
              setMessage(err.message);
              console.log(err.message);
              dispatch(publishSpin());
            });
        }
      }
    } else {
      setMessage("please complete the section details");
      dispatch(publishSpin());

      setTimeout(() => {
        setMessage("");
      }, 2000);
    }
  };

  // start edit section
  const editSictionF = async (e) => {
    e.preventDefault();

    const url = "https://api.cloudinary.com/v1_1/minatry/image/upload";
    dispatch(publishSpin());
    if (!selectedImage && !username && !password) {
      setMessage("please enter what you want to change");
      dispatch(publishSpin());

      setTimeout(() => {
        setMessage("");
      }, 2000);
    }

    if (selectedImage) {
      const formData = new FormData();
      formData.append("file", selectedImage);
      formData.append("upload_preset", "y14e5jtr");
      formData.append("cloud_name", "minatry");
      formData.append("folder", "blog1");

      const req = await axios.post(url, formData, {
        withCredentials: false,
      });

      const data = await req.data;
      if (data) {
        const { secure_url } = data;
        if (secure_url) {
          let obj = {
            sectionName: username,
            desc: password,
            image: secure_url,
          };
          let obj2 = Object.entries(obj).filter(([_, v]) => v !== "");
          let obj3 = Object.fromEntries(obj2);
          let finalObj = { ...obj3 };
          finalObj.sectionId = bigModalPayload._id;

          dispatch(editSection(finalObj))
            .unwrap()
            .then((res) => {
              console.log(res);
              const { status } = res;
              setMessage(status);
              setTimeout(() => {
                dispatch(publishSpin());

                setMessage("");
                navigate("/sections");
                dispatch(closeBigModal());
              }, 5000);
            })
            .catch((err) => {
              setMessage(err.message);
              console.log(err.message);
              dispatch(publishSpin());
            });
        }
      }
    } else {
      let obj = { sectionName: username, desc: password };
      let obj2 = Object.entries(obj).filter(([_, v]) => v !== "");
      let obj3 = Object.fromEntries(obj2);
      let finalObj = { ...obj3 };
      finalObj.sectionId = bigModalPayload._id;
      dispatch(editSection(finalObj))
        .unwrap()
        .then((res) => {
          const { status } = res;
          setMessage(status);
          setTimeout(() => {
            dispatch(publishSpin());

            setMessage("");
            navigate("/sections");
            dispatch(closeBigModal());
          }, 5000);
        })
        .catch((err) => {
          setMessage(err.message);
          console.log(err.message);
          dispatch(publishSpin());
        });
    }
  };

  const retrieve = (e) => {
    e.preventDefault();
    dispatch(publishSpin());
    dispatch(retrieveSection(bigModalPayload))
      .unwrap()
      .then((res) => {
        const { status } = res;
        console.log(` status = ${status}`);

        if (status === "success deleted") {
          setMessage(status);

          setTimeout(() => {
            dispatch(publishSpin());

            dispatch(closeModal());
            navigate(`/sections`);
            dispatch(closeBigModal());
          }, 3000);
        } else {
          dispatch(publishSpin());

          setMessage(status);

          setTimeout(() => {
            dispatch(closeModal());
            dispatch(closeBigModal());

            navigate(`/sections`);
          }, 3000);
        }
      })
      .catch((err) => {
        console.log(err.message);
        dispatch(publishSpin());
      });
  };

  const cases =
    bigModalPayload && bigModalName === "editUserForm"
      ? `edit ${bigModalPayload.username}'s data`
      : bigModalPayload && bigModalName === "showUserData"
      ? `${bigModalPayload.username}'s info`
      : bigModalName === "addSection"
      ? `add section`
      : bigModalName === "sectionInfo"
      ? `section's info`
      : bigModalName === "sectionEdit"
      ? `edit ${" "} ${bigModalPayload.sectionName}`
      : "unknowModalName";

  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      show={bigModalStatus}
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">{cases}</Modal.Title>
      </Modal.Header>
      <Modal.Body className={` ${styles.form_background} ${styles.size} `}>
        <form
          className={`${
            bigModalName === "editUserForm" ? "d-block" : "d-none"
          }`}
        >
          <div>
            <label
              htmlFor={`123User-Name`}
              className="visually text-success text-bold  ms-2 mb-2 mt-2"
            >
              change username
            </label>
            <input
              type="text"
              autoComplete={`true`}
              placeholder="UserName"
              className={` m-1 form-control rounded`}
              id={`123User-Name`}
              onChange={(e) => userNameHandler(e)}
            ></input>
          </div>
          <div>
            <label
              htmlFor="inputPassword2"
              className="visually text-success text-bold  ms-2 mb-2 mt-2"
            >
              change password
            </label>
            <input
              type="password"
              autoComplete="true"
              className={`m-1 form-control rounded`}
              id="inputPassword2"
              placeholder="Password"
              onChange={(e) => userPasswordHandler(e)}
              onKeyDown={(e) => (e.key === "Enter" ? isOk(e) : "")}
            ></input>
          </div>
          <div>
            <label
              htmlFor="inputArabicName2"
              className="visually text-success text-bold  ms-2 mb-2 mt-2"
            >
              change arabic name
            </label>
            <input
              type="text"
              autoComplete="true"
              className={`m-1 form-control rounded`}
              id="inputArabicName2"
              placeholder="ArabicName"
              onChange={(e) => userArabicNameHandler(e)}
              onKeyDown={(e) => (e.key === "Enter" ? isOk(e) : "")}
            ></input>
          </div>
          <LoginModal userfulldatafromform={userFullDataFromForm} />
        </form>
        {/* end user info form*/}
        {/* start add section form */}
        <div
          className={`${
            bigModalName === `sectionEdit` &&
            bigModalPayload.sectionVisibality === false
              ? "d-block"
              : "d-none"
          } d-flex justify-content-center align-items-center my-4 text-primary `}
        >
          {`القسم مخفي`}
        </div>
        <form
          className={` ${
            bigModalName === `addSection` ||
            (bigModalName === `sectionEdit` &&
              bigModalPayload.sectionVisibality === true)
              ? "d-block"
              : "d-none"
          } `}
        >
          <div>
            <label
              htmlFor="SectionName"
              className="visually text-success text-bold  ms-2 mb-2 mt-2"
            >
              Section Name
            </label>
            <input
              type="text"
              autoComplete="true"
              placeholder="Section Name"
              className={` m-1 form-control rounded`}
              id="SectionName"
              onChange={(e) => userNameHandler(e)}
            ></input>
          </div>
          <div>
            <label
              htmlFor="AboutSection"
              className="visually text-success text-bold  ms-2 mb-2 mt-2"
            >
              About Section
            </label>
            <input
              type="text"
              autoComplete="true"
              className={`m-1 form-control rounded`}
              id="AboutSection"
              placeholder="About Section"
              onChange={(e) => userPasswordHandler(e)}
            ></input>
          </div>
          <div>
            <label
              htmlFor="SectionImage"
              className="visually text-success text-bold  ms-2 mb-2 mt-2"
            >
              Section Image
            </label>
            <input
              type="file"
              autoComplete="true"
              className={`m-1 form-control rounded`}
              id="SectionImage"
              placeholder="Section Image"
              onChange={(e) => sectionImg(e)}
            ></input>
            <div
              className={` ${styles.addSectionImage} ${
                fileUrlToShow ? "d-block" : "d-none"
              } m-auto d-flex justify-content-center align-items-center my-4`}
            >
              <img
                className={`${styles.addSectionImage} ${
                  fileUrlToShow ? "d-block" : "d-none"
                } `}
                src={fileUrlToShow}
                alt="img"
              />
            </div>
          </div>
        </form>
        {/* end add section form */}
        {/* start user's info */}
        <div
          className={`container ${
            bigModalName === "showUserData" ? "d-block" : "d-none"
          } `}
        >
          <div className="row d-flex justify-content-center align-items-center">
            <aside className={`${styles.myarticles_aside} rounded  col-12  `}>
              <p className={`text-end text-primary mt-5 mb-5 arabicDirection`}>
                <span className="text-black ms-2 arabicDirection">
                  {" "}
                  الاسم :{" "}
                </span>
                {`${
                  bigModalPayload.arabicname ? bigModalPayload.arabicname : " "
                }`}
              </p>
              <div className="d-flex justify-content-between align-items-center flex-row-reverse">
                <p
                  className={`text-end text-primary mt-3 mb-3 arabicDirection`}
                >
                  <span className="text-black ms-2 arabicDirection">
                    إجمالي عدد المقالات :
                  </span>
                  {`${articles ? articles.length : "0"}`}
                </p>
                <p
                  className={`text-end text-primary mt-3 mb-3 arabicDirection`}
                >
                  <span className="text-black ms-2 arabicDirection">
                    المقالات المخفية :
                  </span>
                  {`${invisibleArticles ? invisibleArticles.length : "0"}`}
                </p>
              </div>
              <div
                className={`d-flex justify-content-around align-items-center`}
              >
                <DropdownButton
                  className={`text-start ms-2 text-light mt-5 mb-5 `}
                  id="dropdown-basic-button"
                  title={` جميع مقالات ${bigModalPayload.arabicname}`}
                >
                  {myArticlesMap ? myArticlesMap : "لا توجد مقالات"}
                </DropdownButton>
              </div>
            </aside>
          </div>
        </div>
        {/* end user's info */}
        <div
          className={`container ${
            bigModalName === "sectionInfo" ? "d-block" : "d-none"
          } `}
        >
          <div className="row d-flex justify-content-center align-items-center">
            <aside className={`${styles.myarticles_aside} rounded  col-12  `}>
              <p className={`text-end text-primary mt-5 mb-5 arabicDirection`}>
                <span className="text-black ms-2 arabicDirection">
                  {" "}
                  تاريخ الإنشاء :{" "}
                </span>
                {`${
                  bigModalPayload.date ? bigModalPayload.date.slice(0, 7) : " "
                }`}
              </p>
              <div className="d-flex justify-content-between align-items-center flex-row-reverse">
                <p
                  className={`text-end text-primary mt-3 mb-3 arabicDirection`}
                >
                  <span className="text-black ms-2 arabicDirection">
                    إجمالي عدد المقالات :
                  </span>
                  {`${
                    bigModalPayload.sectionsDetails
                      ? bigModalPayload.sectionsDetails
                      : "0"
                  }`}
                </p>
              </div>
            </aside>
          </div>
        </div>
        <div
          className={`${
            message ? "d-block" : "d-none"
          } d-flex justify-content-center align-items-center my-4 text-primary `}
        >
          {message ? message : ""}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex w-100 justify-content-between align-items-center">
          <button
            type="button"
            className={`btn btn-warning  ${
              bigModalName === "editUserForm" ? "d-block" : "d-none"
            } d-flex justify-content-center align-items-center `}
            onClick={(e) => isOk(e)}
          >
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className={`${publishL ? "d-block" : "d-none"} pt-2 me-2`}
            ></Spinner>
            ok edit this user
          </button>

          <button
            type="button"
            className={`btn btn-success d-flex justify-content-center align-items-center ${
              bigModalName === "addSection" ? "d-block" : "d-none"
            } `}
            onClick={(e) => addSection(e)}
          >
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className={`${publishL ? "d-block" : "d-none"} pt-2 me-2`}
            />
            <span className="">add</span>
          </button>
          <button
            type="button"
            className={`btn btn-success d-flex justify-content-center align-items-center ${
              bigModalName === "sectionEdit" &&
              bigModalPayload.sectionVisibality === true
                ? "d-block"
                : "d-none"
            } `}
            onClick={(e) => editSictionF(e)}
          >
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className={`${publishL ? "d-block" : "d-none"} pt-2 me-2`}
            />
            <span className="">ok edit</span>
          </button>
          <button
            type="button"
            className={`btn btn-success d-flex justify-content-center align-items-center ${
              bigModalName === "sectionEdit" &&
              bigModalPayload.sectionVisibality === false
                ? "d-block"
                : "d-none"
            } `}
            onClick={(e) => retrieve(e)}
          >
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className={` ${publishL ? "d-block" : "d-none"} pt-2 me-2 `}
            />
            <span className="">retrieve ?</span>
          </button>

          <Button onClick={props.onHide}>Close</Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default MydModalWithGrid;
