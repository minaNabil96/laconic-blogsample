import React, { useEffect, useState } from "react";
import styles from "../components/cssmodules/Login.module.css";
import { useSelector } from "react-redux";
import {
  closeModal,
  modalStatus,
  modalMessage,
  showModal,
} from "../store/uiSlices/modalSlice";
import { useDispatch } from "react-redux";
import {
  deleteUser,
  deleteAllUserArticles,
  editUser,
  fullUserEdit,
} from "../store/slices/adminSlice";
import { getUserInfo } from "../store/slices/auth";
import { useNavigate } from "react-router-dom";
import { publishSpin } from "../store/uiSlices/addPostSlice";
import { deleteSection } from "../store/slices/adminSlice";
import { closeBigModal } from "../store/uiSlices/bigModalSlice";
// imports

function LoginModal({
  loginStatus,
  loginMsg,
  fullEditUserData,
  selectedUserIdForEdit,
  userfulldatafromform,
}) {
  const [openModal, setOpenModal] = useState(false);
  const [adminId, setAdminId] = useState(false);
  const navigate = useNavigate();
  const {
    modalStatus: modalstatus,
    modalMessage: modalmessage,
    modalColor,
    modalName,
    showOrHide,
    modalPayload,
  } = useSelector((state) => state.modalSlice);

  const dispatch = useDispatch();
  useEffect(() => {
    if (modalName) {
      dispatch(getUserInfo())
        .unwrap()
        .then((res) => {
          const { username, _id: adminId } = res;
          if (adminId) {
            setAdminId(adminId);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, [dispatch, modalName]);

  useEffect(() => {
    if (loginStatus) {
      setOpenModal(true);
    } else {
      setOpenModal(false);
    }
    return clearTimeout();
  }, [loginStatus]);

  const close = (e) => {
    e.preventDefault();
    dispatch(closeModal());
  };

  const deleteTheUser = (e) => {
    e.preventDefault();
    if (fullEditUserData) {
      if (modalName === "deleteUser" && adminId && fullEditUserData._id) {
        const { _id: userIdForDelete } = fullEditUserData;
        dispatch(closeModal());
        dispatch(deleteUser({ adminId, userIdForDelete }))
          .unwrap()
          .then((res) => {
            console.log(res);
            const { status } = res;
            if (status.includes("success")) {
              dispatch(showModal());

              dispatch(modalStatus(true));
              dispatch(modalMessage({ status, color: "success" }));
              setTimeout(() => {
                dispatch(closeModal());
              }, 3000);
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
      } else if (
        modalName === "deleteUserWithAllArticles" &&
        adminId &&
        fullEditUserData._id
      ) {
        const { _id: userIdForDelete } = fullEditUserData;
        dispatch(closeModal());
        dispatch(deleteAllUserArticles({ adminId, userIdForDelete }))
          .unwrap()
          .then((res) => {
            console.log(res);
            const { status } = res;
            if (status.includes("success")) {
              dispatch(showModal());

              dispatch(deleteUser({ adminId, userIdForDelete }));
              dispatch(modalStatus(true));
              dispatch(modalMessage({ status, color: "success" }));
            }
            setTimeout(() => {
              dispatch(closeModal());
            }, 3000);
          })
          .catch((err) => {
            console.log(err.message);
          });
      }
    } else if (modalName === "deleteSection" && adminId && modalPayload) {
      dispatch(deleteSection(modalPayload))
        .unwrap()
        .then((res) => {
          const { status } = res;
          if (res.status.includes("success")) {
            dispatch(showModal());
            dispatch(modalStatus(true));
            dispatch(modalMessage({ status, color: "success" }));
            setTimeout(() => {
              dispatch(closeModal());
              navigate(`/sections`);
            }, 3000);
          } else {
            dispatch(showModal());

            dispatch(modalStatus(true));
            dispatch(modalMessage({ status, color: "danger" }));
            setTimeout(() => {
              dispatch(closeModal());
              navigate(`/sections`);
            }, 3000);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };

  // start edit user
  const editUsers = (e) => {
    e.preventDefault();
    dispatch(publishSpin());

    if (modalName === "editUser" && adminId && selectedUserIdForEdit) {
      const { id, isSuper } = selectedUserIdForEdit;
      dispatch(closeModal());
      dispatch(editUser({ adminId, userId: id, superOrNot: isSuper }))
        .unwrap()
        .then((res) => {
          const { status } = res;
          if (status) {
            if (status.includes("success")) {
              dispatch(showModal());

              dispatch(modalStatus(true));
              dispatch(modalMessage({ status, color: "success" }));
              setTimeout(() => {
                dispatch(publishSpin());

                dispatch(closeModal());
              }, 3000);
            }
          }
        })
        .catch((err) => {
          dispatch(publishSpin());

          console.log(err.message);
        });
    } else if (modalName === "editUserData" && adminId) {
      dispatch(fullUserEdit({ adminId, userfulldatafromform }))
        .unwrap()
        .then((res) => {
          console.log(res);
          const { status } = res;

          if (status.includes("success")) {
            dispatch(showModal());
            dispatch(modalStatus(true));
            dispatch(modalMessage({ status, color: "success" }));
            setTimeout(() => {
              dispatch(closeModal());
              dispatch(publishSpin());
              dispatch(closeBigModal());
            }, 3000);
          }
        })
        .catch((err) => {
          dispatch(publishSpin());

          console.log(err);
        });
    }
  };
  // end edit user
  return (
    <>
      <div
        className={`${openModal || modalstatus ? "d-block" : "d-none"} `}
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog d-flex align-items-center justify-content-center ">
          <div className={`modal-content  ${styles.validationMsg}`}>
            <div
              className={`modal-body d-flex align-items-center justify-content-center text-white rounded bg-${modalColor} `}
            >
              <h5 className="text-center text-white mt-3">
                {modalmessage ? modalmessage : loginMsg}
              </h5>
            </div>
            <div
              className={` ${
                !showOrHide ? "d-none" : "d-block"
              } d-flex justify-content-center align-items-center`}
            >
              <button
                type="button"
                className={` btn btn-primary w-25 m-auto`}
                onClick={(e) => close(e)}
              >
                close
              </button>
              <button
                type="button"
                className={` ${
                  modalName && modalName.includes("delete")
                    ? "d-block"
                    : "d-none"
                } btn btn-warning w-25 m-auto`}
                onClick={(e) => deleteTheUser(e)}
              >
                ok
              </button>
              <button
                type="button"
                className={` ${
                  modalName && modalName.includes("edit") ? "d-block" : "d-none"
                } btn btn-success w-25 m-auto`}
                onClick={(e) => editUsers(e)}
              >
                ok
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginModal;

// ${
//   loginMsg &&
//   (loginMsg.includes("welcome") ||
//     loginMsg.includes("deleted") ||
//     loginMsg.includes("success") ||
//     modalColor === "green")
//     ? "bg-success"
//     : modalName === "delete"
//     ? "bg-light"
//     : "bg-danger"
// }
