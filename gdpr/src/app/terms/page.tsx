import Link from "next/link";
import shared from "../shared.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms — GDPR Evidence",
  description: "Terms of use for GDPR Evidence.",
};

export default function TermsPage() {
  return (
    <div className={shared.page}>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <section className={shared.hero}>
          <div className={shared.container}>
            <h1 className={shared.heroTitle}>Terms of use</h1>
            <p className={shared.heroSub}>
              Full terms of use will be published here. By using the service you agree to use it responsibly and in line with applicable law.
            </p>
          </div>
        </section>
        <section className={shared.section}>
          <div className={shared.container}>
            <div className={shared.bodyCopy}>
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
