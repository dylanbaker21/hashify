import React from "react";
import { Link } from "react-router-dom";
import MetaMaskPic from "../../public/download-metamask-dark.png";
import "./Header.css";

export default function Header() {
  return (
    <header style={headerStyle}>
      <a href={"https://www.metamask.io"} target={"_blank"}>
        <img
          src={MetaMaskPic}
          alt={"Click here to download metamask"}
          className={"metamask"}
        />
      </a>
      <h1>Hashify</h1>
      <Link style={linkStyle} to="/home">
        Home
      </Link>{" "}
      |{" "}
      <Link style={linkStyle} to="/about">
        About
      </Link>
    </header>
  );
}

const headerStyle = {
  background: "#333",
  color: "#fff",
  textAlign: "center",
  padding: "10px"
};

const linkStyle = {
  color: "#fff",
  textDecoration: "none"
};
