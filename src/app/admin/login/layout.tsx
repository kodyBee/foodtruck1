import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | Crown Majestic Kitchen",
  description: "Admin dashboard login",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
