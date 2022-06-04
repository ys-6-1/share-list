import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function CreateUser() {
  const { createUser } = useContext(AuthContext);

  return (
    <div className="form form__login">
      <div className="form-container">
        <div className="form-top">
          <p>Welcome To ShareList</p>
          <p>Please register as a user</p>
        </div>
        <form className="form-content" onSubmit={createUser}>
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
            <input
              type="password"
              className="password2"
              placeholder="Password Confirmation"
              autoComplete="on"
              name="password2"
            />
          </div>
          <button className="form-submit-btn">Submit</button>
        </form>
        <Link to="/login" className="form-link">
          Log in
        </Link>
      </div>
    </div>
  );
}

export default CreateUser;
