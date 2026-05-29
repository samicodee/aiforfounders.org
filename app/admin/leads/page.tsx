import type { Metadata } from "next";
import { AdminLeads } from "@/app/admin/leads/AdminLeads";

export const metadata: Metadata = {
  title: "Lead Admin | AI for Founders",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LeadsAdminPage() {
  return <AdminLeads />;
}
