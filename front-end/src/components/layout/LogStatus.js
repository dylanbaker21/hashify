import React from "react";
import PropTypes from "prop-types";
import "./Header.css";

const LogStatus = props => {
  const logOut = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const logiIn = () => {
    window.location.href = "/";
  };
  return (
    <div className={"loginDiv"}>
      {localStorage.getItem("token") ? (
        <div>
          <p>Logged in as: {props.getAddr(localStorage.getItem("token"))}</p>
          <button style={logOutButton} onClick={logOut}>
            Log Out
          </button>
        </div>
      ) : (
        <button style={logInButton} onClick={logiIn}>
          Log In
        </button>
      )}
    </div>
  );
};

const logOutButton = {
  background: "#8B0000",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  padding: "10px",
  cursor: "pointer",
  float: "middle",
  fontSize: "14px"
};

const logInButton = {
  background: "#0022DE",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  padding: "10px",
  cursor: "pointer",
  float: "middle",
  fontSize: "14px"
};

// PropTypes
LogStatus.propTypes = {
  getAddr: PropTypes.func
};

export default LogStatus;
