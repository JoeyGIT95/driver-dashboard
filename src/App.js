import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import Login from "./Login";
import SplashPage from "./SplashPage";

function App() {
  const [user, setUser] = useState(null);
  const [showSplash, setShowSplash] = useState(true);

  const continueToOldDashboard = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashPage onContinue={continueToOldDashboard} />;
  }

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return <Dashboard user={user} />;
}

export default App;