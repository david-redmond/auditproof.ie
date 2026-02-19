/**
 * Single source of truth for header navigation.
 * Used by both desktop and mobile nav to avoid duplication.
 */
export type NavItem = {
  label: string;
  href: string;
};

export const headerNavConfig: NavItem[] = [
  { label: "Product", href: "/gdpr" },
  { label: "Pricing", href: "/pricing" },
  { label: "Partners", href: "/partners" },
];
