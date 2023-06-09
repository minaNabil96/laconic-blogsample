import { useNavigate } from "react-router-dom";
import editArticle from "../store/slices/editArticle";
import { editArticleThunk } from "../store/slices/editArticle";
import { useSelector, useDispatch } from "react-redux";
import { EditorContent, objectIncludes, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import TextAlign from "@tiptap/extension-text-align";
import TextDirection from "tiptap-text-direction-extension";
import "./cssmodules/tiptapview.css";
import axios from "axios";
import useAxiosPost from "./useAxiosPost";
import Dropdown from "react-bootstrap/Dropdown";
import LoginModal from "./LoginModal";
import Spinner from "react-bootstrap/Spinner";
import addPostSlice from "../store/uiSlices/addPostSlice";
import {
  titlea,
  imagee,
  imagee2,
  publishSpin,
  clearState,
} from "../store/uiSlices/addPostSlice";
import modalSlice from "../store/uiSlices/modalSlice";
import {
  showModal,
  modalStatus,
  modalMessage,
  closeModal,
} from "../store/uiSlices/modalSlice";

// imports icons
import {
  FaBold,
  FaItalic,
  FaListUl,
  FaQuoteLeft,
  FaUndoAlt,
  FaRedoAlt,
} from "react-icons/fa";

// end of icons
const localhost = process.env.REACT_APP_LOCALHOST;
export default function ({ data, clicked }) {
  const location = useLocation();

  const editor = useEditor(
    {
      extensions: [
        StarterKit,

        TextDirection,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
      ],
      onCreate({ editor }) {
        editor.commands.setContent(data);
      },
    },
    [data]
  );

  if (!editor) {
    return null;
  }

  // if (!editor) {
  //   return null;
  // }

  // if (data) {
  //   editor.commands.setContent(data);
  // }

  // setTimeout(() => {
  //   editor.commands.setContent(data);
  // }, 3000);
  if (clicked === true) {
    editor.setEditable(true);
  } else {
    editor.setEditable(false);
  }
  // edite
  return (
    <>
      <div>
        {clicked ? <MenuBar editor={editor} /> : null}
        <EditorContent
          editor={editor}
          id={`editor`}
          className={`mt-3 mb-2 border-dark ${
            clicked !== true ? "border-none" : ""
          }`}
        />
      </div>
    </>
  );
}

//

export const MenuBar = ({ editor }) => {
  const param = useParams();
  const postId = param.id;

  const [uploadImg, setUploadImg] = useState("");
  const [selectedImg, setSelectedImg] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [clicked, setClicked] = useState();
  const [section, setSection] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [loginStatus, setLoginStatus] = useState(false);
  const [loginMsg, setLoginMsg] = useState("");

  // start edit toolkit
  const dispatch = useDispatch();
  const { loading, error, edited } = useSelector((state) => state.editArticle);
  const { isVisible } = useSelector((state) => state.oneArticle);
  const { imageUrl, publishL } = useSelector((state) => state.addPostSlice);
  const navigate = useNavigate();
  const {
    data: userData,
    errorMsg: errorMessage,
    Looding: loadingS,
  } = useAxiosPost(`${localhost}/users/info`);

  useEffect(() => {
    setUserInfo(userData);
  }, [userData]);

  const { username, _id: authorId } = userInfo;
  // end edit toolkit
  // // get all users
  // const tryUrl = "http://192.168.1.8:5000/users";
  // const { data, errorMsg, Looding } = useAxiosPost(tryUrl);

  // get all sections
  const tryUrl2 = `${localhost}/sections`;
  const { data: sections, errorMsg: errormsg, Looding } = useAxiosPost(tryUrl2);

  const allSectionsMap = sections.map(({ sectionName, _id }) => (
    <option key={_id} value={sectionName}>
      {sectionName}
    </option>
  ));

  // const allUsersMap = data.map(({ username, _id }) => (
  //   <option key={_id} value={username}>
  //     {username}
  //   </option>
  // ));

  // // author and sections handlers
  // const authorHandler = (e) => {
  //   const clickedName = e.target.value;
  //   const identicalUser = data.filter(
  //     ({ username }) => username === clickedName
  //   );
  //   const identicalId = identicalUser[0]._id;
  //   identicalId ? setAuthor(identicalId) : setAuthor("");
  // };

  const sectionsHandler = (e) => {
    const clickedSection = e.target.value;

    const identicalSection = sections.filter(
      ({ sectionName }) => sectionName === clickedSection
    );
    let identicalId = identicalSection[0]._id;
    if (identicalId) {
      identicalId ? setSection([...section, identicalId]) : setSection("");
    }
  };
  // filter to get selected names of sections wich identical to selected from section state array
  const filterName = section
    ? sections.filter(({ _id }) => section.includes(_id))
    : "";

  const selectedSectionName = filterName
    ? filterName.map(({ _id, sectionName }) => sectionName)
    : "";
  if (!editor) {
    return null;
  }
  const convertedData = editor.getJSON();
  const plainText = editor.view.dom.innerText;
  let dateNow = new Date();

  const textdir = () => {
    editor.commands.setTextDirection("rtl"); //arguments: 'ltr'|'rtl'|'auto'
  };

  const clearSectionsNames = (e) => {
    e.preventDefault();
    setSection([]);
  };
  // new tiptap 2
  const imgHandler = (e) => {
    const img = e.target.files[0];
    let regex = /[^\s]+(.*?).(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/;

    const selected = URL.createObjectURL(img);
    const matched = img.name.match(regex);

    if (matched) {
      setSelectedImg(img);
      dispatch(imagee2(selected));
    } else console.log("please select valid image");
  };

  const titleHandler = (e) => {
    setTitle(e.target.value);
    setTimeout(() => {
      dispatch(titlea(e.target.value));
    }, 200);
  };

  const url = process.env.REACT_APP_CLOUDURL;
  const preset = process.env.REACT_APP_CLOUDUPLOADPRESET;
  const cloudName = process.env.REACT_APP_CLOUDNAME;

  const tryToUpload = async (e) => {
    e.preventDefault();
    dispatch(publishSpin());
    if (selectedImg) {
      if (title && title.length < 60) {
        dispatch(showModal());

        dispatch(modalStatus(true));
        dispatch(
          modalMessage({
            status: `the title must be more than 60 character`,
            color: "info",
          })
        );
        setTimeout(() => {
          dispatch(closeModal());
          dispatch(publishSpin());
        }, 1500);
      } else {
        const formData = new FormData();
        formData.append("file", selectedImg);
        formData.append("upload_preset", `${preset}`);
        formData.append("cloud_name", `${cloudName}`);
        formData.append("folder", "blog1");

        const req = await axios.post(url, formData, {
          withCredentials: false,
        });
        const data = await req.data;
        if (data) {
          const { secure_url } = data;
          setUploadImg(secure_url);
          dispatch(imagee(secure_url));

          const dateNow = new Date();
          if (secure_url) {
            const articleObj1 = {
              id: postId,
              text: plainText,
              image: secure_url,
              title: title,
              // author: authorId,
              body: convertedData,
              section: section,
            };
            const articleObj2 = {
              id: postId,
              text: plainText,
              image: secure_url,
              title: title,
              // author: authorId,
              body: convertedData,
            };
            const post = section.length !== 0 ? articleObj1 : articleObj2;

            dispatch(editArticleThunk(post))
              .unwrap()
              .then((data) => {
                const { status } = data;
                const {
                  post: { _id },
                } = data;

                if (status === "success") {
                  dispatch(showModal());
                  dispatch(modalStatus(true));
                  dispatch(modalMessage({ status, color: "success" }));
                  setTimeout(() => {
                    dispatch(modalStatus(false));
                    setTimeout(() => {
                      dispatch(clearState());
                      dispatch(closeModal());
                      navigate(`/articles/${_id}`);
                    }, 1000);
                  }, 1000);
                } else if (status.includes("failed")) {
                  dispatch(showModal());
                  dispatch(modalStatus(true));
                  dispatch(modalMessage({ status, color: "danger" }));
                  setTimeout(() => {
                    dispatch(modalStatus(false));
                    setTimeout(() => {
                      dispatch(clearState());
                      dispatch(closeModal());

                      navigate(`/users/userif`);
                    }, 1000);
                  }, 1000);
                }
              })
              .catch((err) => {
                dispatch(showModal());
                dispatch(modalStatus(true));
                dispatch(modalMessage({ status: "error", color: "danger" }));
                setTimeout(() => {
                  modalStatus(false);
                  setTimeout(() => {
                    dispatch(clearState());
                    dispatch(closeModal());
                    navigate(`/users/userif`);
                  }, 1000);
                }, 1000);
                console.log(err.message);
              });
          }
        }
      }
    } else if (!selectedImg) {
      if (title && title.length < 70) {
        dispatch(showModal());

        dispatch(modalStatus(true));
        dispatch(
          modalMessage({
            status: `the title must be more than 70 character`,
            color: "info",
          })
        );
        setTimeout(() => {
          dispatch(closeModal());
          dispatch(publishSpin());
        }, 1500);
      } else {
        const dateNow = new Date();

        const articleObj1 = {
          id: postId,
          text: plainText,
          title: title,
          // author: authorId,
          body: convertedData,

          section: section,
        };
        const articleObj2 = {
          id: postId,
          text: plainText,
          title: title,
          // author: authorId,
          body: convertedData,
        };
        const post = section.length !== 0 ? articleObj1 : articleObj2;
        dispatch(editArticleThunk(post))
          .unwrap()
          .then((data) => {
            const { status } = data;
            const {
              post: { _id },
            } = data;

            if (status === "success") {
              dispatch(showModal());
              dispatch(modalStatus(true));
              dispatch(modalMessage({ status, color: "success" }));
              setTimeout(() => {
                dispatch(modalStatus(false));
                setTimeout(() => {
                  dispatch(clearState());
                  dispatch(closeModal());
                  navigate(`/articles/${_id}`);
                }, 1000);
              }, 1000);
            } else if (status.includes("failed")) {
              dispatch(showModal());
              dispatch(modalStatus(true));
              dispatch(modalMessage({ status, color: "danger" }));
              setTimeout(() => {
                modalStatus(false);
                setTimeout(() => {
                  dispatch(clearState());
                  dispatch(closeModal());
                  navigate(`/users/userif`);
                }, 1000);
              }, 1000);
            }
          })
          .catch((err) => {
            dispatch(showModal());
            dispatch(modalStatus(true));
            dispatch(modalMessage({ status: "error", color: "danger" }));
            setTimeout(() => {
              modalStatus(false);
              setTimeout(() => {
                dispatch(clearState());
                dispatch(closeModal());
                navigate(`/users/userif`);
              }, 1000);
            }, 1000);
            console.log(err.message);
          });
      }
    }
  };

  return (
    <div>
      <div className="d-flex  flex-wrap">
        <div
          className={` ${
            isVisible === true ? "d-block" : "d-none"
          } container d-flex `}
        >
          <button
            type="button"
            className="  mb-2 btn btn-warning me-auto "
            onClick={(e) => tryToUpload(e)}
          >
            <div className="d-flex justify-content-center align-items-center">
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className={`${publishL ? "d-block" : "d-none"}`}
              />

              <p className={`${publishL ? "d-none" : "d-block"} m-1`}>النشر</p>
            </div>
          </button>
        </div>
        <div className="ms-auto">
          <div className="mt-2 mb-3 me-auto ">
            <input
              className=" border me-auto border-dark arabicDirection rounded"
              type="text"
              id="title"
              name="mytitle"
              placeholder="العنوان"
              required={true}
              onChange={(e) => titleHandler(e)}
            ></input>
          </div>
        </div>
        <div className="mt-2 mb-3 d-flex  flex-wrap ms-auto">
          <div className="ms-auto">
            <input
              className=" border border-dark rounded w-75 arabicDirection"
              type="file"
              formEncType="multipart/form-data"
              id="myfile"
              name="myfile"
              placeholder="صورة المقال"
              required={true}
              onChange={(e) => imgHandler(e)}
            />
          </div>
        </div>
        <div className="d-flex flex-column ms-auto ">
          <div className="mt-2 mb-3  d-flex flex-wrap ms-auto">
            <select
              className=""
              name="authors"
              id="authors"
              onChange={(e) => sectionsHandler(e)}
            >
              <option defaultValue={true}>إختر الأقسام</option>

              {allSectionsMap}
            </select>
          </div>
          <div
            className={` ${
              selectedSectionName.length !== 0 ? "d-block" : "d-none"
            } d-flex flex-column align-items-center`}
          >
            <span className="text-start ms-auto text-primary mb-2">
              الأقسام التي تم أختيارها
            </span>
            <div
              className={`text-start mb-2 d-flex flex-column ${
                selectedSectionName.length !== 0 ? "d-block" : "d-none"
              }`}
            >
              <span className="text-start ms-auto mb-2">
                {` ${selectedSectionName ? selectedSectionName : ""} `}
              </span>
            </div>
            <button
              type="button"
              className={`btn btn-danger mb-2 text-center ms-auto`}
              onClick={(e) => clearSectionsNames(e)}
            >
              م
            </button>
          </div>
        </div>
      </div>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
      >
        <FaBold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "is-active" : ""}
      >
        <FaItalic />
      </button>

      {/* <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={editor.isActive("code") ? "is-active" : ""}
      >
        code
      </button> */}

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
      >
        h1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
      >
        h2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}
      >
        h3
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={editor.isActive("heading", { level: 4 }) ? "is-active" : ""}
      >
        h4
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={editor.isActive("heading", { level: 5 }) ? "is-active" : ""}
      >
        h5
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={editor.isActive("heading", { level: 6 }) ? "is-active" : ""}
      >
        h6
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-active" : ""}
      >
        <FaListUl />
      </button>
      {/* <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "is-active" : ""}
        >
          ordered list
        </button> */}
      {/* <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive("codeBlock") ? "is-active" : ""}
      >
        code block
      </button> */}
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? "is-active" : ""}
      >
        <FaQuoteLeft />
      </button>
      {/* <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        horizontal rule
      </button> */}
      {/* <button onClick={() => editor.chain().focus().setHardBreak().run()}>
        hard break
      </button> */}
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <FaUndoAlt />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        <FaRedoAlt />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={editor.isActive({ textAlign: "left" }) ? "is-active" : ""}
      >
        left
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={editor.isActive({ textAlign: "center" }) ? "is-active" : ""}
      >
        center
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={editor.isActive({ textAlign: "right" }) ? "is-active" : ""}
      >
        right
      </button>
      {/* <button
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        className={editor.isActive({ textAlign: "justify" }) ? "is-active" : ""}
      >
        justify
      </button> */}
      {/* <button onClick={() => editor.chain().focus().unsetTextAlign().run()}>
        unsetTextAlign
      </button> */}
      {/* <button onClick={() => textdir()}>TextDirection</button> */}
      <LoginModal loginStatus={loginStatus} loginMsg={loginMsg} />
    </div>
  );
};

// view
/* eslint import/no-anonymous-default-export: [2, {"allowAnonymousFunction": true}] */
