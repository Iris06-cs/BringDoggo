import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";

import { login } from "../../store/session";
import "./LoginForm.css";
import sublogo from "../../image/sublogo.png";
import haru from "../../image/haru.png";
import douding from "../../image/douding.png";
import validateInput from "../../utils/validateInput";

function LoginFormModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redLabel, setshowRedLabel] = useState(false);
  const [errors, setErrors] = useState([]);
  const [inputValidate, setInputValidate] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateInput({ email, password });
    if (errors.length) {
      setshowRedLabel(true);
      setInputValidate(errors);
    } else {
      setInputValidate([]);
      const data = await dispatch(login({ email, password }));
      if (data.error) {
        setshowRedLabel(true);
        setErrors(data.payload.errors);
      } else {
        closeModal();
      }
    }
  };
  const loginlabel = "loginForm-label " + (redLabel ? "red" : "");
  const errList = "form-error-msg " + (redLabel ? "red" : "");
  return (
    <div className="modal-content-container">
      <div className="modal-content-left-section">
        <div className="title-container">
          <button onClick={closeModal} className="close-modal-button">
            <i className="fas fa-times-circle"></i>
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
                // required
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
                // required
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
                    <i className="fas fa-exclamation-circle"></i>
                  </span>
                  {error}
                </li>
              ))}
            {errors &&
              errors.map((error, idx) => (
                <li key={idx}>
                  <span style={{ color: "#dd0a35", padding: "5px" }}>
                    <i className="fas fa-exclamation-circle"></i>
                  </span>
                  {error}
                </li>
              ))}
          </ul>
          <button type="submit" className="login-signup-btn">
            <span id="login-text">Submit</span>
            <i className="fas fa-bone"></i>
          </button>
        </form>
      </div>
      <div className="modal-contect-right-section">
        <img alt="sublogo" src={sublogo} />
      </div>
    </div>
  );
}

export default LoginFormModal;
