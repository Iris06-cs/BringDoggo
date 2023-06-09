import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBone,
  faCircleExclamation,
  faSquareXmark,
} from "@fortawesome/free-solid-svg-icons";
import { signUp } from "../../store/session";
import "./SignupForm.css";
import sublogo from "../../image/sublogo.jpeg";
import haru from "../../image/haru.jpeg";
import douding from "../../image/douding.jpeg";
import validateInput from "../../utils/validateInput";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
function SignupFormModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [redLabel, setshowRedLabel] = useState(false);
  const [errors, setErrors] = useState([]);
  const [inputValidate, setInputValidate] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateInput({
      firstname,
      lastname,
      username,
      email,
      password,
      confirmPassword,
    });
    if (errors.length) {
      setshowRedLabel(true);
      setInputValidate(errors);
    } else {
      setInputValidate([]);
      const data = await dispatch(
        signUp({ username, email, password, lastname, firstname })
      );
      if (data.error) {
        setshowRedLabel(true);
        setErrors(data.payload.errors);
      } else {
        setshowRedLabel(false);
        closeModal();
      }
    }
  };
  useEffect(() => {
    const errors = validateInput({
      firstname,
      lastname,
      username,
      email,
      password,
      confirmPassword,
    });
    if (
      firstname.length &&
      lastname.length &&
      username.length &&
      email.length &&
      password.length &&
      confirmPassword.length &&
      errors.length
    ) {
      setshowRedLabel(true);
      setInputValidate(errors);
    } else {
      setInputValidate([]);
      setshowRedLabel(false);
    }
  }, [confirmPassword, password, email, firstname, lastname, username]);
  useEffect(() => {
    if (errors.length || inputValidate.length) setshowRedLabel(true);
    else {
      setshowRedLabel(false);
    }
  }, [errors, inputValidate]);
  const inputLabel = "input-label " + (redLabel ? "red" : "");
  const errList = "form-error-msg signup " + (redLabel ? "red" : "");
  return (
    <div className="modal-content-container">
      <div className="modal-content-left-section">
        <div className="title-container">
          <button onClick={closeModal} className="close-modal-button">
            <FontAwesomeIcon
              icon={faSquareXmark}
              className="close-modal-btn-icon"
            />
          </button>
          <img alt="my-dog" src={haru} className="dog-icon" />
          <h1>Sign Up</h1>
          <img alt="my-dog" src={douding} className="dog-icon" />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-input-area">
            <div className="row-input-container name">
              <div className="input-container">
                <input
                  id="firstname"
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  placeholder="Firstname"
                />
                <label className={inputLabel} htmlFor="firstname">
                  Firstname
                </label>
              </div>
              <div className="input-container">
                <input
                  id="lastname"
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  placeholder="Lastname"
                />
                <label className={inputLabel} htmlFor="lastname">
                  Lastname
                </label>
              </div>
            </div>
            <div className="row-input-container email">
              <div className="input-container">
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                />
                <label className={inputLabel} htmlFor="username">
                  Username
                </label>
              </div>
              <div className="input-container">
                <input
                  id="signup-email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                />
                <label className={inputLabel} htmlFor="signup-email">
                  Email
                </label>
              </div>
            </div>
            <div className="row-input-container">
              <div className="input-container">
                <input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
                <label className={inputLabel} htmlFor="signup-password">
                  Password
                </label>
              </div>
              <div className="input-container">
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                />
                <label className={inputLabel} htmlFor="confirm-password">
                  Confirm Password
                </label>
              </div>
            </div>
          </div>
          <ul className={errList}>
            {inputValidate &&
              inputValidate.map((error, idx) => (
                <li key={idx}>
                  <span style={{ color: "#dd0a35", padding: "5px" }}>
                    <FontAwesomeIcon icon={faCircleExclamation} />
                  </span>
                  {error}
                </li>
              ))}
            {errors &&
              errors.map((error, idx) => (
                <li key={idx}>
                  <span style={{ color: "#dd0a35", padding: "5px" }}>
                    <FontAwesomeIcon icon={faCircleExclamation} />
                  </span>
                  {error}
                </li>
              ))}
          </ul>

          <button type="submit" className="login-signup-btn">
            <span id="login-text">Submit</span>
            <FontAwesomeIcon icon={faBone} />
          </button>
        </form>
        <div className="signup-confirm-text">
          <p>Already on BringDoggo?</p>
          <OpenModalButton
            buttonText="Log In"
            // onItemClick={closeMenu}
            modalComponent={<LoginFormModal />}
          />
        </div>
      </div>
      <div className="modal-content-right-section">
        <img alt="sublogo" src={sublogo} />
      </div>
    </div>
  );
}

export default SignupFormModal;
