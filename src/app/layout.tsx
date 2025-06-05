import { Ubuntu } from "next/font/google";
import "./globals.css";
import React from "react"; // Import React for ReactNode type

// Configure the Ubuntu font
const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-ubuntu",
});

export const metadata = {
  title: "Miguel Cerne - Portfolio",
  description: "A passionate Full-Stack Software Engineer",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={`${ubuntu.variable} font-ubuntu bg-bg-color text-text-color dark:bg-bg-color-dark dark:text-text-color-dark`}
      >
        {children}
      </body>
    </html>
  );
}
