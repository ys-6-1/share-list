import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./style/Index.scss";
import App from "./App";
import Login from "./components/Login";
import CreateUser from "./components/CreateUser";
import PrivateRoute from "./utils/PrivateRoute";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./context/AuthContext";
import { FolderProvider } from "./context/FolderContext";
import { ListProvider } from "./context/ListContext";
import { DataProvider } from "./context/DataContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <DataProvider>
                  <FolderProvider>
                    <ListProvider>
                      <App />
                    </ListProvider>
                  </FolderProvider>
                </DataProvider>
              </PrivateRoute>
            }
          />
          <Route path="/create" element={<CreateUser />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
