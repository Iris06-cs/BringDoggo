import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import SearchBar from "./SearchBar";
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
        <div>
          <NavLink exact to="/about">
            About
          </NavLink>
        </div>
        {/* other features */}
        {/* <div>Places</div>
        <div>Events</div> */}
      </div>
      <div className="nav-middle-section">
        <SearchBar />
      </div>
      {isLoaded && (
        <div className="nav-right-section">
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </nav>
  );
}

export default Navigation;
