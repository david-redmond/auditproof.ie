import Link from "next/link";
import shared from "../shared.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Legal — GDPR Evidence",
  description:
    "Privacy, terms, cookies, security, and other legal information for GDPR Evidence. This is not legal advice.",
};

const policyLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/cookies", label: "Cookie Policy" },
  { href: "/data-processing", label: "Data Processing (DPA)" },
  { href: "/security", label: "Security & Hosting" },
  { href: "/acceptable-use", label: "Acceptable Use Policy" },
  { href: "/contact", label: "Contact" },
];

export default function LegalHubPage() {
  return (
    <div className={shared.page}>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <section className={shared.hero}>
          <div className={shared.container}>
            <h1 className={shared.heroTitle}>Legal</h1>
            <p className={shared.heroSub}>
              These pages explain how GDPR Evidence operates and how we handle your data. This is not legal advice.
            </p>
            <nav aria-label="Legal documents">
              <ul className={shared.bulletList} style={{ marginLeft: "1.5rem" }}>
                {policyLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className={shared.footerLink}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </section>
        <section className={shared.section}>
          <div className={shared.container}>
            <p className={shared.bodyCopy}>
              <Link href="/" className={shared.footerLink}>
                Back to home
              </Link>
              {" · "}
              <Link href="/legal" className={shared.footerLink}>
                Legal hub
              </Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
