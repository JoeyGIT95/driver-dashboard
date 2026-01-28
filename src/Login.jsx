import React, { useEffect, useState } from "react";

const GOOGLE_CLIENT_ID = "373414640078-vamci9j598ake37bdpgk9qlhiacto25s.apps.googleusercontent.com";

export default function Login({ onLogin }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        { theme: "outline", size: "large" }
      );

      window.google.accounts.id.prompt();
    };
}, [handleCredentialResponse]);

  function handleCredentialResponse(response) {
    const decoded = parseJwt(response.credential);
    console.log("✅ Google User:", decoded);
    setUser(decoded);
    if (onLogin) onLogin(decoded);
  }

  function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  }

  if (user) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Welcome, {user.name}</h2>
        <p>Email: {user.email}</p>
        <p>Signed in successfully 🎉</p>
      </div>
    );
  }

  return <div id="google-signin-button" style={{ textAlign: "center", marginTop: "50px" }}></div>;
}
