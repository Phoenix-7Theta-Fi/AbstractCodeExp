'use client';

import { useEffect, useState } from 'react';
import DietAnalytics from '@/components/DietAnalytics/DietAnalytics';
import { User } from '@/types/auth';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // AbstractSnippet: DASH002_DATA
  // --- Fetch User Data Effect ---
  useEffect(() => {
    // Step 1: Define an async function to fetch user data from the API
    async function fetchUserData() {
      try {
        // Step 1a: Make a GET request to the user API endpoint
        const response = await fetch('/api/auth/user');
        // Step 1b: Parse the JSON response
        const data = await response.json();
        
        // Step 1c: If the request was successful, update the user state
        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        // Step 1d: Log any errors during the fetch operation
        console.error('Failed to fetch user data:', error);
      } finally {
        // Step 1e: Set loading state to false regardless of success or failure
        setLoading(false);
      }
    }

    // Step 2: Call the fetch function
    fetchUserData();
  }, []); // Empty dependency array ensures this runs only once on mount

  // AbstractSnippet: DASH002_LOAD
  // --- Loading State Display ---
  // Step 1: Check if the loading state is true
  if (loading) {
    // Step 2: If loading, return a simple loading indicator UI
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-xl text-gray-300">Loading...</div>
      </div>
    );
  }

  // AbstractSnippet: DASH002_RENDER
  // --- Main Dashboard Content ---
  // Step 1: Render the main container div with flex layout and spacing
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
      {/* Step 2: Render the welcome message section */}
      <div className="space-y-6 max-w-2xl text-center">
        {/* Step 2a: Display the main heading, personalized with user email if available */}
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
          Welcome{user ? `, ${user.email}` : ' to Healthcare Dashboard'}
        </h1>
        {/* Step 2b: Display the introductory paragraph */}
        <p className="text-lg text-gray-300">
          Your central hub for managing healthcare services and patient care
        </p>
      </div>
      {/* Step 3: Render the DietAnalytics component */}
      <DietAnalytics />
    </div>
  );
}
