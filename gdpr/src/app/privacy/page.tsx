import Link from "next/link";
import shared from "../shared.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy — GDPR Evidence",
  description: "How GDPR Evidence collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <div className={shared.page}>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <section className={shared.hero}>
          <div className={shared.container}>
            <h1 className={shared.heroTitle}>Privacy Policy</h1>
            <p className={shared.heroSub}>
              This page will contain our full privacy policy. For security and data hosting in the meantime, see{" "}
              <Link href="/security" className={shared.footerLink}>
                Security
              </Link>
              .
            </p>
          </div>
        </section>
        <section className={shared.section}>
          <div className={shared.container}>
            <div className={shared.bodyCopy}>
              <p>
                We take your privacy seriously. Data is stored in the EU, and we don’t sell your information. A complete privacy policy will be published here soon.
              </p>
              <p>
                <Link href="/" className={shared.footerLink}>Back to home</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
