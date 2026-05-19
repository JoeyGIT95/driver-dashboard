import React from "react";
import "./SplashPage.css";

export default function SplashPage({ onContinue }) {
  return (
    <div className="splash-page">
      <div className="splash-card">
        <div className="splash-badge">YTC Logistics</div>

        <h1>Driver Dashboard Transition Notice</h1>

        <p className="splash-main-text">
          This Driver Dashboard is now a legacy system and will be discontinued
          progressively.
        </p>

        <p className="splash-sub-text">
          During this transition period, the old dashboard will no longer be
          actively updated. Please do not rely on it as the main source for new
          driver tasking or future logistics updates.
        </p>

        <div className="splash-warning">
          Please continue using this dashboard only where necessary until the new
          logistics system is officially released.
        </div>

        <div className="splash-actions single-action">
          <button className="primary-btn" onClick={onContinue}>
            Continue to Old Dashboard
          </button>
        </div>

        <p className="splash-footer">
          For any clarification, please check with Logistics.
        </p>
      </div>
    </div>
  );
}