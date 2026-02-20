import { IncidentForm } from "../IncidentForm";
import shared from "../../../../shared.module.css";
import styles from "../incidentForm.module.css";

export const metadata = { title: "Log a security incident — Vault", description: "Record a security incident or possible data breach." };

export default function IncidentNewPage() {
  return (
    <main id="main-content" className={shared.section}>
      <div className={shared.container}>
        <div className={styles.wrap}>
          <h1 className={styles.title}>Log a security incident</h1>
          <span className={styles.titleSecondary}>(including possible data breaches)</span>
          <p className={styles.subtitle}>
            Use this to record anything that might affect personal data. Logging an incident does not automatically mean you must notify the DPC.
          </p>
          <p className={styles.reassuranceNote}>
            This is a record-keeping tool, not legal advice.
          </p>
          <IncidentForm mode="create" />
        </div>
      </div>
    </main>
  );
}
