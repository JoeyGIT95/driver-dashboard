import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import Login from "./Login";

function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return <Dashboard user={user} />;
}

export default App;
