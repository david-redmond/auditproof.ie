"use client";

import { useState, useRef, useEffect } from "react";
import { DashboardNav } from "./DashboardNav";
import { DashboardSidebar } from "./DashboardSidebar";
import sidebarStyles from "./DashboardSidebar.module.css";

type Props = {
  userName: string;
  userEmail: string;
  organisationName: string;
  canManageUsers: boolean;
  children: React.ReactNode;
};

export function DashboardShell({ userName, userEmail, organisationName, canManageUsers, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const closeSidebar = () => {
    setSidebarOpen(false);
    hamburgerRef.current?.focus();
  };

  return (
    <>
      <DashboardNav
        userName={userName}
        userEmail={userEmail}
        canManageUsers={canManageUsers}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        onSidebarClose={closeSidebar}
        hamburgerRef={hamburgerRef}
      />
      <div className={sidebarStyles.layout}>
        <DashboardSidebar
          isOpen={sidebarOpen}
          onClose={closeSidebar}
          canManageUsers={canManageUsers}
          organisationName={organisationName}
        />
        <div className={sidebarStyles.main}>{children}</div>
      </div>
    </>
  );
}
