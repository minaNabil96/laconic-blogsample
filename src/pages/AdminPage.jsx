import React, { useState } from "react";
import AdminUi from "../components/AdminUi";
import AdminNav from "../components/AdminNav";
import AdminSections from "../components/AdminSections";
import { useSelector, useDispatch } from "react-redux";
import { bigModalStatus, closeBigModal } from "../store/uiSlices/bigModalSlice";
import { closeModal } from "../store/uiSlices/modalSlice";
import MydModalWithGrid from "../components/MydModalWithGrid";
function AdminPage(props) {
  const [clearInputs, setClearInputs] = useState("false");
  const { index } = useSelector((state) => state.switchAdminNav);
  const dispatch = useDispatch();
  const onHide = () => {
    dispatch(bigModalStatus(false));
    dispatch(closeModal());
    setClearInputs("true");
    setTimeout(() => {
      dispatch(closeBigModal());
      setClearInputs("false");
    }, 200);
  };
  return (
    <div className={`pt-5 `}>
      <div>
        <AdminNav />
      </div>
      {/* <MydModalWithGrid onHide={onHide} /> */}
      <div className={` ${index === 0 ? "d-block" : "d-none"} `}>
        <AdminUi />
      </div>
      <div className={` ${index === 1 ? "d-block" : "d-none"}`}>
        <AdminSections />
      </div>
    </div>
  );
}

export default AdminPage;
