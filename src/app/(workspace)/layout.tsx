// app/(workspace)/layout.tsx
import Sidebar from "@/features/sidebar/components/Sidebar";
import React from "react";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 relative p-4">{children}</main>
    </div>
  );
}
