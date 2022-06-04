import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import FolderContext from "../context/FolderContext";
import ListContext from "../context/ListContext";
import { Link } from "react-router-dom";
import { faUser, faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Header() {
  const { user, logoutUser } = useContext(AuthContext);
  const { pendingFolderData } = useContext(FolderContext);
  const { setShowAlert, setAlertContent } = useContext(ListContext);
  const [userSettingOpen, setUserSettingOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const handleOverlayClick = () => {
    setUserSettingOpen(false);
    setNotificationOpen(false);
  };
  return (
    <nav className="header">
      <div className="header-container">
        <div className="header-notification">
          {pendingFolderData.length > 0 && (
            <span className="notification-label">
              {pendingFolderData.length}
            </span>
          )}
          <p>
            <FontAwesomeIcon
              icon={faBell}
              onClick={() => setNotificationOpen(!notificationOpen)}
            />
          </p>
        </div>
        <p className="app-title">ShareList</p>
        {user ? (
          <div className="header-side">
            <p>{user.username}</p>
            <p>
              <FontAwesomeIcon
                icon={faUser}
                onClick={() => setUserSettingOpen(!userSettingOpen)}
                className="user-icon"
              />
            </p>
          </div>
        ) : (
          <div className="header-side">
            <Link to="/login">Login</Link>
          </div>
        )}
        {userSettingOpen && (
          <>
            <div
              className="overlay overlay--local"
              onClick={handleOverlayClick}
            ></div>
            <div className="mini-menu-container">
              <div className="mini-menu-content">
                <div className="mini-menu-text-container" onClick={logoutUser}>
                  Logout
                </div>
                <div
                  className="mini-menu-text-container"
                  onClick={() => {
                    setShowAlert(true);
                    setAlertContent("account");
                  }}
                >
                  Delete account
                </div>
              </div>
            </div>
          </>
        )}
        {notificationOpen && (
          <>
            <div
              className="overlay overlay--local"
              onClick={handleOverlayClick}
            ></div>
            <div className="mini-menu-container mini-menu-container__notification">
              <div className="mini-menu-content mini-menu-container__notification">
                <div className="mini-menu-text-container mini-menu-text-container__notification">
                  {pendingFolderData.length > 0 && (
                    <p>
                      You have {pendingFolderData.length} new notification.
                      Check out "Sharing Status" in the side menu
                    </p>
                  )}
                  {pendingFolderData.length === 0 && (
                    <p>You have no new notification.</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

export default Header;
