import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <div className="App">
      <header>Fringe Learn Glyphs</header>
      <main>
        <App />
      </main>
      <footer>Alpha v0.0.1</footer>
    </div>
  </React.StrictMode>
);
