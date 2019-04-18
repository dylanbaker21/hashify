import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import LogStatus from "./LogStatus";
import MetaMaskPic from "../../public/download-metamask-dark.png";
import "./Header.css";

const Header = props => {
  return (
    <header className={"header"}>
      <div className={"metamaskDiv"}>
        <a href={"https://www.metamask.io"} target={"_blank"}>
          <img
            src={MetaMaskPic}
            alt={"Click here to download metamask"}
            className={"metamask"}
          />
        </a>
      </div>
      <div className={"headerText"}>
        <h1>Hashify</h1>
        <Link className={"linkStyle"} to="/home">
          Home
        </Link>{" "}
        |{" "}
        <Link className={"linkStyle"} to="/about">
          About
        </Link>
      </div>
      <LogStatus getAddr={props.getAddr} />
    </header>
  );
};

// PropTypes
Header.propTypes = {
  getAddr: PropTypes.func.isRequired
};

export default Header;
