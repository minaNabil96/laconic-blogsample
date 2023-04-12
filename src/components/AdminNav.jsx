import { React, useState } from "react";
import Nav from "react-bootstrap/Nav";
import styles from "../components/cssmodules/AdminNav.module.css";
import { useSelector, useDispatch } from "react-redux";
import { theClickedIdx } from "../store/uiSlices/switchAdminNav";
import { closeModal } from "../store/uiSlices/modalSlice";
import { closeBigModal } from "../store/uiSlices/bigModalSlice";
function AdminNav() {
  const { index } = useSelector((state) => state.switchAdminNav);
  const [names, setNames] = useState([{ name: "Users" }, { name: "Sections" }]);
  const [clickedIdx, setClickedIdx] = useState(index);

  const dispatch = useDispatch();

  const switchF = (e, idx) => {
    e.preventDefault();
    setClickedIdx(idx);
    dispatch(theClickedIdx(idx));
    dispatch(closeModal());
    dispatch(closeBigModal());
  };

  const namessMap = names.map(({ name }, idx) => (
    <Nav.Item key={idx} onClick={(e) => switchF(e, idx)}>
      <button
        className={` btn  ${
          idx === clickedIdx ? `${styles.switchers} text-black` : "text-white"
        } `}
      >
        {name}
      </button>
    </Nav.Item>
  ));

  return (
    <div
      className={`container pt-5 pb-0 mb-0 d-flex justify-content-center align-items-center `}
    >
      <Nav className={`pt-5 pb-0 mb-0`} defaultActiveKey="users">
        {namessMap}
        <Nav.Item>
          {/* <Nav.Link eventKey="disabled" disabled>
            Disabled
          </Nav.Link> */}
        </Nav.Item>
      </Nav>
    </div>
  );
}

export default AdminNav;
