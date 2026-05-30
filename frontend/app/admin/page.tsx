import type { Metadata } from "next";
import { AdminKnowledge } from "@/app/_components/admin/admin-knowledge";

export const metadata: Metadata = {
  title: "Knowledge-base Admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminKnowledge />;
}
