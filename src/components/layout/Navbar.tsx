'use client';

import React, { useState } from 'react'; // Removed useEffect
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
// import { User } from '@/types/auth'; // User type might not be needed directly here anymore
import { useAuth } from '@/context/AuthContext'; // Import useAuth hook

// AbstractSnippet: NAV001_SIGNOUT
// --- Sign Out Button Logic ---
const SignOutButton = () => {
  // Step 1: Initialize router, loading state, and auth context
  const router = useRouter();
  const auth = useAuth(); // Get auth context
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 2: Define the sign-out handler
  const handleSignOut = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Step 3: Call the logout API endpoint (API003)
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      // Step 4: Check if the API call was successful
      if (!response.ok) {
        throw new Error('Failed to sign out');
      }

      // Step 5: Update global auth state via context
      auth.logout();

      // Step 6: Redirect to the home/login page on success
      router.push('/');
      router.refresh(); // Refresh server components (optional, depends if server state needs update)
    } catch (err) {
      // Step 7: Handle errors during sign-out
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsLoading(false); // Ensure loading state is reset on error
    }
    // Loading state is implicitly handled by redirection on success
  };

  // Step 7: Render the button with loading state and error display
  return (
    <div>
      <Button
        onClick={handleSignOut}
        isLoading={isLoading}
        disabled={isLoading}
        variant="secondary" // Use secondary variant for less emphasis
      >
        Sign Out
      </Button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};


// AbstractSnippet: NAV001
// --- Main Navbar Component (Conditional Rendering) ---
export const Navbar = () => {
  // Step 1: Get authentication status and loading state from context
  const { isAuthenticated, isLoading } = useAuth();

  // Step 2: Show loading indicator while context is initializing
  if (isLoading) {
    // Optionally return a placeholder or null during loading
    return null; // Or a loading spinner component
  }

  // Step 3: Render the navbar only if authenticated (based on context)
  if (!isAuthenticated) {
    return null; // Don't render anything if not authenticated
  }

  // Step 4: Render the actual navbar content if authenticated
  return (
    <nav className="bg-gray-800 text-white p-4 mb-8 shadow-md">
      {/* Step 5a: Create a flex container for alignment */}
      <div className="container mx-auto flex justify-between items-center">
        {/* Step 5b: Display the application title */}
        <h1 className="text-xl font-semibold">Healthcare Dashboard</h1>
        {/* Step 5c: Include the Sign Out button component */}
        <SignOutButton />
      </div>
    </nav>
  );
};
