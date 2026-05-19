import React from "react";
import "./SplashPage.css";

export default function SplashPage({ onContinue }) {
  const goToAio = () => {
    window.location.href = "https://aiologs.vercel.app";
  };

  return (
    <main className="legacy-splash-page">
      <section className="legacy-splash-card">
        <div className="legacy-splash-eyebrow">YTC Logistics</div>

        <div className="legacy-splash-status">Legacy Driver Dashboard</div>

        <h1>We are moving to AIO Logistics</h1>

        <p className="legacy-splash-lead">
          This Driver Dashboard will be discontinued progressively as we move
          driver tasking, live requests, and logistics coordination into AIO.
        </p>

        <div className="legacy-splash-notice">
          Please start using AIO Logistics for new operations. This old dashboard
          should only be used temporarily during the transition period.
        </div>

        <div className="legacy-splash-actions">
          <button type="button" className="legacy-splash-primary" onClick={goToAio}>
            Go to AIO Logistics
          </button>

          <button type="button" className="legacy-splash-secondary" onClick={onContinue}>
            Continue to Old Dashboard
          </button>
        </div>

        <p className="legacy-splash-footer">
          If you cannot access AIO, please inform Logistics before continuing with old workflow.
        </p>
      </section>
    </main>
  );
}
