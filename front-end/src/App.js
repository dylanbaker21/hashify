import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./components/layout/Header";
import About from "./components/pages/About";
import AddHashes from "./components/AddHash";
import Hashes from "./components/Hashes";
import Login from "./components/pages/Login";
import Page404 from "./components/pages/Page404";
import uuid from "uuid";
import axios from "axios";
import { keccak256 } from "js-sha3";
import { HASHIFY_ABI, PROXY_ADDRESS } from "./ContractData";
import "./App.css";

class App extends Component {
  state = {
    output: "",
    hashItems: []
  };

  componentDidMount() {
    // get JWT auth token from storage
    let token = localStorage.getItem("token");
    // if token exists pull the address from it and get hashes from database then set state
    if (token) {
      let publicAddress = this.getAddr(token);
      axios
        .get(`http://localhost:3001/api/getHashes${publicAddress}`, {
          headers: { Authorization: "Bearer " + token }
        })
        .then(res => this.setState({ hashItems: res.data.hashes }));
    }
  }

  // get address from JWT auth token
  getAddr = token => {
    // split the token into 3 at each "." and select 2nd one
    let base64Url = token.split(".")[1];
    // re-format and parse
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    let payload = JSON.parse(window.atob(base64));
    // return address
    return payload.payload.address;
  };

  // take text input and output the hash
  addHash = input => {
    // hash the input and set output to state
    let output = keccak256(input);
    this.setState({ output });

    // fetch token from storage and retrieve address
    let token = localStorage.getItem("token");
    let publicAddy = this.getAddr(token);

    // create a hash item
    const newHashItem = {
      publicAddress: publicAddy,
      id: uuid.v4(),
      hash: output,
      tx: null
    };
    // post hash item to database and set the return value (all items) to state
    axios
      .post(
        "http://localhost:3001/api/putHash",
        { newHashItem },
        {
          headers: { Authorization: "Bearer " + token }
        }
      )
      .then(res => this.componentDidMount());
  };

  // takes hash item id (id we create with uuid not database _id)
  // and deletes from database then refresh state
  deleteHash = id => {
    // fetch token from storage and retrieve address
    let token = localStorage.getItem("token");
    let address = this.getAddr(token);

    // create payload
    const data = {
      address,
      id
    };
    // auth header
    const headers = { Authorization: "Bearer " + token };

    axios
      .delete(`http://localhost:3001/api/deleteHash`, {
        headers,
        data
      })
      .then(res => this.componentDidMount());
  };

  // sends a hash item to the ethereum blockchain and updates database
  hashToBlock = async (output, id) => {
    // pass in contract ABI and address to create instance
    const contract = window.web3.eth.contract(HASHIFY_ABI).at(PROXY_ADDRESS);

    // Request account access
    await window.ethereum.enable();

    // get address and current network
    const acct = window.ethereum.selectedAddress;
    let netId = await window.etheruem.networkVersion;

    // prepend 0x to the hash as per ethereum formatting
    let formatOutput = "0x" + output;

    // if no account found tell user to login to metamask
    if (acct == null) {
      window.alert(
        'You must login to the chrome extension "metamask" to interact with the blockchain'
      );
    } else if (netId !== "3") {
      window.alert("You must select the Ropsten test network in metamask");
    }
    // if account found submit hash to contract and update database
    else {
      // calling smart contract function
      contract.addHash(formatOutput, (error, result) => {
        if (!error) {
          console.log("Tx: " + result);

          // create hash item update with ethereum fromAddress and tx hash
          const updateHashItem = {
            id: id,
            fromAddress: acct,
            tx: result
          };

          // update database then set state and refresh page after 2 seconds
          // TODO: fix refresh page issue and have it auto update state
          axios
            .post("http://localhost:3001/api/updateData", updateHashItem)
            .then(res => this.setState({ hashItems: res.data.hashes }));
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      });
    }
  };

  render() {
    return (
      <Router>
        <div className="App">
          <div className="container">
            <Switch>
              <Route
                path="/home"
                render={props => (
                  <React.Fragment>
                    <Header />
                    <AddHashes
                      addHash={this.addHash}
                      output={this.state.output}
                    />
                    <Hashes
                      hashItems={this.state.hashItems}
                      output={this.state.output}
                      hashToBlock={this.hashToBlock}
                      deleteHash={this.deleteHash}
                    />
                  </React.Fragment>
                )}
              />
              <Route exact path="/" component={Login} />
              <Route path="/about" component={About} />
              <Route component={Page404} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
