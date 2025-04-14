// AbstractSnippet: AUTH004
// --- Client Component: Login Form ---
'use client'; // Mark this as a Client Component

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Hook for client-side navigation
import Button from '../ui/Button'; // Reusable Button component
import { useAuth } from '@/context/AuthContext'; // Import useAuth hook

// Define the LoginForm component
export default function LoginForm() {
  // Initialize router for navigation and auth context
  const router = useRouter();
  const auth = useAuth(); // Get auth context
  // State for tracking loading status during form submission
  const [isLoading, setIsLoading] = useState(false);
  // State for storing and displaying login errors
  const [error, setError] = useState('');

  // Asynchronous function to handle form submission
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    // Prevent default form submission behavior (page reload)
    event.preventDefault();
    // Set loading state to true and clear previous errors
    setIsLoading(true);
    setError('');

    // Step 1: Get form data using the FormData API
    const formData = new FormData(event.currentTarget);
    // Step 2: Extract email and password from form data
    const credentials = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    try {
      // Step 3: Send a POST request to the login API endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // Set content type header
        body: JSON.stringify(credentials), // Send credentials as JSON string
      });

      // Step 4: Parse the JSON response from the API
      const data = await response.json();

      // Step 5: Check if the login was successful based on the API response
      if (data.success && data.user) { // Ensure user data is present
        // Step 6: Update global auth state using context
        auth.login(data.user);

        // Step 7: Redirect to dashboard
        router.push('/dashboard');
        // Note: router.refresh() calls removed as context update handles state
      } else {
        // Step 8: If failed (invalid credentials, etc.), set the error message from the API response
        setError(data.message || 'Login failed'); // Use API message or a default
      }
    } catch (err) {
      // Step 9: Handle network errors or other issues during the fetch operation
      console.error("Login Form Error:", err); // Log the error
      setError('An error occurred during login'); // Set a generic error message
    } finally {
      // Step 10: Always set loading state back to false after the attempt completes
      setIsLoading(false);
    }
  }

  // Render the login form JSX
  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      {/* Email Input Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email" // Name attribute used by FormData
          required // HTML5 validation
          autoComplete="email" // Improve UX with autofill
          className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Password Input Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password" // Name attribute used by FormData
          required // HTML5 validation
          autoComplete="current-password" // Hint for password managers
          className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Error Display Area */}
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      {/* Submit Button */}
      <Button type="submit" isLoading={isLoading} className="w-full">
        Log in
      </Button>
    </form>
  );
}
