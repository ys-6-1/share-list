import React, { useContext } from "react";
import FolderContext from "../context/FolderContext";

function SlideMenu() {
  const {
    setModalOpen,
    setFolderSelectionView,
    setFolderCreateView,
    setFolderDeleteView,
    setApplyShareView,
    setManageShareView,
    pendingFolderData,
  } = useContext(FolderContext);
  return (
    <div className="slide-menu">
      {/* <input type="checkbox" className="nav__checkbox" id="nav__toggle" />
        <label htmlFor="nav__toggle" className="nav__button">
          <span className="nav__icon">&nbsp;</span>
        </label> */}
      <div className="nav__background">
        <nav className="slide-menu__content">
          <ul className="nav__list">
            <li>
              {pendingFolderData.length > 0 && (
                <span className="notification-label notification-label__slide-menu">
                  {pendingFolderData.length}
                </span>
              )}
              <span
                href="#top"
                className="nav__link nav__link--home"
                onClick={() => {
                  setManageShareView(true);
                  setModalOpen(true);
                }}
              >
                Sharing Status
              </span>
            </li>

            <li>
              <span
                href="#top"
                className="nav__link nav__link--home"
                onClick={() => {
                  setApplyShareView(true);
                  setModalOpen(true);
                }}
              >
                Share folder
              </span>
            </li>

            <li>
              <span
                href="#top"
                className="nav__link nav__link--home"
                onClick={() => {
                  setFolderCreateView(true);
                  setModalOpen(true);
                }}
              >
                New Folder
              </span>
            </li>

            <li className="nav__link nav__link--projects">
              <span
                onClick={() => {
                  setFolderSelectionView(true);
                  setModalOpen(true);
                }}
              >
                Edit Folders
              </span>
            </li>

            <li className="nav__link nav__link--projects">
              <span
                onClick={() => {
                  setFolderDeleteView(true);
                  setModalOpen(true);
                }}
              >
                Delete Folders
              </span>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default SlideMenu;
