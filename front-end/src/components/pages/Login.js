import React, { Component } from "react";
import "./Login.css";
import axios from "axios";

class Login extends Component {
  handleClick = async e => {
    const publicAddress = window.web3.eth.coinbase;
    let netId = await window.web3.version.network;

    // if no account found tell user to login to metamask
    if (publicAddress == null) {
      window.alert(
        'You must login to the chrome extension "metamask" to interact with the blockchain'
      );
    } else if (netId !== "3") {
      window.alert("You must select the Ropsten test network in metamask");
    } else {
      axios
        .get(`http://localhost:3001/api/getData${publicAddress}`)
        .then(res => this.handleRegistration(res, publicAddress));
    }
  };

  handleRegistration = async (res, publicAddress) => {
    // if account didn't exist in db, create one
    if (res.data === null) {
      axios
        .post(`http://localhost:3001/api/putData`, { publicAddress })
        .then(res => this.handleLogin(res.data.publicAddress, res.data.nonce));
    } else if (res.data.publicAddress === publicAddress) {
      this.handleLogin(res.data.publicAddress, res.data.nonce);
    }
  };

  handleLogin = async (publicAddress, nonce) => {
    window.web3.personal.sign(
      window.web3.fromUtf8(`Login key: ${nonce}`),
      publicAddress,
      (err, signature) => {
        if (err) {
          console.log(err);
        } else {
          axios
            .post(`http://localhost:3001/api/auth`, {
              publicAddress,
              signature
            })
            .then(res => localStorage.setItem("token", res.data)); //TODO: protect routes and use token on them, refactor code to work with new login, comment code, git commits
        }
      }
    );
  };

  render() {
    return (
      <React.Fragment>
        <div className="pageContainer">
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
