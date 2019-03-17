import React, { Component } from "react";
import HashItem from "./HashItem";
import PropTypes from "prop-types";

// this class takes an array of hash item objects
// and splits them up into their own components to display
class Hashes extends Component {
  render() {
    //console.log(this.props.hashItems);
    if (this.props.hashItems !== undefined) {
      return this.props.hashItems
        .slice() // slice to make a new array
        .reverse() // reverse the array to show new items at top
        .map(hash => (
          <HashItem
            key={hash.id}
            id={hash.id}
            output={this.props.output}
            hash={hash.hash}
            from={hash.fromAddress}
            tx={hash.tx}
            hashToBlock={this.props.hashToBlock}
            deleteHash={this.props.deleteHash}
          />
        ));
    } else {
      return null;
    }
  }
}

// PropTypes
Hashes.propTypes = {
  hashItems: PropTypes.array.isRequired,
  output: PropTypes.string.isRequired,
  hashToBlock: PropTypes.func.isRequired,
  deleteHash: PropTypes.func.isRequired
};

export default Hashes;
