import shared from "../shared.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact — GDPR Evidence",
  description:
    "Get in touch with the GDPR Evidence team. Use the form for product questions, partner enquiries, or privacy matters.",
};

export default function ContactPage() {
  return (
    <div className={shared.page}>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <section className={shared.hero}>
          <div className={shared.container}>
            <h1 className={shared.heroTitle}>Contact</h1>
            <p className={shared.heroSub}>
              For product questions, partner enquiries, or privacy matters, use the form below.
            </p>
          </div>
        </section>

        <section className={shared.section}>
          <div className={shared.container}>
            <ContactForm />
            <p className={shared.bodyCopy} style={{ marginTop: "var(--theme-space-6)" }}>
              We aim to respond within 24 hours.
            </p>
            <p className={shared.bodyCopy}>
              <strong>This is not legal advice.</strong> For legal or regulatory advice, please consult a qualified professional.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
