import Link from "next/link";
import shared from "../shared.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Forgot password — GDPR Evidence",
  description: "Reset your GDPR Evidence password.",
};

export default function ForgotPasswordPage() {
  return (
    <div className={shared.page}>
      <Header />

      <main id="main-content" tabIndex={-1}>
        <section className={shared.section} aria-labelledby="forgot-heading">
          <div className={shared.container}>
            <div
              className={shared.featureCard}
              style={{ maxWidth: "28rem", margin: "0 auto", padding: "2rem" }}
            >
              <h1 id="forgot-heading" className={shared.sectionTitle}>
                Forgot password
              </h1>
              <p className={shared.sectionLead}>
                Coming soon. Please contact support if you need access to your
                account.
              </p>
              <p>
                <Link href="/signin" className={shared.ctaSecondary}>
                  Back to Sign in
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
