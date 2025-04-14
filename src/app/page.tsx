// AbstractSnippet: HOME001
// --- Home Page / Authentication Portal ---
'use client'; // Mark as Client Component due to state usage (useState)

import { useState } from 'react';
import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm'; // Import Login Form component
import RegisterForm from '@/components/auth/RegisterForm'; // Import Register Form component
import Button from '@/components/ui/Button'; // Import reusable Button component

// Define the Home page component
export default function Home() {
  // Step 1: Initialize state to track whether the Login or Register form should be displayed
  // Defaults to showing the Login form (isLogin = true)
  const [isLogin, setIsLogin] = useState(true);

  // Step 2: Render the main container div
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8 px-4"> {/* Added horizontal padding */}
      {/* Step 3: Render the welcome message section */}
      <div className="text-center space-y-4">
        {/* Step 3a: Display the main heading */}
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
          Welcome to the Healthcare App
        </h1>
        {/* Step 3b: Display a prompt to login or register */}
        <p className="text-lg text-gray-300">
          Please sign in or create an account to continue
        </p>
      </div>

      {/* Step 4: Render the toggle buttons for Login/Register */}
      <div className="flex space-x-4 mb-8">
        {/* Step 4a: Login Button */}
        <Button
          // Set variant based on 'isLogin' state (primary if active, secondary if inactive)
          variant={isLogin ? 'primary' : 'secondary'}
          // Set onClick handler to update state to show Login form
          onClick={() => setIsLogin(true)}
        >
          Login
        </Button>
        {/* Step 4b: Register Button */}
        <Button
          // Set variant based on 'isLogin' state (primary if active, secondary if inactive)
          variant={!isLogin ? 'primary' : 'secondary'}
          // Set onClick handler to update state to show Register form
          onClick={() => setIsLogin(false)}
        >
          Register
        </Button>
      </div>

      {/* Step 5: Conditionally render either the Login or Register form based on 'isLogin' state */}
      <div className="w-full max-w-md">
        {isLogin ? <LoginForm /> : <RegisterForm />}
      </div>

      {/* Step 6: Render a link to view the demo dashboard (optional) */}
      <div className="text-center text-gray-400 mt-8">
        <Link
          href="/dashboard"
          className="text-blue-500 hover:text-blue-400 underline"
        >
          View Demo Dashboard (No Auth Required)
        </Link>
      </div>
    </div>
  );
}
