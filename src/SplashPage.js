import React from "react";
import "./SplashPage.css";

export default function SplashPage({ onContinue }) {
  return (
    <div className="legacy-splash-page">
      <div className="legacy-splash-card">
        <div className="legacy-splash-eyebrow">YTC Logistics</div>

        <div className="legacy-splash-status">Transition Notice</div>

        <h1>Driver Dashboard Notice</h1>

        <p className="legacy-splash-lead">
          This Driver Dashboard is now a legacy system and will be discontinued
          progressively.
        </p>

        <div className="legacy-splash-notice">
          During this transition period, the old dashboard will no longer be
          actively updated. Please do not rely on it as the main source for new
          driver tasking or future logistics updates.
        </div>

        <div className="legacy-splash-actions legacy-splash-actions-single">
          <button className="legacy-splash-primary" onClick={onContinue}>
            Continue to Old Dashboard
          </button>
        </div>

        <p className="legacy-splash-footer">
          Please continue using this dashboard only where necessary until the new
          logistics system is officially released.
          <br />
          For any clarification, please check with Logistics.
        </p>
      </div>
    </div>
  );
}