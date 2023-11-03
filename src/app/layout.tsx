import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vaxx Me H A R D E R",
  description:
    "Daddy Gates has all the shots that you'll ever need. Try your vaccine throwing aim with the game!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
