import "./style/App.scss";
import React, { useContext } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import Alert from "./components/Alert";
import SlideMenu from "./components/SlideMenu";
import FolderHandler from "./components/FolderHandler";
import FolderContext from "./context/FolderContext";
import ListContext from "./context/ListContext";

const testTheme = createTheme({
  typography: {
    fontSize: 22,
    allVariants: {
      color: "#1a2027",
    },
  },
  palette: {
    primary: {
      main: "#00ccd3",
    },
  },
});

function App() {
  // const [showAlert, setShowAlert] = useState(false);
  // const [alertContent, setAlertContent] = useState(null);
  // const [dispatchItemDelete, setDispatchItemDelete] = useState(false);
  const { modalOpen } = useContext(FolderContext);
  const { showAlert, setShowAlert, alertContent, setAlertContent } =
    useContext(ListContext);
  return (
    <ThemeProvider theme={testTheme}>
      {showAlert && (
        <Alert
          showAlert={showAlert}
          setShowAlert={setShowAlert}
          // setDispatchItemDelete={setDispatchItemDelete}
          alertContent={alertContent}
          setAlertContent={setAlertContent}
        />
      )}
      {modalOpen && <FolderHandler />}
      <div className="App">
        <Header />
        <input type="checkbox" className="nav__checkbox" id="nav__toggle" />
        <label htmlFor="nav__toggle" className="nav__button">
          <span className="nav__icon">&nbsp;</span>
        </label>
        <SlideMenu />
        <Dashboard
        // setShowAlert={setShowAlert}
        // dispatchItemDelete={dispatchItemDelete}
        // setDispatchItemDelete={setDispatchItemDelete}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
