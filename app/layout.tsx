import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SU Kilpailutulokset | Seinäjoen Urheilijat',
  description: 'Luistelukilpailujen tulokset - Seinäjoen Urheilijat | Skating competition results',
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

