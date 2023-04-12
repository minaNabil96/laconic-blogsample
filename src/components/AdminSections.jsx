import { React, useEffect, useState } from "react";
import styles from "../components/cssmodules/PostsView.module.css";
import {
  getAllSectionsForAdmin,
  oneSectionDetails,
} from "../store/slices/sections";
import { useSelector, useDispatch } from "react-redux/es/exports";
import { Button } from "react-bootstrap";
import { MdDeleteSweep, MdEditNote } from "react-icons/md";
import { FaInfoCircle } from "react-icons/fa";
import {
  modalMessage,
  modalType,
  modalStatus,
  modalPayloadData,
} from "../store/uiSlices/modalSlice";
import {
  bigModalStatus,
  bigModalType,
  bigModalPayloadData,
} from "../store/uiSlices/bigModalSlice";
import LoginModal from "./LoginModal";
function AdminSections() {
  const { sections, sectionsDetails } = useSelector((state) => state.sections);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllSectionsForAdmin());
  }, [dispatch]);

  // start section info
  const showSectionInfo = (e, section) => {
    const sectionId = section._id;
    dispatch(oneSectionDetails(sectionId))
      .unwrap()
      .then((res) => {
        if (res) {
          console.log(res);
          const { status } = res;
          if (status) {
            let sectionObj = { ...section };
            sectionObj.sectionsDetails = status;
            dispatch(bigModalPayloadData(sectionObj));
            setTimeout(() => {
              dispatch(bigModalStatus(true));
              dispatch(bigModalType("sectionInfo"));
            }, 200);
          } else if (!status) {
            let sectionObj = { ...section };
            sectionObj.sectionsDetails = res;
            dispatch(bigModalPayloadData(sectionObj));
            setTimeout(() => {
              dispatch(bigModalStatus(true));
              dispatch(bigModalType("sectionInfo"));
            }, 200);
          }
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  // end section info
  // edit section
  const editSection = (e, section) => {
    e.preventDefault();
    dispatch(
      bigModalPayloadData({ ...section, sectionVisibality: section.visible })
    );

    dispatch(bigModalStatus(true));
    dispatch(bigModalType("sectionEdit"));
  };

  // end edit section

  // add section
  const addSectionF = async (e) => {
    e.preventDefault();
    try {
      dispatch(bigModalStatus(true));
      dispatch(bigModalType("addSection"));
    } catch (error) {
      console.log(error.message);
    }
  };

  // end add section

  const deleteSection = async (e, section) => {
    e.preventDefault();
    try {
      dispatch(modalPayloadData(section));
      dispatch(modalType("deleteSection"));
      dispatch(modalStatus(true));
      dispatch(
        modalMessage({
          status: `are you sure you want to delete ${` `} "${
            section.sectionName
          }" ?`,
          color: "info",
        })
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const allSectionsMap = sections ? (
    sections.map(({ sectionName, image, _id, desc, date, visible }, idx) => (
      <tr key={_id}>
        <th className="text-center pt-3 align-middle " scope="row">
          {idx + 1}
        </th>

        <td className="text-center pt-3 align-middle ">{sectionName}</td>
        <td className="text-center pt-3 align-middle">
          <img
            className={` ${styles.adminSections} rounded border border-info `}
            src={image}
            alt="img"
          />
        </td>
        <td className={`text-center pt-3 align-middle`}>
          {visible === true ? "نعم" : "لا"}
        </td>

        <td className={`text-end align-middle `}>
          <div className={`row pe-3 `}>
            <div className="me-1 col-6 col-md-4 mt-1 mb-1 me-auto">
              <Button
                size="sm"
                className={` ${
                  visible === false ? "d-none" : "d-block"
                } btn btn-danger me-2 me-auto `}
                onClick={(e) =>
                  deleteSection(e, {
                    _id,
                    sectionName,
                    desc,
                  })
                }
              >
                <MdDeleteSweep className={` text-light m-0 p-0 `} />
              </Button>
            </div>
            <div className={`col-6 col-md-4 mt-1 mb-1 me-2  me-auto`}>
              <Button
                size="sm"
                className={`btn btn-warning me-2 me-auto `}
                onClick={(e) =>
                  editSection(e, {
                    _id,
                    sectionName,
                    desc,
                    visible,
                  })
                }
              >
                <MdEditNote className={` text-black m-0 p-0 `} />
              </Button>
            </div>
            <div className={`col-6 col-md-4 mt-1 mb-1 me-2  me-auto`}>
              <Button
                size="sm"
                className={`btn btn-light me-2 me-auto `}
                onClick={(e) =>
                  showSectionInfo(e, {
                    _id,
                    sectionName,
                    desc,
                    date,
                  })
                }
              >
                <FaInfoCircle className={` text-primary m-0 p-0 `} />
              </Button>
            </div>
          </div>
        </td>
      </tr>
    ))
  ) : (
    <div className="text-black text-center"> there's no sections </div>
  );

  return (
    <div className={`container ${styles.background}`}>
      <div className="row d-flex justify-content-center align-items-center">
        <aside
          className={`${styles.myarticles_aside} rounded table-responsive overFlowScrollWithY  `}
        >
          {/* <MydModalWithGrid onHide={() => onHide()} /> */}
          <div
            className={`m-auto d-flex justify-content-center align-items-center`}
          >
            <Button
              size="sm"
              variant="light"
              className={`text-primary text-center p-2 m-auto mt-3 `}
              onClick={(e) => addSectionF(e)}
            >
              Add Section
            </Button>
          </div>
          <table className="  table table-dark  table-bordered border-warning table-hover mt-3">
            <thead className="">
              <tr className="text-center  ">
                <th scope=" text-center">#</th>
                <th scope=" text-center">section name</th>
                <th scope=" text-center align-middle"> image </th>
                <th scope=" text-center align-middle">visible ?</th>
                <th scope=" text-center">control</th>
              </tr>
            </thead>
            <tbody className="">{allSectionsMap && allSectionsMap}</tbody>
          </table>
        </aside>
        <div className="m-auto d-flex justify-content-center align-items-center">
          <LoginModal />
        </div>
      </div>
    </div>
  );
}

export default AdminSections;
