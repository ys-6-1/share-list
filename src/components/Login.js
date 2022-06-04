import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function Login() {
  const { loginUser } = useContext(AuthContext);

  return (
    <div className="form form__login">
      <div className="form-container">
        <div className="form-top">
          <p>Welcome To ShareList</p>
          <p>Please login</p>
        </div>
        <form className="form-content" onSubmit={loginUser}>
          <input
            type="email"
            className="email"
            placeholder="Email"
            autoComplete="on"
            name="email"
          />
          <input
            type="text"
            className="username"
            placeholder="User name"
            autoComplete="on"
            name="username"
          />
          <div className="password-container">
            <input
              type="password"
              className="password1"
              placeholder="Password"
              autoComplete="on"
              name="password"
            />
          </div>
          <button className="form-submit-btn">Submit</button>
        </form>
        <Link to="/create" className="form-link">
          Create Account
        </Link>
      </div>
    </div>
  );
}

export default Login;
