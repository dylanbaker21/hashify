import React, { Component } from "react";
import axios from "axios";

import MetaMaskPic from "../../public/download-metamask-dark.png";
import "./Login.css";

class Login extends Component {
  handleClick = async () => {
    // Modern dapp browsers
    if (window.ethereum) {
      try {
        // Request account access
        await window.ethereum.enable();
        // Acccounts now exposed
        const publicAddress = window.ethereum.selectedAddress;
        const netId = await window.ethereum.networkVersion;

        // If Ropsten is not the active network
        if (netId !== "3") {
          window.alert(
            "You must switch to the Ropsten test network in MetaMask"
          );
        }
        // Check the database for the user's address and send return data to handleRegistration
        else {
          axios
            .get(`http://165.22.228.25:3001/api/getUserData${publicAddress}`)
            .then(res => this.handleRegistration(res, publicAddress));
        }
      } catch (error) {
        // User denied account access
        console.log(error);
      }
    }
    // Legacy dapp browsers
    else if (window.web3) {
      window.alert(
        "Please update MetaMask or use a dApp browser compatible with EIP-1102"
      );
    }
    // Non-dapp browsers
    else {
      let willDownload = await window.confirm(
        'The browser extension "MetaMask" is needed to use this app. Click "OK" to download.'
      );
      if (willDownload) {
        window.open("https://www.metamask.io", "_blank");
      }
    }
  };

  handleRegistration = async (res, publicAddress) => {
    // If account doesn't exist in database, create one then handleLogin
    if (res.data.address === null) {
      axios
        .post(`http://165.22.228.25:3001/api/addUser`, { publicAddress })
        .then(res => this.handleLogin(res.data.publicAddress, res.data.nonce));
    }
    // If account does exist handleLogin
    else if (res.data.address === publicAddress) {
      this.handleLogin(res.data.address, res.data.nonce);
    }
  };

  handleLogin = async (publicAddress, nonce) => {
    // Sign login message
    window.web3.personal.sign(
      window.web3.fromUtf8(`Login key: ${nonce}`),
      publicAddress,
      (err, signature) => {
        if (err) {
          console.log("User Denied Message Signature");
        }
        // Send signature to backend for verification and authentication
        else {
          axios
            .post(`http://165.22.228.25:3001/api/auth`, {
              publicAddress,
              signature
            })
            .then(res => localStorage.setItem("token", res.data)) // Set JWT auth token to local storage
            .then(res => (window.location.href = "/home")); // Open the home page
        }
      }
    );
  };

  render() {
    return (
      <React.Fragment>
        <div className="pageContainer">
          <a href={"https://www.metamask.io"} target={"_blank"}>
            <img
              src={MetaMaskPic}
              alt={"Click here to download metamask"}
              className={"loginMetamask"}
            />
          </a>
          <div className="content">
            <h1>Hashify</h1>
            <button className="loginButton" onClick={this.handleClick}>
              Login with MetaMask
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Login;
