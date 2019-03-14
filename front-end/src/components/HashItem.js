import React, { Component } from "react";
import PropTypes from "prop-types";
import SubmitHash from "./SubmitHash";

export class HashItem extends Component {
  getStyle = () => {
    return {
      background: "#f4f4f4",
      padding: "10px",
      borderBottom: "1px #ccc dotted"
      //textDecoration: this.props.todo.completed ? "line-through" : "none"
    };
  };

  etherscanPortal = () => {
    window.open(`https://ropsten.etherscan.io/tx/${this.props.tx}`);
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.hashToBlock(this.props.output);
  };

  render() {
    return (
      <div style={this.getStyle()}>
        <p>
          <b>Keccak256 Hash:</b> {this.props.hash}
        </p>
        {this.props.tx !== null ? (
          <button style={btnStyle} onClick={this.etherscanPortal}>
            View on Etherscan
          </button>
        ) : (
          <SubmitHash
            hashToBlock={this.props.hashToBlock}
            id={this.props.id}
            hash={this.props.hash}
          />
        )}
        <button
          style={btnStyle2}
          onClick={this.props.deleteHash.bind(this, this.props.id)}
        >
          Delete Hash
        </button>
      </div>
    );
  }
}

// PropTypes
HashItem.propTypes = {
  id: PropTypes.string.isRequired,
  deleteHash: PropTypes.func.isRequired,
  hash: PropTypes.string.isRequired,
  tx: PropTypes.string,
  from: PropTypes.string,
  hashToBlock: PropTypes.func.isRequired
};

const btnStyle = {
  background: "#0022DE",
  color: "#fff",
  border: "none",
  padding: "5px 10px",
  margin: "0px 0px 0px 20px",
  cursor: "pointer",
  float: "middle"
};

const btnStyle2 = {
  background: "#8B0000",
  color: "#fff",
  border: "none",
  padding: "5px 10px",
  margin: "0px 0px 0px 20px",
  cursor: "pointer",
  float: "middle"
};

export default HashItem;
