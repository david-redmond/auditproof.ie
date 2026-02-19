"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import shared from "@/app/shared.module.css";

export default function HeroCtas() {
  return (
    <div className={shared.ctas}>
      <Link
        href="/signup"
        className={shared.ctaPrimary}
        onClick={() => trackEvent("hero_cta_click", { cta: "register" })}
      >
        Register free
      </Link>
      <a
        href="/sample-audit-pack.pdf"
        className={shared.ctaSecondary}
        download="sample-audit-pack.pdf"
        onClick={() => trackEvent("hero_cta_click", { cta: "sample_pack" })}
      >
        View sample audit pack
      </a>
    </div>
  );
}
