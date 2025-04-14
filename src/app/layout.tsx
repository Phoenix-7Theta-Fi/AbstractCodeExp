import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar'; // Import the Navbar component
import { AuthProvider } from '@/context/AuthContext'; // Import the AuthProvider

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "HealthCare Dashboard",
  description: "A modern healthcare management dashboard",
};

// AbstractSnippet: LAYOUT001
// --- Root Layout Component ---
export default function RootLayout({
  children, // The page content to be rendered within the layout
}: Readonly<{
  children: React.ReactNode; // Type definition for children prop
}>) {
  // Step 1: Render the base HTML structure
  return (
    <html lang="en">
      {/* Step 2: Apply font variables and base styling to the body */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-900 text-gray-100`} // Added dark theme base colors
      >
        {/* Wrap content with AuthProvider */}
        <AuthProvider>
          {/* Insert Navbar before the main content */}
          <Navbar />
          {/* Step 3: Define the main content area with container styling */}
          <main className="container mx-auto px-4 py-8">
            {/* Step 4: Render the child components (page content) passed to the layout */}
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
