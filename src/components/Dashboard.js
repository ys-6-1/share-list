import React, { useContext } from "react";
import ListContext from "../context/ListContext";
import AllList from "./AllList";

function Dashboard() {
  const { settingOpen, handleOverlayClick } = useContext(ListContext);

  return (
    <div className="dashboard">
      {settingOpen !== undefined && (
        <div
          className="overlay overlay--global"
          onClick={handleOverlayClick}
        ></div>
      )}

      <div className="main-container">
        <AllList />
      </div>
    </div>
  );
}

export default Dashboard;
