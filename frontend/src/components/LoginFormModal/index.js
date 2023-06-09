import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBone,
  faCircleExclamation,
  faSquareXmark,
} from "@fortawesome/free-solid-svg-icons";
import { login } from "../../store/session";
import "./LoginForm.css";
import sublogo from "../../image/sublogo.jpeg";
import haru from "../../image/haru.jpeg";
import douding from "../../image/douding.jpeg";
import validateInput from "../../utils/validateInput";

function LoginFormModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redLabel, setshowRedLabel] = useState(false);
  const [errors, setErrors] = useState([]);
  const [inputValidate, setInputValidate] = useState([]);
  const [loginlabel, setloginLabel] = useState("loginForm-label ");
  const [errList, setErrList] = useState("form-error-msg ");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateInput({ email, password });
    if (errors.length) {
      setshowRedLabel(true);
      setInputValidate(errors);
    } else {
      setInputValidate([]);
      const data = await dispatch(login({ email, password }));
      setshowRedLabel(false);
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
    const errors = validateInput({ email, password });
    if (email.length && password.length && errors.length) {
      setshowRedLabel(true);
      setInputValidate(errors);
    } else {
      setInputValidate([]);

      setshowRedLabel(false);
    }
  }, [email, password]);
  useEffect(() => {
    if (errors.length || inputValidate.length) setshowRedLabel(true);
    else {
      setshowRedLabel(false);
    }
  }, [errors, inputValidate]);
  useEffect(() => {
    if (redLabel) {
      setloginLabel((prev) => prev + "red");
      setErrList((prev) => prev + "red");
    } else {
      setloginLabel("loginForm-label ");
      setErrList("form-error-msg ");
    }
  }, [redLabel]);

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
          <h1>Log In</h1>
          <img alt="my-dog" src={douding} className="dog-icon" />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-input-area">
            <div className="credential-input email">
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
              <label className={loginlabel} htmlFor="email">
                Email
              </label>
            </div>
            <div className="credential-input password">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              <label className={loginlabel} htmlFor="password">
                Password
              </label>
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
      </div>
      <div className="modal-content-right-section">
        <img alt="sublogo" src={sublogo} />
      </div>
    </div>
  );
}

export default LoginFormModal;
