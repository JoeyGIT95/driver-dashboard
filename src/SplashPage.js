import React from "react";
import "./SplashPage.css";

export default function SplashPage() {
  const openAio = () => {
    window.location.href = "https://aiologs.vercel.app";
  };

  return (
    <div className="legacy-splash-page">
      <div className="legacy-splash-card">
        <div className="legacy-splash-eyebrow">YTC Logistics</div>

        <div className="legacy-splash-status">System Moved</div>

        <h1>Driver Dashboard Has Moved</h1>

        <p className="legacy-splash-lead">
          This old Driver Dashboard is no longer in use and is no longer updated.
        </p>

<div className="legacy-splash-notice">
  This dashboard has been replaced by AIO Logistics.
  <br />
  <br />
  Please use AIO Logistics moving forward for driver schedules, task updates,
  requests, and live map.
</div>

        <div className="legacy-splash-actions legacy-splash-actions-single">
          <button className="legacy-splash-primary" onClick={openAio}>
            Open AIO Logistics
          </button>
        </div>

        <p className="legacy-splash-footer">
          New AIO Logistics system:
          <br />
          https://aiologs.vercel.app
          <br />
          <br />
          For any clarification, please check with Logistics.
        </p>
      </div>
    </div>
  );
}