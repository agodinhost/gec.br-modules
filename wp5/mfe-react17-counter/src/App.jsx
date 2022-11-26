
import React from "react";
import ReactDOM from "react-dom";

/* local components import */
import { Counter } from "./components/Counter.jsx";

import "./index.css";

const App = () => (
  <div className="container">
    <Counter />
  </div>
);

console.log('# process.env.PROCESSOR_LEVEL = \'', process.env.PROCESSOR_LEVEL, '\'\n');
console.log('# process.env.SYSTEM_FRONTEND_PORT = \'', process.env.SYSTEM_FRONTEND_PORT, '\'\n');
console.log('# process.env.SYSTEM_FRONTEND_URL = \'', process.env.SYSTEM_FRONTEND_URL, '\'\n');

ReactDOM.render(<App />, document.getElementById("app"));
