/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

import "./login.css";

const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const onLoginClick = async () => {
    try {
      await signInWithEmailAndPassword(auth, username, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div>
        <div className="loginlogo">midreads.</div>
      </div>
      <br />
      <div>
        <input
          value={username}
          placeholder="Enter your email here"
          onChange={(ev) => setUsername(ev.target.value)}
          className="inputbox"
        />
      </div>
      <br />
      <div>
        <input
          type="password"
          value={password}
          placeholder="Enter your password here"
          onChange={(ev) => setPassword(ev.target.value)}
          className="inputbox"
        />
      </div>
      <br />
      <div>
        <input
          type="button"
          onClick={onLoginClick}
          value={"log in."}
          className="button"
        />
      </div>
      <div>
        <input
          type="button"
          onClick={() => {
            navigate("/createaccount");
          }}
          value={"new account."}
          className="button"
          style={{ marginTop: 4 + "em" }}
        />
      </div>
    </div>
  );
};

export default Login;
