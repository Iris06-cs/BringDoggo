import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import logo from "../../image/logonav.png";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <nav className="nav-container">
      <div className="nav-left-section">
        <div>
          <NavLink exact to="/">
            <img alt="logo" src={logo} className="main-logo" />
          </NavLink>
        </div>

        <div>
          <NavLink exact to="/restaurants">
            Restaurants
          </NavLink>
        </div>
      </div>
      <div className="nav-middle-section">searchbar</div>
      {isLoaded && (
        <div className="nav-right-section">
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </nav>
  );
}

export default Navigation;
