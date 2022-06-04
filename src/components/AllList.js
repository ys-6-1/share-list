import React, { useEffect, useContext, useRef } from "react";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faTrashCan,
  faPenToSquare,
  faCircleChevronRight,
  faCircleChevronLeft,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import FolderContext from "../context/FolderContext";
import axiosInstance from "../axios";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ListContext from "../context/ListContext";
import DataContext from "../context/DataContext";

function AllList() {
  const itemEl = useRef(null);
  const { folderData } = useContext(FolderContext);
  const {
    dispatchItemDelete,
    deleteItem,
    setShowAlert,
    setDispatchItemDelete,
    handleSelectChange,
    handleChange,
    listItem,
    handleOverlayClick,
    handleCheckboxToggle,
    setSettingOpen,
    settingOpen,
    handleDelete,
    setListItem,
    updateId,
    setUpdateId,
    setUpdateIndex,
    updateIndex,
  } = useContext(ListContext);
  const {
    page,
    activeTab,
    getListData,
    setActiveTab,
    setPage,
    listData,
    checkedItems,
    setListData,
    prevPage,
    nextPage,
    setCurrFolderObj,
    currFolder,
  } = useContext(DataContext);

  useEffect(() => {
    getListData();
  }, [page, activeTab, currFolder]);

  useEffect(() => {
    if (dispatchItemDelete === true) {
      deleteItem();
      setShowAlert(false);
      setDispatchItemDelete(false);
    }
  }, [dispatchItemDelete]);

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

  return (
    <div className="list-global-container">
      <div className="list-top-container">
        <div className="folder">
          <FormControl variant="standard" sx={{ m: 1, minWidth: "50%" }}>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={currFolder}
              onChange={handleSelectChange}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem
                value={"Dashboard"}
                onClick={() => setCurrFolderObj({})}
              >
                Dashboard
              </MenuItem>
              {folderData.map((el) => (
                <MenuItem
                  key={el.title}
                  value={el.id}
                  onClick={() => setCurrFolderObj(el)}
                >
                  {el.title}{" "}
                  {(el.is_active || el.is_shared) && (
                    <FontAwesomeIcon
                      className="shared-icon"
                      icon={faUserGroup}
                    />
                  )}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <form onSubmit={handleSave}>
          <input
            type="text"
            className="input item-input"
            placeholder="Add new item"
            onChange={handleChange}
            ref={itemEl}
            value={listItem || ""}
          />
        </form>

        <div className="options">
          <div
            className={
              activeTab === "All"
                ? "options-all tab tab-active"
                : "options-all tab tab-disabled"
            }
            onClick={() => {
              setActiveTab("All");
              setPage(1);
            }}
          >
            All
          </div>
          <div
            className={
              activeTab === "Pending"
                ? "options-pending tab tab-active"
                : "options-pending tab tab-disabled"
            }
            onClick={() => {
              setActiveTab("Pending");
              setPage(1);
            }}
          >
            Pending
          </div>
          <div
            className={
              activeTab === "Done"
                ? "options-done tab tab-active"
                : "options-done tab tab-disabled"
            }
            onClick={() => {
              setActiveTab("Done");
              setPage(1);
            }}
          >
            Done
          </div>
        </div>
        <div
          className="overlay overlay--input"
          onClick={handleOverlayClick}
        ></div>
      </div>
      <div className="list-container">
        {listData.length > 0 && (
          <table className="list">
            <tbody>
              {listData.map((el, i) => (
                <tr className="checkbox-container" key={el.id}>
                  <td className="hover-container">
                    <label className="checkbox-group">
                      <div className="chexkbox-column">
                        <input
                          type="checkbox"
                          className="checkbox"
                          checked={checkedItems.some(
                            (item) => item.id === el.id
                          )}
                          name="checkbox"
                          onChange={(e) => {
                            handleCheckboxToggle(e, el, i);
                          }}
                        />
                        <div className="custom-checkbox"></div>
                        <div className="custom-checkmark"></div>
                        <div className="description-column">
                          <p>{el.title}</p>
                          <p>{format(new Date(el.updated_at), "MMM d, y")}</p>
                        </div>
                      </div>
                    </label>
                  </td>
                  <td className="item-setting">
                    <FontAwesomeIcon
                      icon={faEllipsis}
                      className="setting-icon"
                      onClick={() => {
                        setSettingOpen(el.id);
                      }}
                    />
                    {settingOpen === el.id && (
                      <>
                        <div
                          className="overlay overlay--local"
                          onClick={handleOverlayClick}
                        ></div>
                        <div className="setting-container">
                          <div className="setting-content">
                            <div
                              className="icon-container"
                              onClick={() => handleEdit(el, i)}
                            >
                              <FontAwesomeIcon
                                className="fa_icon"
                                icon={faPenToSquare}
                              />
                              Edit
                            </div>
                            <div
                              className="icon-container"
                              onClick={() => handleDelete(el, i)}
                            >
                              <FontAwesomeIcon
                                className="fa_icon"
                                icon={faTrashCan}
                              />
                              Delete
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {listData.length === 0 && (
          <p className="no-item">The folder currently contains no items</p>
        )}
        {listData.length > 0 && (
          <div className="pagination">
            <div>
              {prevPage ? (
                <FontAwesomeIcon
                  icon={faCircleChevronLeft}
                  className="paginate paginate-active"
                  onClick={() => setPage(page - 1)}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faCircleChevronLeft}
                  className="paginate paginate-disabled"
                />
              )}
            </div>
            <div>{page}</div>
            <div>
              {nextPage ? (
                <FontAwesomeIcon
                  icon={faCircleChevronRight}
                  className="paginate paginate-active"
                  onClick={() => setPage(page + 1)}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faCircleChevronRight}
                  className="paginate paginate-disabled"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllList;
