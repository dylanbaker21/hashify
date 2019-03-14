import React, { Component } from "react";
import PropTypes from "prop-types";

export class SubmitHash extends Component {
  state = {
    input: ""
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.hashToBlock(this.props.hash, this.props.id);
  };

  //handleChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="submit"
          value="Send to Ethereum Blockchain (Ropsten)"
          className="btn2"
          style={{
            border: "none",
            backgroundColor: "#008100",
            color: "#fff",
            height: "5vh",
            width: "25vw",
            cursor: "pointer",
            margin: "1vw"
          }}
        />
      </form>
    );
  }
}

// PropTypes
SubmitHash.propTypes = {
  hashToBlock: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
  //output: PropTypes.string.isRequired
};

export default SubmitHash;
