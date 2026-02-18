/**
 * RoPA templates – example-only defaults for quick creation.
 * Stored in code (no DB). Users import into their org as editable records.
 */

/** Default field values for one RoPA record (matches RopaRecord model). */
export type RopaTemplateDefaults = {
  processingActivityName: string;
  purposeOfProcessing: string;
  dataSubjectCategories: string[];
  personalDataCategories: string[];
  lawfulBasis: string;
  retentionPeriod: string;
  processorsRecipients: string[];
  notes?: string;
};

export type RopaTemplateCategory =
  | "Customer & Sales"
  | "Finance & Admin"
  | "Staff"
  | "Security";

export type RopaTemplate = {
  templateId: string;
  title: string;
  description: string;
  category: RopaTemplateCategory;
  recommended?: boolean;
  defaults: RopaTemplateDefaults;
};

/** Lawful basis enum values used in the RoPA model. */
const LB = {
  consent: "consent",
  contract: "contract",
  legal_obligation: "legal_obligation",
  legitimate_interests: "legitimate_interests",
} as const;

export const ROPA_TEMPLATES: RopaTemplate[] = [
  {
    templateId: "customer-enquiries-contact-forms",
    title: "Customer Enquiries & Contact Forms",
    description: "Respond to enquiries and provide information.",
    category: "Customer & Sales",
    recommended: true,
    defaults: {
      processingActivityName: "Customer Enquiries & Contact Forms",
      purposeOfProcessing: "Respond to enquiries and provide info.",
      dataSubjectCategories: ["prospective customers"],
      personalDataCategories: ["name", "email", "phone", "enquiry details"],
      lawfulBasis: LB.legitimate_interests,
      retentionPeriod: "up to 12 months after last contact",
      processorsRecipients: ["email hosting provider", "CRM system (if applicable)"],
      notes: "Review and adapt to your actual enquiry handling.",
    },
  },
  {
    templateId: "customer-account-management",
    title: "Customer Account Management",
    description: "Manage customer relationships and deliver services.",
    category: "Customer & Sales",
    defaults: {
      processingActivityName: "Customer Account Management",
      purposeOfProcessing: "Manage customer relationships and deliver services.",
      dataSubjectCategories: ["customers"],
      personalDataCategories: ["name", "contact details", "account info"],
      lawfulBasis: LB.contract,
      retentionPeriod: "duration + 6 years",
      processorsRecipients: ["CRM provider", "cloud hosting provider"],
    },
  },
  {
    templateId: "invoicing-accounting-records",
    title: "Invoicing & Accounting Records",
    description: "Invoices and tax/accounting obligations.",
    category: "Finance & Admin",
    recommended: true,
    defaults: {
      processingActivityName: "Invoicing & Accounting Records",
      purposeOfProcessing: "Invoices + tax/accounting obligations.",
      dataSubjectCategories: ["customers", "suppliers"],
      personalDataCategories: ["name", "address", "billing details", "transaction history"],
      lawfulBasis: LB.legal_obligation,
      retentionPeriod: "7 years",
      processorsRecipients: ["accounting software provider", "accountant"],
    },
  },
  {
    templateId: "email-marketing-communications",
    title: "Email Marketing Communications",
    description: "Marketing updates and promotions.",
    category: "Customer & Sales",
    defaults: {
      processingActivityName: "Email Marketing Communications",
      purposeOfProcessing: "Marketing updates/promotions.",
      dataSubjectCategories: ["customers", "subscribers"],
      personalDataCategories: ["email address"],
      lawfulBasis: LB.consent,
      retentionPeriod: "until consent withdrawn",
      processorsRecipients: ["email marketing platform"],
    },
  },
  {
    templateId: "website-analytics",
    title: "Website Analytics",
    description: "Analyse usage and improve performance.",
    category: "Customer & Sales",
    defaults: {
      processingActivityName: "Website Analytics",
      purposeOfProcessing: "Analyse usage and improve performance.",
      dataSubjectCategories: ["website visitors"],
      personalDataCategories: ["IP address (truncated/anonymised)", "device information"],
      lawfulBasis: LB.legitimate_interests,
      retentionPeriod: "14 months",
      processorsRecipients: ["analytics provider"],
    },
  },
  {
    templateId: "employee-records-payroll",
    title: "Employee Records & Payroll",
    description: "Manage employment and pay employees.",
    category: "Staff",
    recommended: true,
    defaults: {
      processingActivityName: "Employee Records & Payroll",
      purposeOfProcessing: "Manage employment + pay employees.",
      dataSubjectCategories: ["employees"],
      personalDataCategories: ["name", "address", "PPSN", "bank details", "employment records"],
      lawfulBasis: LB.legal_obligation,
      retentionPeriod: "7 years after employment ends",
      processorsRecipients: ["payroll provider", "revenue authorities"],
    },
  },
  {
    templateId: "job-applications-recruitment",
    title: "Job Applications & Recruitment",
    description: "Assess candidates for roles.",
    category: "Staff",
    defaults: {
      processingActivityName: "Job Applications & Recruitment",
      purposeOfProcessing: "Assess candidates for roles.",
      dataSubjectCategories: ["job applicants"],
      personalDataCategories: ["CVs", "contact details", "employment history", "interview notes"],
      lawfulBasis: LB.legitimate_interests,
      retentionPeriod: "6–12 months after recruitment ends",
      processorsRecipients: ["email provider", "recruitment platform (if applicable)"],
    },
  },
  {
    templateId: "supplier-contractor-management",
    title: "Supplier & Contractor Management",
    description: "Manage supplier relationships and contracts.",
    category: "Finance & Admin",
    recommended: true,
    defaults: {
      processingActivityName: "Supplier & Contractor Management",
      purposeOfProcessing: "Manage supplier relationships and contracts.",
      dataSubjectCategories: ["suppliers", "contractors"],
      personalDataCategories: ["name", "contact details", "bank details"],
      lawfulBasis: LB.contract,
      retentionPeriod: "duration + 6 years",
      processorsRecipients: ["accounting system", "payment provider"],
    },
  },
  {
    templateId: "customer-support-complaints-handling",
    title: "Customer Support & Complaints Handling",
    description: "Respond to queries and resolve complaints.",
    category: "Customer & Sales",
    defaults: {
      processingActivityName: "Customer Support & Complaints Handling",
      purposeOfProcessing: "Respond to queries and resolve complaints.",
      dataSubjectCategories: ["customers"],
      personalDataCategories: ["contact details", "support correspondence"],
      lawfulBasis: LB.contract,
      retentionPeriod: "2 years after issue resolution",
      processorsRecipients: ["helpdesk system", "email provider"],
      notes: "Lawful basis may include contract and legitimate interest.",
    },
  },
  {
    templateId: "cctv-if-applicable",
    title: "CCTV (If Applicable)",
    description: "Premises security and safety.",
    category: "Security",
    defaults: {
      processingActivityName: "CCTV (If Applicable)",
      purposeOfProcessing: "Premises security and safety.",
      dataSubjectCategories: ["employees", "visitors"],
      personalDataCategories: ["video recordings"],
      lawfulBasis: LB.legitimate_interests,
      retentionPeriod: "30 days unless needed for investigation",
      processorsRecipients: ["CCTV system provider"],
    },
  },
  {
    templateId: "it-systems-access-logs",
    title: "IT Systems & Access Logs",
    description: "System security and prevent unauthorised access.",
    category: "Security",
    recommended: true,
    defaults: {
      processingActivityName: "IT Systems & Access Logs",
      purposeOfProcessing: "System security and prevent unauthorised access.",
      dataSubjectCategories: ["employees", "contractors"],
      personalDataCategories: ["usernames", "IP addresses", "access logs"],
      lawfulBasis: LB.legitimate_interests,
      retentionPeriod: "6–12 months",
      processorsRecipients: ["IT service provider", "cloud hosting provider"],
    },
  },
  {
    templateId: "training-compliance-records",
    title: "Training & Compliance Records",
    description: "Document staff training and compliance awareness.",
    category: "Staff",
    defaults: {
      processingActivityName: "Training & Compliance Records",
      purposeOfProcessing: "Document staff training + compliance awareness.",
      dataSubjectCategories: ["employees"],
      personalDataCategories: ["name", "training completion records"],
      lawfulBasis: LB.legal_obligation,
      retentionPeriod: "duration of employment + 2 years",
      processorsRecipients: ["training platform provider"],
      notes: "Lawful basis may include legal obligation and legitimate interest.",
    },
  },
];

const TEMPLATE_IDS = new Set(ROPA_TEMPLATES.map((t) => t.templateId));

/** Check that all ids exist in ROPA_TEMPLATES. */
export function validateTemplateIds(ids: string[]): { valid: string[]; invalid: string[] } {
  const valid: string[] = [];
  const invalid: string[] = [];
  for (const id of ids) {
    if (TEMPLATE_IDS.has(id)) valid.push(id);
    else invalid.push(id);
  }
  return { valid, invalid };
}

/** Get template by id, or undefined. */
export function getTemplateById(templateId: string): RopaTemplate | undefined {
  return ROPA_TEMPLATES.find((t) => t.templateId === templateId);
}
