import { RopaForm } from "../RopaForm";
import shared from "../../../../shared.module.css";
import styles from "../ropaForm.module.css";

export const metadata = { title: "Add data use — Vault", description: "Add a RoPA entry for one way your business uses personal data." };

export default function RopaNewPage() {
  return (
    <main id="main-content" className={shared.section}>
      <div className={shared.container}>
        <div className={styles.wrap}>
          <h1 className={styles.title}>Add data use</h1>
          <span className={styles.titleSecondary}>RoPA (Record of Processing Activities)</span>
          <p className={styles.subtitle}>
            Add one entry for each way your business uses personal data (e.g. CCTV, website enquiries, payroll).
          </p>
          <RopaForm mode="create" />
        </div>
      </div>
    </main>
  );
}
