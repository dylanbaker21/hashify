import React, { Component } from "react";
import PropTypes from "prop-types";

export class SubmitHash extends Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.hashToBlock(this.props.hash, this.props.id);
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="submit"
          value="Send to Ethereum Blockchain (Ropsten)"
          className="btn2"
          style={submitBtnStyle}
        />
      </form>
    );
  }
}

// PropTypes
SubmitHash.propTypes = {
  hashToBlock: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
};

const submitBtnStyle = {
  border: "none",
  backgroundColor: "#008100",
  color: "#fff",
  height: "5vh",
  width: "25vw",
  cursor: "pointer",
  margin: "1vw"
};

export default SubmitHash;
