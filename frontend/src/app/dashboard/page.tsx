import { DashboardShell } from "@/components/dashboard/DashboardShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — SENTINEL Threat Intelligence",
  description: "Three-pane intelligence workspace for financial fraud investigations.",
};

export default function DashboardPage() {
  return <DashboardShell />;
}

