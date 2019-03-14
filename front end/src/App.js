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

  componentDidMount() {
    axios
      .get("http://localhost:3001/api/getData")
      .then(res => this.setState({ hashItems: res.data }));
  }
  // Add Hash
  addHash = input => {
    let output = keccak256(input);
    this.setState({ output });

    const newHashItem = {
      id: uuid.v4(),
      hash: output,
      fromAddress: null,
      tx: null
    };
    axios
      .post("http://localhost:3001/api/putData", { newHashItem })
      .then(res => this.setState({ hashItems: res.data }));
  };

  //Delete Hash
  deleteHash = id => {
    console.log(id);
    axios
      .delete(`http://localhost:3001/api/deleteData${id}`)
      .then(res => this.setState({ hashItems: res.data }));
  };

  hashToBlock = (output, id) => {
    const contract = window.web3.eth.contract(HASHIFY_ABI).at(HASHIFY_ADDRESS);

    let acct = window.web3.eth.coinbase;
    console.log("Sending from account: " + acct);
    console.log("Hash being sent: " + output);

    let formatOutput = "0x" + output;
    if (acct == null) {
      window.alert(
        'You must login to the chrome extension "metamask" to interact with the blockchain'
      );
    } else {
      contract.addHash(formatOutput, (error, result) => {
        if (!error) {
          console.log("Tx: " + result);
        }
        const updateHashItem = {
          id: id,
          fromAddress: acct,
          tx: result
        };
        axios
          .post("http://localhost:3001/api/updateData", updateHashItem)
          .then(res => this.setState({ hashItems: res.data }));
        setTimeout(() => {
          window.location.reload();
        }, 2000);
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
