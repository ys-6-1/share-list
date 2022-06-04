import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import ListContext from "../context/ListContext";

function Alert() {
  const { deleteAccount } = useContext(AuthContext);
  const { setShowAlert, setDispatchItemDelete, alertContent, setAlertContent } =
    useContext(ListContext);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const navigate = useNavigate();
  const handleCloseAlert = () => {
    setShowAlert(false);
    setAlertContent(null);
    showDeleteConfirmation(false);
  };

  return (
    <div className="modal">
      <div className="modal-overlay" onClick={handleCloseAlert}></div>
      <div className="modal-window">
        <div className="modal-content-container">
          <div className="modal-close" onClick={handleCloseAlert}>
            &times;
          </div>
          <div className="modal-content">
            {alertContent === "account" && (
              <>
                <p>Are you sure you want to delete your account?</p>
                <div className="modal-content-choices">
                  <span
                    onClick={() => {
                      setAlertContent("follow up");
                      setShowDeleteConfirmation(true);
                      deleteAccount();
                      setTimeout(() => {
                        setAlertContent(null);
                        navigate("/login");
                      }, 5000);
                    }}
                  >
                    Delete
                  </span>
                  <span onClick={handleCloseAlert}>Cancel</span>
                </div>
              </>
            )}
            {alertContent === "follow up" && (
              <>
                <p>Your account has been deleted successfully.</p>
                <p>Thank you for using ShareList.</p>
                <p>We hope to see you again soon!</p>
              </>
            )}
            {!alertContent && (
              <>
                <p>Are you sure you want to delete this item?</p>
                <div className="modal-content-choices">
                  <span onClick={() => setDispatchItemDelete(true)}>
                    Delete
                  </span>
                  <span onClick={handleCloseAlert}>Cancel</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Alert;
