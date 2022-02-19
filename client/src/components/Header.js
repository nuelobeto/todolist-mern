import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";

function Header() {
  const { user, logout } = useContext(GlobalContext);
  const { pathname } = useLocation();

  return (
    <div className="main-header">
      <div className="main-header__inner">
        <div className="main-header__left">
          <Link to="/">Todo List</Link>
        </div>

        <div className="main-header__right">
          {user && (
            <p
              style={{
                display: "inline-block",
                marginRight: "16px",
                color: "grey",
              }}
            >
              {user.name}
            </p>
          )}
          {user ? (
            <button className="btn" onClick={logout}>
              Logout
            </button>
          ) : pathname === "/" ? (
            <Link to="/register" className="btn">
              Register
            </Link>
          ) : (
            <Link to="/" className="btn">
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
