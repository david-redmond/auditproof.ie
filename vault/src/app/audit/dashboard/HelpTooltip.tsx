"use client";

import { useState } from "react";
import styles from "./HelpTooltip.module.css";

type Props = { text: string };

export function HelpTooltip({ text }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className={styles.wrap}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      <span
        className={styles.icon}
        aria-label="Help"
        tabIndex={0}
        role="img"
      >
        ?
      </span>
      {visible && (
        <span className={styles.tooltip} role="tooltip">
          {text}
        </span>
      )}
    </span>
  );
}
