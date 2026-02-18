"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import styles from "./settings.module.css";

type ToastContextValue = { showToast: (message: string) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

export function useSettingsToast() {
  const ctx = useContext(ToastContext);
  return ctx ?? { showToast: () => {} };
}

export function SettingsToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMessage(msg);
    timeoutRef.current = setTimeout(() => {
      setMessage(null);
      timeoutRef.current = null;
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message != null && (
        <div
          className={styles.toast}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {message}
        </div>
      )}
    </ToastContext.Provider>
  );
}
