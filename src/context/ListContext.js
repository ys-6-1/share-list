import { createContext, useState, useRef, useContext } from "react";
import axiosInstance from "../axios";
import DataContext from "./DataContext";

const ListContext = createContext();

export default ListContext;

export function ListProvider({ children }) {
  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState(null);
  const [updateId, setUpdateId] = useState("");
  const [updateIndex, setUpdateIndex] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [deleteIndex, setDeleteIndex] = useState("");
  //   const [activeTab, setActiveTab] = useState("All");
  //   const [currFolderObj, setCurrFolderObj] = useState({});
  //   const [page, setPage] = useState(1);
  //   const [prevPage, setPrevPage] = useState(null);
  //   const [nextPage, setNextPage] = useState(null);
  //   const [listData, setListData] = useState([]);
  const [listItem, setListItem] = useState(undefined);
  const [settingOpen, setSettingOpen] = useState("");
  const [dispatchItemDelete, setDispatchItemDelete] = useState(false);
  //   const [checkedItems, setCheckedItems] = useState([]);
  const { currFolder, setCurrFolder } = useContext(DataContext);
  const {
    setCheckedItems,
    checkedItems,
    getListData,
    listData,
    setListData,
    setPage,
  } = useContext(DataContext);
  //   const { logoutUser } = useContext(AuthContext);
  const itemEl = useRef(null);

  const handleOverlayClick = () => {
    setSettingOpen("");
    setListItem("");
  };

  const handleCheckboxToggle = async (e, el, i) => {
    const isChecked = e.target.checked;

    if (isChecked) setCheckedItems([...checkedItems, el]);
    if (!isChecked)
      setCheckedItems(checkedItems.filter((item) => item.id !== el.id));
    await axiosInstance.patch(
      `api/items/${el.id}/`,
      {
        title: el.title,
        is_done: isChecked,
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

    getListData();
  };

  const handleDelete = async (el, i) => {
    setDeleteId(el.id);
    setDeleteIndex(i);
    setShowAlert(true);
  };

  const deleteItem = async () => {
    let newListData = listData;
    newListData.splice(deleteIndex, 1);
    setListData(newListData);
    setSettingOpen("");
    await axiosInstance.delete(`/api/items/${deleteId}/`, {
      headers: {
        Authorization: localStorage.getItem("access_token")
          ? `JWT ${String(localStorage.getItem("access_token"))}`
          : null,
        "Content-Type": "application/json",
        accept: "application/json",
      },
    });
  };

  const handleEdit = async (el, i) => {
    itemEl.current.focus();
    window.scrollTo({
      top: itemEl.current.offsetTop - 90,
      behavior: "smooth",
    });
    setListItem(el.title);
    setUpdateId(el.id);
    setUpdateIndex(i);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (updateId === "") {
      const folderId = currFolder === "Dashboard" ? null : currFolder;
      await axiosInstance.post(
        "/api/items",
        {
          title: listItem,
          folder: folderId,
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
      await getListData();
    } else {
      let update = listData[updateIndex];
      update.title = listItem;
      listData.splice(updateIndex, 1, update);
      setListData(listData);

      await axiosInstance.patch(
        `/api/items/${updateId}/`,
        {
          title: listItem,
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

      setUpdateId("");
      setUpdateIndex(undefined);
    }
    handleOverlayClick();
    itemEl.current.blur();
  };

  const handleChange = (e) => setListItem(e.target.value);

  const handleSelectChange = (e) => {
    setPage(1);
    setCurrFolder(e.target.value);
  };

  const contextData = {
    updateId,
    setUpdateId,
    updateIndex,
    setUpdateIndex,
    deleteId,
    setDeleteId,
    listItem,
    setListItem,
    settingOpen,
    setSettingOpen,
    dispatchItemDelete,
    setDispatchItemDelete,
    handleOverlayClick,
    handleCheckboxToggle,
    handleDelete,
    deleteItem,
    handleEdit,
    handleSave,
    handleChange,
    handleSelectChange,
    showAlert,
    setShowAlert,
    alertContent,
    setAlertContent,
  };

  return (
    <ListContext.Provider value={contextData}>{children}</ListContext.Provider>
  );
}
