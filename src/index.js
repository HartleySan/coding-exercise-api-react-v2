import React from "react";
import ReactDOM from "react-dom";

import SiteContainer from "./SiteContainer";
import FlashMsg from "./FlashMsg";
import Modal from "./Modal";

import './index.css';

const App = () => (
    <div>
        <SiteContainer />
        <FlashMsg />
        <Modal />
    </div>
);

const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);

ReactDOM.render(
  <App>
  </App>,
  document.getElementById("root")
);
