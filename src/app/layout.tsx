// src/app/layout.js
import { Ubuntu } from "next/font/google";
import "./globals.css";

// Configure the Ubuntu font
const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"], // Add the weights you need
  variable: "--font-ubuntu", // This creates a CSS variable
});

export const metadata = {
  title: "Miguel Cerne - Portfolio",
  description: "A passionate Full-Stack Software Engineer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Apply the font class to the body or a specific container */}
      <body
        className={`${ubuntu.variable} font-ubuntu bg-bg-color text-text-color dark:bg-bg-color-dark dark:text-text-color-dark`}
      >
        {children}
      </body>
    </html>
  );
}
