import { DsrForm } from "../DsrForm";
import shared from "../../../../shared.module.css";
import styles from "../dsrForm.module.css";

export const metadata = { title: "Log customer data request — Vault", description: "Log a customer personal data request." };

export default function DsrNewPage() {
  return (
    <main id="main-content" className={shared.section}>
      <div className={shared.container}>
        <div className={styles.wrap}>
          <h1 className={styles.title}>Log customer data request</h1>
          <p className={styles.subtitle}>
            Use this when someone asks to access, correct, or delete their personal data.
          </p>
          <details className={styles.notSureHelp}>
            <summary className={styles.notSureSummary}>Not sure?</summary>
            <p className={styles.notSureText}>
              You don&apos;t need to log general customer emails or complaints — only requests about personal data.
            </p>
          </details>
          <DsrForm mode="create" />
        </div>
      </div>
    </main>
  );
}
