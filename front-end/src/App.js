import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import About from "./components/pages/About";
import AddHashes from "./components/AddHash";
import Hashes from "./components/Hashes";
import uuid from "uuid";
import axios from "axios";
import { keccak256 } from "js-sha3";
import { HASHIFY_ABI, HASHIFY_ADDRESS } from "./ContractData";
import "./App.css";

class App extends Component {
  state = {
    output: "",
    hashItems: []
  };

  // when component mounts get all hash items and set to state
  componentDidMount() {
    axios
      .get("http://localhost:3001/api/getData")
      .then(res => this.setState({ hashItems: res.data }));
  }

  // take text input and output the hash
  addHash = input => {
    // hash the input and set output to state
    let output = keccak256(input);
    this.setState({ output });

    // create a hash item
    const newHashItem = {
      id: uuid.v4(),
      hash: output,
      fromAddress: null,
      tx: null
    };

    // post hash item to database and set the return value (all items) to state
    axios
      .post("http://localhost:3001/api/putData", { newHashItem })
      .then(res => this.setState({ hashItems: res.data }));
  };

  // takes hash item id (id we create with uuid not database _id)
  // and deletes from database then updates state
  deleteHash = id => {
    console.log(id);
    axios
      .delete(`http://localhost:3001/api/deleteData${id}`)
      .then(res => this.setState({ hashItems: res.data }));
  };

  // sends a hash item to the ethereum blockchain and updates db
  hashToBlock = (output, id) => {
    // pass in contract ABI and address to create instance
    const contract = window.web3.eth.contract(HASHIFY_ABI).at(HASHIFY_ADDRESS);

    // get first address in metamask account
    let acct = window.web3.eth.coinbase;
    console.log("Sending from account: " + acct);
    console.log("Hash being sent: " + output);

    // prepend 0x to the hash as per ethereum formatting
    let formatOutput = "0x" + output;

    // if no account found tell user to login to metamask
    if (acct == null) {
      window.alert(
        'You must login to the chrome extension "metamask" to interact with the blockchain'
      );
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
            .then(res => this.setState({ hashItems: res.data }));
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
            <Header />
            <Route
              exact
              path="/"
              render={props => (
                <React.Fragment>
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
            <Route path="/about" component={About} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
