"use client";

import { useState } from "react";
import styles from "@/components/AuthCard.module.css";

type Props = {
  id: string;
  name: string;
  label: string;
  autoComplete: "new-password" | "current-password";
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  ariaInvalid?: boolean;
  ariaDescribedBy?: string;
};

export function PasswordFieldWithToggle({
  id,
  name,
  label,
  autoComplete,
  value,
  onChange,
  disabled,
  ariaInvalid,
  ariaDescribedBy,
}: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <div className={styles.inputWrap}>
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          className={`${styles.input} ${styles.inputWithToggle}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          aria-invalid={ariaInvalid ? "true" : undefined}
          aria-describedby={ariaDescribedBy}
        />
        <button
          type="button"
          className={styles.passwordToggle}
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}
