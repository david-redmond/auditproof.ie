import Link from "next/link";
import shared from "../shared.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Contact — GDPR Evidence",
  description: "Get in touch with the GDPR Evidence team.",
};

const contactEmail = "hello@gdprevidence.ie";

export default function ContactPage() {
  return (
    <div className={shared.page}>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <section className={shared.hero}>
          <div className={shared.container}>
            <h1 className={shared.heroTitle}>Contact</h1>
            <p className={shared.heroSub}>
              For product questions, partner enquiries, or support, email us.
            </p>
            <p className={shared.bodyCopy}>
              <a
                href={`mailto:${contactEmail}`}
                className={shared.footerLink}
              >
                {contactEmail}
              </a>
            </p>
            <p className={shared.bodyCopy}>
              We aim to respond within 1–2 business days.
            </p>
            <p className={shared.bodyCopy}>
              <Link href="/" className={shared.footerLink}>Back to home</Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
