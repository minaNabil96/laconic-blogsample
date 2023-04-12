import React from "react";
import { useState, useEffect } from "react";

import styles from "../components/cssmodules/PostsView.module.css";
import DropdownButton from "react-bootstrap/DropdownButton";
import { useSelector, useDispatch } from "react-redux/es/exports";
import { getAllUsers } from "../store/slices/adminSlice";
import { getUserInfo } from "../store/slices/auth";
import {
  modalMessage,
  modalStatus,
  modalType,
  closeModal,
} from "../store/uiSlices/modalSlice";
import {
  bigModalStatus,
  bigModalType,
  bigModalPayloadData,
  closeBigModal,
} from "../store/uiSlices/bigModalSlice";
import { AdminGetUserArticles } from "../store/slices/userIf";
import LoginModal from "./LoginModal";
import Dropdown from "react-bootstrap/Dropdown";
import { Button } from "react-bootstrap";
import { MdDeleteSweep, MdEditNote } from "react-icons/md";
import { FaInfoCircle } from "react-icons/fa";
import MydModalWithGrid from "./MydModalWithGrid";

function AdminUi() {
  const [selectedUserIdForDelete, setSelectedUserIdForDelete] = useState("");
  const [selectedUserIdForEdit, setSelectedUserIdForEdit] = useState("");
  const [fullEditUserData, setFullEditUserData] = useState("");
  const [adminId, setAdminId] = useState("");
  const [modalName, setModalName] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [clearInputs, setClearInputs] = useState("false");
  const dispatch = useDispatch();
  const { loading, error, allUsersData } = useSelector(
    (state) => state.adminSlice
  );

  const { userInfo } = useSelector((state) => state.auth);
  const { formModalStatus } = useSelector((state) => state.modalSlice);

  const onHide = () => {
    dispatch(bigModalStatus(false));
    dispatch(closeModal());
    setClearInputs("true");
    setTimeout(() => {
      dispatch(closeBigModal());
      setClearInputs("false");
    }, 200);
  };

  useEffect(() => {
    dispatch(getUserInfo())
      .unwrap()
      .then((res) => {
        const { username, _id: adminId } = res;
        if (adminId) {
          dispatch(getAllUsers(adminId));
          setAdminId(adminId);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [dispatch]);

  // start delete user
  const deleteUser = (e, user) => {
    e.preventDefault();
    if (user.modalName === "deleteUser") {
      setFullEditUserData(user);
      // setModalName(user.modalName);
      dispatch(modalType("deleteUser"));
      dispatch(modalStatus(true));
      dispatch(
        modalMessage({
          status: `are you sure you want to delete   ${user.username} ?`,
          color: "info",
        })
      );
    } else if (user.modalName === "deleteUserWithAllArticles") {
      setFullEditUserData(user);
      // setModalName(user.modalName);
      dispatch(modalType("deleteUserWithAllArticles"));
      dispatch(modalStatus(true));
      dispatch(
        modalMessage({
          status: `are you sure you want to delete   ${user.username} with his all articles ?`,
          color: "info",
        })
      );
    }
  };
  // end delete user
  // start edit user
  const editUser = (e, user) => {
    e.preventDefault();

    if (user.modalName === "editUser") {
      // setModalName(user.modalName);
      dispatch(modalType("editUser"));

      if (user.isSuper === false) {
        setSelectedUserIdForEdit({ id: user._id, isSuper: true });
        dispatch(
          modalMessage({
            status: `are you sure you want to make ${user.username} super user ?`,
            color: "info",
          })
        );
        dispatch(modalStatus(true));
      } else if (user.isSuper === true) {
        setSelectedUserIdForEdit({ id: user._id, isSuper: false });
        dispatch(
          modalMessage({
            status: `are you sure you want to make ${user.username} mere user ?`,
            color: "info",
          })
        );
        dispatch(modalStatus(true));
      }
    }

    // end edit Is super
    else if (user.modalName === "editUserData") {
      dispatch(bigModalStatus(true));
      dispatch(bigModalType(user.bigModalName));
      dispatch(bigModalPayloadData(user));

      setFullEditUserData(user);
    }
  };
  // end edit user
  // start user info
  const showUserInfo = (e, user) => {
    e.preventDefault();
    const { _id } = user;
    dispatch(AdminGetUserArticles({ userId: _id }))
      .unwrap()
      .then((data) => {
        if (data) {
          setTimeout(() => {
            dispatch(bigModalStatus(true));
            dispatch(bigModalType(user.modalName));
          }, 200);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    dispatch(bigModalPayloadData(user));

    setTimeout(() => {
      dispatch(bigModalStatus(true));
      dispatch(bigModalType(user.modalName));
    }, 200);
  };
  // end user info
  const usersMap =
    allUsersData &&
    allUsersData.map(({ username, arabicname, isSuper, _id }, idx) => (
      <tr key={_id}>
        <th className="text-center pt-3 align-middle " scope="row">
          {idx + 1}
        </th>

        <td className="text-center pt-3 align-middle ">{username}</td>
        <td className="text-center pt-3 align-middle ">{arabicname}</td>
        <td className="text-center pt-3 align-middle ">
          {isSuper === true ? "yes" : "no"}
        </td>
        <td className={`text-center align-middle `}>
          <div className={`row pe-3 `}>
            <div className="me-1 col-6 col-md-4 mt-1 mb-1 me-auto">
              <DropdownButton
                as={`down-centered`}
                key={`down-centered`}
                id={`dropdown-button-drop-down-centered`}
                drop={`down-centered`}
                variant="danger"
                title={<MdDeleteSweep className="text-light" />}
                size="sm"
              >
                <Dropdown.Item
                  className="text-black"
                  eventKey="1"
                  onClick={(e) =>
                    deleteUser(e, {
                      _id,
                      username,
                      modalName: "deleteUser",
                    })
                  }
                >
                  Delete User
                </Dropdown.Item>

                <Dropdown.Divider />
                <Dropdown.Item
                  className="text-black"
                  eventKey="2"
                  onClick={(e) =>
                    deleteUser(e, {
                      _id,
                      username,
                      modalName: "deleteUserWithAllArticles",
                    })
                  }
                >
                  delete User With All his Articles
                </Dropdown.Item>
              </DropdownButton>
            </div>
            <div className={`col-6 col-md-4 mt-1 mb-1 me-2  me-auto`}>
              <DropdownButton
                as={`down-centered`}
                key={`down-centered`}
                id={`dropdown-button-drop-down-centered`}
                drop={`down-centered`}
                variant="warning"
                title={<MdEditNote className="text-black" />}
                size="sm"
              >
                <Dropdown.Item
                  className="text-black"
                  eventKey="1"
                  onClick={(e) =>
                    editUser(e, {
                      _id,
                      username,
                      isSuper,
                      modalName: "editUser",
                    })
                  }
                >
                  Super User ?
                </Dropdown.Item>

                <Dropdown.Divider />
                <Dropdown.Item
                  className="text-black"
                  eventKey="2"
                  onClick={(e) =>
                    editUser(e, {
                      _id,
                      username,
                      isSuper,
                      modalName: "editUserData",
                      bigModalName: "editUserForm",
                    })
                  }
                >
                  Change User Data
                </Dropdown.Item>
              </DropdownButton>
            </div>
            <div className="col-6 col-md-4 mt-1 me-auto mb-1">
              <Button
                size="sm"
                className={`btn btn-light me-2 me-auto `}
                onClick={(e) =>
                  showUserInfo(e, {
                    _id,
                    username,
                    arabicname,
                    modalName: "showUserData",
                  })
                }
              >
                <FaInfoCircle className={` text-primary m-0 p-0 `} />
              </Button>
            </div>
          </div>
        </td>
      </tr>
    ));

  return (
    <div className={`container ${styles.background}`}>
      {loading ? (
        <div
          className={` ${styles.errorback} d-flex justify-content-center align-items-center `}
        >{`Loading...`}</div>
      ) : error ? (
        <div
          className={` ${styles.errorback} d-flex justify-content-center align-items-center `}
        >
          {error}
        </div>
      ) : (
        <div className="row d-flex justify-content-center align-items-center">
          <aside
            className={`${styles.myarticles_aside} rounded table-responsive overFlowScrollWithY  `}
          >
            <table className="  table table-dark  table-bordered border-warning table-hover mt-3">
              <thead className="">
                <tr className="text-center  ">
                  <th scope=" text-center ">#</th>
                  <th scope=" text-center ">username</th>
                  <th scope=" text-center ">arabicname</th>
                  <th scope=" text-center ">superuser</th>
                  <th scope=" text-center ">controluser</th>
                </tr>
              </thead>
              <tbody className="">{usersMap && usersMap}</tbody>
            </table>
          </aside>
          <div className="m-auto d-flex justify-content-center align-items-center">
            <LoginModal
              modalName={modalName}
              fullEditUserData={fullEditUserData}
              selectedUserIdForEdit={selectedUserIdForEdit}
              adminId={adminId}
            />
          </div>
          <MydModalWithGrid
            show={formModalStatus}
            onHide={() => onHide()}
            clearinputs={clearInputs}
            fulledituserdata={fullEditUserData}
          />
        </div>
      )}
    </div>
  );
}

export default AdminUi;
