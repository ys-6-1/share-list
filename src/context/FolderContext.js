import { createContext, useState, useEffect, useRef, useContext } from "react";
import axiosInstance from "../axios";
import DataContext from "./DataContext";

const FolderContext = createContext();

export default FolderContext;

export function FolderProvider({ children }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [folderData, setFolderData] = useState([]);
  const [ownFolderData, setOwnFolderData] = useState([]);
  const [sharedFolderData, setSharedFolderData] = useState([]);
  const [sharingFolderData, setSharingFolderData] = useState([]);
  const [pendingFolderData, setPendingFolderData] = useState([]);
  const [folderSelectionView, setFolderSelectionView] = useState(false);
  const [folderCreateView, setFolderCreateView] = useState(false);
  const [folderEditView, setFolderEditView] = useState(false);
  const [folderDeleteView, setFolderDeleteView] = useState(false);
  const [manageShareView, setManageShareView] = useState(false);
  const [applyShareView, setApplyShareView] = useState(false);
  const [emailInputView, setEmailInputView] = useState(false);
  const [invalidUserView, setInvalidUserView] = useState(false);
  const [validUserView, setValidUserView] = useState(false);
  const [folderSelected, setFolderSelected] = useState({});
  const [folderSaved, setFolderSaved] = useState(false);
  const [folderDeleted, setFolderDeleted] = useState(false);
  const [folderTitle, setFolderTitle] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const { setCurrFolder, getListData } = useContext(DataContext);

  const inputEl = useRef(null);

  useEffect(() => {
    getFolderData();
  }, []);

  const resetFolderProps = () => {
    setModalOpen(false);
    setFolderSelected({});
    setFolderSelectionView(false);
    setFolderEditView(false);
    setFolderCreateView(false);
    setManageShareView(false);
    setApplyShareView(false);
    setEmailInputView(false);
    setInvalidUserView(false);
    setFolderDeleteView(false);
    setValidUserView(false);
    setFolderSaved(false);
    setFolderDeleted(false);
    setFolderTitle("");
    setEmailInput("");
  };

  const getFolderData = async () => {
    const folders = await axiosInstance.get("/api/folders", {
      headers: {
        Authorization: localStorage.getItem("access_token")
          ? `JWT ${String(localStorage.getItem("access_token"))}`
          : null,
        "Content-Type": "application/json",
        accept: "application/json",
      },
    });
    const sharedFolders = await axiosInstance.get("/api/shared_folders", {
      headers: {
        Authorization: localStorage.getItem("access_token")
          ? `JWT ${String(localStorage.getItem("access_token"))}`
          : null,
        "Content-Type": "application/json",
        accept: "application/json",
      },
    });

    const ownFolders = folders.data.map((ownFolder) => {
      const sharingIds = sharedFolders.data.sharing_folders.map((el) => el.id);
      return sharingIds.includes(ownFolder.id)
        ? { ...ownFolder, is_shared: true }
        : ownFolder;
    });
    const allFolders = ownFolders.concat(sharedFolders.data.shared_folders);
    setOwnFolderData(ownFolders);
    setSharedFolderData(sharedFolders.data.shared_folders);
    setSharingFolderData(sharedFolders.data.sharing_folders);
    setPendingFolderData(sharedFolders.data.pending_folders);
    setFolderData(allFolders);
  };

  const createFolder = async () => {
    await axiosInstance.post(
      "/api/folders",
      {
        title: folderTitle.trim(),
      },
      {
        headers: {
          Authorization: localStorage.getItem("access_token")
            ? `JWT ${String(localStorage.getItem("access_token"))}`
            : null,
          "Content-Type": "application/json",
          accept: "application/json",
        },
      }
    );
    setFolderCreateView(false);
    setFolderSaved(true);
    getFolderData();
    setTimeout(() => {
      resetFolderProps();
    }, 1000);
  };

  const updateFolder = async () => {
    await axiosInstance.patch(
      `/api/folders/${folderSelected.id}`,
      {
        title: folderTitle.trim(),
      },
      {
        headers: {
          Authorization: localStorage.getItem("access_token")
            ? `JWT ${String(localStorage.getItem("access_token"))}`
            : null,
          "Content-Type": "application/json",
          accept: "application/json",
        },
      }
    );
    setFolderEditView(false);
    setFolderSaved(true);
    getFolderData();
    setTimeout(() => {
      resetFolderProps();
    }, 1000);
  };

  const deleteFolder = async () => {
    await axiosInstance.delete(`/api/folders/${folderSelected.id}`, {
      headers: {
        Authorization: localStorage.getItem("access_token")
          ? `JWT ${String(localStorage.getItem("access_token"))}`
          : null,
        "Content-Type": "application/json",
        accept: "application/json",
      },
    });
    setFolderDeleteView(false);
    setFolderDeleted(true);
    getFolderData();
    setCurrFolder("Dashboard");
    getListData();

    setTimeout(() => {
      resetFolderProps();
    }, 1000);
  };

  const checkIfValidUser = async (e) => {
    e.preventDefault();
    const response = await axiosInstance.post(
      "api/valid_users",
      {
        email: emailInput,
      },
      {
        headers: {
          Authorization: localStorage.getItem("access_token")
            ? `JWT ${String(localStorage.getItem("access_token"))}`
            : null,
          "Content-Type": "application/json",
          accept: "application/json",
        },
      }
    );
    if (response.data.valid === true) {
      setEmailInputView(false);
      try {
        await createSharedFolder();
        setValidUserView(true);
      } catch (e) {
        alert("Something wnent wrong. Please try again.");
      }
    } else {
      setEmailInputView(false);
      setInvalidUserView(true);
    }
  };

  const createSharedFolder = async () => {
    axiosInstance.post(
      "/api/shared_folders",
      {
        email: emailInput,
        folderId: folderSelected.id,
      },
      {
        headers: {
          Authorization: localStorage.getItem("access_token")
            ? `JWT ${String(localStorage.getItem("access_token"))}`
            : null,
          "Content-Type": "application/json",
          accept: "application/json",
        },
      }
    );
  };

  const handleShareAccept = async (e) => {
    const sharedFolderPayload = { is_pending: false };
    if (e.target.name === "accept") {
      sharedFolderPayload.is_active = true;
    }
    if (e.target.name === "reject") {
      sharedFolderPayload.is_active = false;
    }
    await axiosInstance.patch(
      `/api/shared_folders/${e.target.value}`,
      sharedFolderPayload,
      {
        headers: {
          Authorization: localStorage.getItem("access_token")
            ? `JWT ${String(localStorage.getItem("access_token"))}`
            : null,
          "Content-Type": "application/json",
          accept: "application/json",
        },
      }
    );
    getFolderData();
  };

  const stopSharing = async (e) => {
    await axiosInstance.patch(
      `/api/shared_folders/${e.target.value}`,
      { is_active: false },
      {
        headers: {
          Authorization: localStorage.getItem("access_token")
            ? `JWT ${String(localStorage.getItem("access_token"))}`
            : null,
          "Content-Type": "application/json",
          accept: "application/json",
        },
      }
    );
    getFolderData();
  };

  const contextData = {
    modalOpen,
    setModalOpen,
    folderData,
    setFolderData,
    ownFolderData,
    setOwnFolderData,
    sharedFolderData,
    sharingFolderData,
    pendingFolderData,
    // currFolder,
    // setCurrFolder,
    getFolderData,
    createFolder,
    updateFolder,
    deleteFolder,
    folderSelectionView,
    setFolderSelectionView,
    manageShareView,
    setManageShareView,
    applyShareView,
    setApplyShareView,
    emailInputView,
    setEmailInputView,
    folderEditView,
    setFolderEditView,
    folderCreateView,
    setFolderCreateView,
    folderDeleteView,
    setFolderDeleteView,
    validUserView,
    setValidUserView,
    invalidUserView,
    setInvalidUserView,
    folderSelected,
    setFolderSelected,
    folderSaved,
    folderDeleted,
    setFolderSaved,
    resetFolderProps,
    folderTitle,
    setFolderTitle,
    inputEl,
    checkIfValidUser,
    emailInput,
    setEmailInput,
    handleShareAccept,
    stopSharing,
  };
  return (
    <FolderContext.Provider value={contextData}>
      {children}
    </FolderContext.Provider>
  );
}
