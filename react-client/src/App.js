import React, { useEffect, useRef, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import * as api from "./api";

// function App2() {
//   return <h1>hello there</h1>
// }
function App() {
  const [authenticated, set_authenticated] = useState(false);
  const [timer, set_timer] = useState();
  const timer_id = useRef(null);
  const [user, set_user] = useState(null);
  const [content, set_content] = useState("no content yet...");

  const clearTimer = () => {
    clearInterval(timer_id.current);
    timer_id.current = null;
    return 0;
  };
  useEffect(() => {
    if (authenticated) {
      timer_id.current = setInterval(
        () =>
          set_timer((t) => {
            if (t) return t - 1;
            else return clearTimer();
          }),
        1000
      );
    } else if (timer_id.current) {
      clearTimer();
    }
    return () => clearInterval(timer_id.current);
  }, [authenticated]);

  const login = async () => {
    const response = await api.login();
    if (response.status === "you are authenticated") {
      set_authenticated(true);
      set_user(response.user);
      set_timer(30);
    }
  };

  const logout = async () => {
    const response = await api.logout();
    if (response.status === "You are logged out") {
      set_authenticated(false);
      set_timer(null);
      set_user(null);
      set_content("no content any longer...");
    }
  };

  const get_protected = async () => {
    const response = await api.get_protected();
    set_content(response.payload);
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <div className="top-box">
          <h1>Auth demo</h1>
          <img src={logo} className="logo" alt="logo" />
        </div>

        <p>
          Authenticated:
          <span className="lightblue-text">{" " + authenticated + " "}</span>
          {timer}
        </p>
        <div>
          <span className="lightblue-text">user:</span>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
        <div>
          {authenticated ? (
            <button className="btn" onClick={logout}>
              Logout
            </button>
          ) : (
            <button className="btn" onClick={login}>
              Login
            </button>
          )}
          <button className="btn" onClick={get_protected}>
            get protected content
          </button>
        </div>
        <p>{content}</p>
      </header>
    </div>
  );
}

export default App;
