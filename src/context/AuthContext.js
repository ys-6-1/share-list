import { createContext, useState } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios";

const AuthContext = createContext();

export default AuthContext;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    localStorage.getItem("access_token")
      ? jwt_decode(localStorage.getItem("access_token"))
      : null
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createUser = async (e) => {
    e.preventDefault();
    await axiosInstance.post(
      "/api/register/",
      {
        username: e.target.username.value.trim(),
        password: e.target.password.value.trim(),
        email: e.target.email.value.trim(),
        password2: e.target.password2.value.trim(),
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
    await loginUser(e);
  };

  const loginUser = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post(
        "api/token/",
        {
          username: e.target.username.value,
          password: e.target.password.value,
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

      if (response.status === 200) {
        const data = response.data;
        setUser(jwt_decode(data.access));
        localStorage.setItem("access_token", JSON.stringify(data.access));
        localStorage.setItem("refresh_token", JSON.stringify(data.refresh));
        navigate("/");
      }
    } catch (e) {
      alert("Something went wrong!");
    }
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  const deleteAccount = async () => {
    await axiosInstance.delete("/api/delete_account/", {
      headers: {
        Authorization: localStorage.getItem("access_token")
          ? `JWT ${String(localStorage.getItem("access_token"))}`
          : null,
        "Content-Type": "application/json",
        accept: "application/json",
      },
    });
  };

  const contextData = {
    createUser,
    loginUser,
    user,
    logoutUser,
    deleteAccount,
  };
  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
}
