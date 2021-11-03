import React from "react";
import Typewriter from "typewriter-effect";

// random
const Jumbotron = ({ text }) => (
  <Typewriter
    options={{
      strings: text,
      autoStart: true,
      loop: true,
    }}
  />
);

export default Jumbotron;
