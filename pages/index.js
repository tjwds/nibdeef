import { useState } from "react";

import JudgeFeedEntries from "../src/components/JudgeFeedEntries";
import Login from "../src/components/Login";

export default function Application(props) {
  const [credentials, setCredentials] = useState("");

  const addCredentials = (event) => {
    event.preventDefault();
    setCredentials(
      btoa(event.target.username.value + ":" + event.target.password.value)
    );
  };

  if (!credentials) {
    return <Login addCredentials={addCredentials} />;
  } else {
    return <JudgeFeedEntries token={credentials} />;
  }
}
