import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faBone,
} from "@fortawesome/free-solid-svg-icons";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { login, logout } from "../../store/session";
import { NavLink, useHistory } from "react-router-dom";
import { getCurrentUserFavs } from "../../store/favorites";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  useEffect(() => {
    if (user) setShowMenu(false);
  }, [user]);

  const handleLogout = async (e) => {
    e.preventDefault();
    await dispatch(logout());
    await dispatch(getCurrentUserFavs());
    history.push("/");
  };
  const closeMenu = () => setShowMenu(false);
  const demoUserLogin = () => {
    const credential = {
      email: "demo@aa.io",
      password: "password",
    };
    dispatch(login(credential));
    closeMenu();
  };
  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      {user ? (
        <>
          <button onClick={openMenu} id="user-profile-btn">
            {user.profileImage ? (
              <img
                alt="user-profile"
                src={user.profileImage}
                id="user-profile-icon"
              />
            ) : (
              <i className="fas fa-user-circle default-user-icon" />
            )}
          </button>
          <ul className={ulClassName} ref={ulRef} id="dropdown-menu">
            {/* <li>
              {user.firstname} {user.lastname[0]}.
            </li>
            <li>{user.email}</li> */}
            <li>
              <NavLink to="/users/current/profile" onClick={closeMenu}>
                About me
              </NavLink>
            </li>
            <li>
              <NavLink to="/users/current/favorites" onClick={closeMenu}>
                Favorites
              </NavLink>
            </li>
            <li>
              <NavLink to="/users/current/reviews" onClick={closeMenu}>
                Reviews
              </NavLink>
            </li>
            <li id="logout-btn-container">
              <button onClick={handleLogout} id="logout-btn">
                <FontAwesomeIcon icon={faArrowRightFromBracket} />
                Log Out
              </button>
            </li>
          </ul>
        </>
      ) : (
        <>
          <ul className="login-signup-demo-btn-container">
            <li className="button-container login">
              <OpenModalButton
                buttonText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
            </li>
            <li className="button-container signup">
              <OpenModalButton
                buttonText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </li>
            <li className="button-container">
              <button className="modalButton" onClick={demoUserLogin}>
                Demo
                <FontAwesomeIcon icon={faBone} />
              </button>
            </li>
          </ul>
        </>
      )}
    </>
  );
}

export default ProfileButton;
