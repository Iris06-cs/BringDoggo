import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { login, logout } from "../../store/session";
import { NavLink, useHistory } from "react-router-dom";

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
    // after user login make sure drop down menu close
    if (user) setShowMenu(false);
  }, [user]);

  const handleLogout = async (e) => {
    e.preventDefault();
    await dispatch(logout());
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
            <li>
              {user.firstname} {user.lastname[0]}.
            </li>
            <li>{user.email}</li>
            <li>
              <NavLink to="/users/current/profile">About me</NavLink>
            </li>
            <li>
              <NavLink to="/users/current/favorites">Favorites</NavLink>
            </li>
            <li>
              <NavLink to="/users/current/reviews">Reviews</NavLink>
            </li>
            <li id="logout-btn-container">
              <button onClick={handleLogout} id="logout-btn">
                <FontAwesomeIcon icon="fa-solid fa-arrow-right-from-bracket" />
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
                <FontAwesomeIcon icon="fa-solid fa-bone" />
              </button>
            </li>
          </ul>
        </>
      )}
    </>
  );
}

export default ProfileButton;
