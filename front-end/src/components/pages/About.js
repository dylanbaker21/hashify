import Header from "../layout/Header";
import React from "react";

export default function About() {
  return (
    <React.Fragment>
      <Header />
      <h1 style={{ textAlign: "center" }}>About Page</h1>
      <p style={{ textAlign: "center" }}>
        Hash data in the browser and automatically submit the hash to the
        ethereum blockchain for verification and permanence
      </p>
      <br />
      <p style={{ textAlign: "center" }}>Made by Dylan Baker :)</p>
    </React.Fragment>
  );
}
