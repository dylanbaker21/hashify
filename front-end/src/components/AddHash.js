import React, { Component } from "react";
import PropTypes from "prop-types";

export class AddHash extends Component {
  state = {
    input: ""
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.addHash(this.state.input);
  };

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h4>Keccak256 - Ethereum compatible</h4>
        <textarea
          style={{ height: "30vh", width: "45vw", margin: "1vw" }}
          type="text"
          name="input"
          placeholder="Enter text to hash..."
          value={this.state.input}
          onChange={this.handleChange}
        />
        <textarea
          style={{ height: "30vh", width: "45vw", margin: "1vw" }}
          type="text"
          name="output"
          placeholder="Hashed output"
          value={this.props.output}
          onChange={this.handleChange}
        />
        <br />
        <input
          type="submit"
          value="Hash"
          className="btn2"
          style={{
            border: "none",
            backgroundColor: "#333",
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
AddHash.propTypes = {
  addHash: PropTypes.func.isRequired,
  output: PropTypes.string.isRequired
};

export default AddHash;
