import { createContext, useState, useRef, useContext } from "react";
import axiosInstance from "../axios";
import AuthContext from "./AuthContext";
import FolderContext from "./FolderContext";

const DataContext = createContext();

export default DataContext;

export function DataProvider({ children }) {
  const [currFolderObj, setCurrFolderObj] = useState({});
  const [activeTab, setActiveTab] = useState("All");
  const [listData, setListData] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [page, setPage] = useState(1);
  const [prevPage, setPrevPage] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [currFolder, setCurrFolder] = useState("Dashboard");
  const { logoutUser } = useContext(AuthContext);
  //   const { currFolder } = useContext(FolderContext);
  const getListData = async () => {
    let url = "";
    url += currFolderObj.is_active ? "/api/shared_items?" : "/api/items?";
    if (activeTab === "All") url += `&option=all`;
    if (activeTab === "Pending") url += `&option=pending`;
    if (activeTab === "Done") url += `&option=done`;
    if (currFolder !== "Dashboard") url += `&folder=${currFolder}`;
    url += `&page=${page}`;

    try {
      const response = await axiosInstance.get(url, {
        headers: {
          Authorization: localStorage.getItem("access_token")
            ? `JWT ${String(localStorage.getItem("access_token"))}`
            : null,
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });
      const parsedData = response.data;
      if (response.status === 200) {
        setListData(parsedData.results);
        setCheckedItems(parsedData.results.filter((el) => el.is_done));
        setNextPage(parsedData.has_next);
        setPrevPage(parsedData.has_previous);
      }
    } catch (e) {
      logoutUser();
    }
  };

  const contextData = {
    getListData,
    currFolderObj,
    setCurrFolderObj,
    activeTab,
    setActiveTab,
    listData,
    setListData,
    checkedItems,
    setCheckedItems,
    page,
    setPage,
    prevPage,
    setPrevPage,
    nextPage,
    setNextPage,
    currFolder,
    setCurrFolder,
  };
  return (
    <DataContext.Provider value={contextData}>{children}</DataContext.Provider>
  );
}
