"use client";

import listStyles from "../list.module.css";

export function SettingsIntro() {
  return (
    <section
      className={`${listStyles.panel} ${listStyles.introPanel}`}
      aria-labelledby="settings-page-title"
    >
      <h1 id="settings-page-title" className={listStyles.title}>
        Settings
      </h1>
      <p className={listStyles.subtitle}>Organisation & access control</p>
      <details className={listStyles.whyBlock}>
        <summary className={listStyles.whySummary}>What is this?</summary>
        <div className={listStyles.whyText}>
          <p className={listStyles.whyReassurance}>
            Use this page to manage your organisation profile, GDPR accountability details, and user access.
          </p>
        </div>
      </details>
    </section>
  );
}
