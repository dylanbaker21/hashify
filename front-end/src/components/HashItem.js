import React, { Component } from "react";
import PropTypes from "prop-types";
import SubmitHash from "./SubmitHash";

// this class handles the display/properties of
// the individual hash items created in Hashes.js
export class HashItem extends Component {
  getStyle = () => {
    return {
      background: "#f4f4f4",
      padding: "10px",
      borderBottom: "1px #ccc dotted"
    };
  };

  // links to the etherscan transaction of a submitted hash
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
        <p style={{ wordWrap: "break-word" }}>
          <b>Keccak256 Hash:</b> {this.props.hash}
        </p>
        {this.props.tx !== null ? ( //if there's a tx show etherscan button
          <button style={etherscanBtnStyle} onClick={this.etherscanPortal}>
            View on Etherscan
          </button>
        ) : (
          //else no tx then show button to submit to blockchain
          <SubmitHash
            hashToBlock={this.props.hashToBlock}
            id={this.props.id}
            hash={this.props.hash}
          />
        )}
        <button
          style={delBtnStyle}
          onClick={this.props.deleteHash.bind(this, this.props.id)}
        >
          Delete
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

const etherscanBtnStyle = {
  background: "#0022DE",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  padding: "10px",
  margin: "0px 0px 10px 10px",
  cursor: "pointer",
  float: "middle",
  fontSize: "14px"
};

const delBtnStyle = {
  background: "#8B0000",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  padding: "10px",
  margin: "0px 0px 10px 10px",
  cursor: "pointer",
  float: "middle",
  fontSize: "14px"
};

export default HashItem;
