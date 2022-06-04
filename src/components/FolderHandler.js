import React, { useContext, useEffect } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FolderContext from "../context/FolderContext";

function FolderHandler() {
  const {
    modalOpen,
    createFolder,
    updateFolder,
    deleteFolder,
    folderSelectionView,
    setFolderSelectionView,
    folderCreateView,
    folderDeleteView,
    folderEditView,
    setFolderEditView,
    manageShareView,
    applyShareView,
    setApplyShareView,
    emailInputView,
    setEmailInputView,
    validUserView,
    invalidUserView,
    ownFolderData,
    sharedFolderData,
    sharingFolderData,
    pendingFolderData,
    folderSelected,
    setFolderSelected,
    folderSaved,
    folderDeleted,
    resetFolderProps,
    folderTitle,
    setFolderTitle,
    inputEl,
    checkIfValidUser,
    emailInput,
    setEmailInput,
    handleShareAccept,
    stopSharing,
  } = useContext(FolderContext);

  useEffect(() => {
    inputEl?.current?.focus();
  }, [modalOpen, folderSelectionView]);

  const handleClose = () => {
    resetFolderProps();
  };
  const handleChange = (e) => {
    setFolderTitle(e.target.value);
  };

  return (
    <div className="modal">
      <div className="modal-overlay" onClick={handleClose}></div>
      <div className="modal-window modal-window__folder">
        <div className="modal-content-container">
          <div className="modal-close" onClick={handleClose}>
            &times;
          </div>
          <div className="modal-content">
            {emailInputView && (
              <form className="form" onSubmit={checkIfValidUser}>
                <div className="form-content">
                  <p>You've selected the folder:</p>
                  <p>
                    <strong>{folderSelected.title}</strong>
                  </p>
                  <p>
                    Please input email address of users you want to share the{" "}
                    folder with:
                  </p>
                  <input
                    type="email"
                    className="text"
                    placeholder="Email"
                    name="email"
                    ref={inputEl}
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                  />
                </div>
                <button className="form-submit-btn">Submit</button>
              </form>
            )}

            {invalidUserView && (
              <div className="share-confirmation">
                <p>Sorry, currently there is no matching user.</p>
                <p>
                  Please ask your friend to join the app as user and try again!
                </p>
              </div>
            )}
            {validUserView && (
              <div className="share-confirmation">
                <p>
                  <strong>The invitation has been sent successfully!</strong>
                </p>
                <p>
                  Once your friend accepted the invitation, the sharing will
                  start.
                </p>
                <p>Shared folders are displayed with a "shared" icon.</p>
              </div>
            )}

            {manageShareView && (
              <div className="manage-view">
                <div className="manage-view-container notification">
                  <div className="manage-view-title">
                    <p>Notification</p>
                    <div className="border"></div>
                  </div>
                  {pendingFolderData.length === 0 ? (
                    <div className="manage-view-content manage-view-content__notification">
                      <p>No notifications</p>
                    </div>
                  ) : (
                    <div className="manage-view-content manage-view-content__notification">
                      {pendingFolderData.map((el) => (
                        <div
                          className="notification-content__item"
                          key={el.title}
                        >
                          <div className="notification-message">
                            <p>You are invited to the folder</p>
                            <p>"{el.title}"</p>
                            <p> by {el.email}.</p>
                            <p>
                              Please accept the inviation if you trust this
                              user.
                            </p>
                          </div>
                          <div className="accept-btns">
                            <button
                              name="accept"
                              className="accept-btn"
                              value={el.shared_id}
                              onClick={handleShareAccept}
                            >
                              Accept
                            </button>
                            <button
                              name="reject"
                              className="reject-btn"
                              onClick={handleShareAccept}
                              value={el.shared_id}
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="manage-view-container">
                  <div className="manage-view-title">
                    <p>Current Sharing Status</p>
                    <div className="border"></div>
                  </div>
                  <div className="manage-view-content manage-view-content__sharing-status">
                    <div className="sharing-folder-list-container">
                      <p className="folder-list-container__title">
                        Folders you are sharing:
                      </p>
                      {sharingFolderData.length === 0 && <p>None</p>}
                      <ul className="sharing-folder-list">
                        {sharingFolderData.map((el) => (
                          <li key={el.title}>
                            <p className="sharing-folder-list__title">
                              {el.title}
                            </p>
                            <p>Shared to: {el.user_name}</p>
                            <button
                              className="stop-btn"
                              value={el.shared_id}
                              onClick={stopSharing}
                            >
                              Stop sharing
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="sharing-folder-list-container">
                      <div className="shared-folder">
                        <p className="folder-list-container__title">
                          Folders you've joined:
                        </p>
                        {sharedFolderData.length === 0 && (
                          <p style={{ textAlign: "center" }}>None</p>
                        )}
                        <ul className="sharing-folder-list">
                          {sharedFolderData.map((el) => (
                            <li key={el.title}>
                              <p className="sharing-folder-list__title">
                                {el.title}
                              </p>
                              <p>Shared by: {el.user_name}</p>
                              <button
                                className="stop-btn"
                                value={el.shared_id}
                                onClick={stopSharing}
                              >
                                Stop sharing
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(folderSelectionView || folderDeleteView || applyShareView) && (
              <div>
                {ownFolderData.length > 0 && (
                  <p>
                    Which folder do you want to{" "}
                    {folderDeleteView
                      ? "delete"
                      : applyShareView
                      ? "share"
                      : "edit"}
                    ?
                  </p>
                )}
                <div className="folder-list-container">
                  <FormControl>
                    <RadioGroup name="radio-buttons-group">
                      {ownFolderData.length === 0 && (
                        <p>Folder list is empty. Please create folder first.</p>
                      )}
                      {ownFolderData.length > 0 &&
                        ownFolderData.map((el) => (
                          <FormControlLabel
                            key={el.title}
                            value={el.id}
                            control={
                              <Radio onChange={() => setFolderSelected(el)} />
                            }
                            label={el.title}
                          />
                        ))}
                    </RadioGroup>
                  </FormControl>
                </div>
                {folderSelected.id !== undefined ? (
                  <button
                    className="form-submit-btn"
                    onClick={
                      folderDeleteView
                        ? deleteFolder
                        : applyShareView
                        ? () => {
                            setApplyShareView(false);
                            setEmailInputView(true);
                          }
                        : () => {
                            setFolderSelectionView(false);
                            setFolderEditView(true);
                            setFolderTitle(folderSelected.title);
                            inputEl?.current?.focus();
                          }
                    }
                  >
                    {folderDeleteView
                      ? "Delete"
                      : applyShareView
                      ? "Select"
                      : "Edit"}
                  </button>
                ) : (
                  <button
                    disabled
                    className="form-submit-btn form-submit-btn__disabled"
                  >
                    {folderDeleteView
                      ? "Delete"
                      : applyShareView
                      ? "Select"
                      : "Edit"}
                  </button>
                )}
              </div>
            )}
            {(folderEditView || folderCreateView) && (
              <div className="form">
                <div className="form-container__folder">
                  <div className="form-top">
                    {folderCreateView ? (
                      <p>New Folder</p>
                    ) : (
                      <p>Update Folder</p>
                    )}
                  </div>
                  <div className="form-content">
                    <input
                      type="text"
                      className="text"
                      placeholder="Folder title"
                      name="title"
                      value={folderTitle || ""}
                      onChange={(e) => handleChange(e)}
                      ref={inputEl}
                    />
                    {folderTitle !== "" ? (
                      <button
                        className="form-submit-btn"
                        onClick={folderCreateView ? createFolder : updateFolder}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        disabled
                        className="form-submit-btn form-submit-btn__disabled"
                      >
                        Save
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
            {folderSaved && <div>Saved successfully!</div>}
            {folderDeleted && <div>Deleted successfully!</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FolderHandler;
