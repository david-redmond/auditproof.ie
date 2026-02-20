"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { auditPath } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import type { RopaTemplate, RopaTemplateCategory } from "@/lib/ropaTemplates";
import styles from "./templates.module.css";

const CATEGORY_ORDER: RopaTemplateCategory[] = [
  "Customer & Sales",
  "Finance & Admin",
  "Staff",
  "Security",
];

type Props = {
  templates: RopaTemplate[];
};

type ImportResult = {
  importedCount: number;
  skippedCount: number;
  importedIds: string[];
  skippedIds: string[];
};

function getQueryLengthBucket(len: number): string {
  if (len <= 3) return "1-3";
  if (len <= 10) return "4-10";
  return "10+";
}

export function ImportTemplatesForm({ templates }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const viewTrackedRef = useRef(false);
  const searchTrackedRef = useRef(false);

  const filteredTemplates = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return templates;
    return templates.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }, [templates, searchQuery]);

  const byCategory = useMemo(() => {
    const map = new Map<RopaTemplateCategory, RopaTemplate[]>();
    for (const cat of CATEGORY_ORDER) map.set(cat, []);
    for (const t of filteredTemplates) {
      const list = map.get(t.category) ?? [];
      list.push(t);
      map.set(t.category, list);
    }
    return map;
  }, [filteredTemplates]);

  useEffect(() => {
    if (viewTrackedRef.current) return;
    viewTrackedRef.current = true;
    trackEvent("ropa_templates_view", { page: "templates" });
  }, []);

  const toggle = useCallback((templateId: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      const _template = templates.find((t) => t.templateId === templateId);
      if (next.has(templateId)) {
        next.delete(templateId);
        trackEvent("ropa_templates_select", { template_key: templateId, selected: false });
      } else {
        next.add(templateId);
        trackEvent("ropa_templates_select", { template_key: templateId, selected: true });
      }
      return next;
    });
    setError(null);
  }, [templates]);

  const selectRecommended = useCallback(() => {
    const recommendedIds = templates.filter((t) => t.recommended).map((t) => t.templateId);
    setSelected(new Set(recommendedIds));
    setError(null);
    trackEvent("ropa_templates_select_all", { mode: "recommended" });
  }, [templates]);

  const selectAll = useCallback(() => {
    setSelected(new Set(filteredTemplates.map((t) => t.templateId)));
    setError(null);
    trackEvent("ropa_templates_select_all", { mode: "all" });
  }, [filteredTemplates]);

  const clearSelection = useCallback(() => {
    setSelected(new Set());
    setError(null);
    trackEvent("ropa_templates_select_all", { mode: "clear" });
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setSearchQuery(v);
    if (v.trim() && !searchTrackedRef.current) {
      searchTrackedRef.current = true;
      trackEvent("ropa_templates_search_used", {
        query_length_bucket: getQueryLengthBucket(v.trim().length),
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selected.size === 0) {
      setError("Please select at least one template to import.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/ropa/import-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateIds: Array.from(selected) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Import failed.");
        return;
      }
      const result = data as ImportResult;
      setSuccess(
        `Imported ${result.importedCount} template${result.importedCount === 1 ? "" : "s"}.${
          result.skippedCount > 0 ? ` ${result.skippedCount} already imported (skipped).` : ""
        }`
      );
      trackEvent("ropa_templates_import_click", { count: selected.size });
      setSelected(new Set());
      setTimeout(() => {
        router.push(auditPath("/dashboard/ropa"));
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h1 className={styles.title}>Start with templates</h1>
        <p className={styles.subtext}>
          Pick the activities your business does. You can edit everything after importing.
        </p>
      </header>

      <div className={styles.infoBanner} role="status">
        <p className={styles.infoBannerText}>
          Templates are a starting point. Review and customise each one to match your business.
        </p>
      </div>

      <form id="ropa-import-form" onSubmit={handleSubmit} className={styles.form}>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className={styles.success} role="status">
            {success}
          </p>
        )}

        <div className={styles.searchWrap}>
          <label htmlFor="templates-search" className={styles.searchLabel}>
            Search templates
          </label>
          <input
            id="templates-search"
            type="search"
            className={styles.searchInput}
            placeholder="Search templates…"
            value={searchQuery}
            onChange={handleSearchChange}
            aria-describedby="templates-search-desc"
          />
          <span id="templates-search-desc" className={styles.srOnly}>
            Search by title, description or category
          </span>
        </div>

        <div className={styles.actionsTop}>
          <div className={styles.selectionActions}>
            <button
              type="button"
              className={styles.linkButton}
              onClick={selectRecommended}
              disabled={loading}
            >
              Select recommended
            </button>
            <button
              type="button"
              className={styles.linkButton}
              onClick={selectAll}
              disabled={loading}
            >
              Select all
            </button>
            <button
              type="button"
              className={styles.linkButton}
              onClick={clearSelection}
              disabled={loading}
            >
              Clear
            </button>
          </div>
          <div className={styles.selectionCounter}>
            <span aria-live="polite">
              {selected.size} selected
            </span>
          </div>
        </div>

        <div className={styles.templateSections}>
          {CATEGORY_ORDER.map((category) => {
            const list = byCategory.get(category) ?? [];
            if (list.length === 0) return null;
            return (
              <section
                key={category}
                className={styles.templateSection}
                aria-labelledby={`section-${category.replace(/\s+/g, "-")}`}
              >
                <h2 id={`section-${category.replace(/\s+/g, "-")}`} className={styles.sectionHeading}>
                  {category}
                </h2>
                <ul className={styles.templateGrid} aria-label={`${category} templates`}>
                  {list.map((t) => (
                    <li key={t.templateId}>
                      <TemplateCard
                        template={t}
                        selected={selected.has(t.templateId)}
                        onToggle={() => toggle(t.templateId)}
                        disabled={loading}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        <div className={styles.actionsBottom}>
          <button
            type="submit"
            className={styles.btnPrimary}
            disabled={loading || selected.size === 0}
            aria-busy={loading}
          >
            {loading
              ? "Importing…"
              : selected.size === 0
                ? "Import selected templates"
                : `Import ${selected.size} template${selected.size === 1 ? "" : "s"}`}
          </button>
          <Link href={auditPath("/dashboard/ropa/new")} className={styles.linkSecondary}>
            Create blank instead
          </Link>
        </div>
      </form>

      <footer className={styles.stickyFooter} aria-label="Selection summary">
        <div className={styles.stickyFooterInner}>
          <span className={styles.stickyFooterCount} aria-live="polite">
            {selected.size} template{selected.size === 1 ? "" : "s"} selected
          </span>
          <div className={styles.stickyFooterActions}>
            <Link
              href={auditPath("/dashboard/ropa/new")}
              className={styles.stickyFooterLink}
            >
              Create blank instead
            </Link>
            <button
              type="submit"
              form="ropa-import-form"
              className={styles.stickyFooterBtn}
              disabled={loading || selected.size === 0}
              aria-busy={loading}
            >
              {selected.size === 0
                ? "Import selected templates"
                : `Import ${selected.size} template${selected.size === 1 ? "" : "s"}`}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function TemplateCard({
  template,
  selected,
  onToggle,
  disabled,
}: {
  template: RopaTemplate;
  selected: boolean;
  onToggle: () => void;
  disabled: boolean;
}) {
  const id = `template-${template.templateId}`;

  return (
    <label
      htmlFor={id}
      className={`${styles.templateCard} ${selected ? styles.templateCardSelected : ""}`}
    >
      <input
        id={id}
        type="checkbox"
        className={styles.checkbox}
        checked={selected}
        onChange={() => onToggle()}
        disabled={disabled}
        aria-label={`Select ${template.title}`}
      />
      <div className={styles.templateContent}>
        <div className={styles.templateCardHeader}>
          <span className={styles.templateTitle}>{template.title}</span>
          <span className={styles.pillRow}>
            <span className={styles.categoryPill}>{template.category}</span>
            {template.recommended && (
              <span className={styles.recommendedPill}>Recommended</span>
            )}
          </span>
        </div>
        <p className={styles.templateDesc}>{template.description}</p>
      </div>
    </label>
  );
}
