// AbstractSnippet: UI001
// --- Reusable UI Button Component ---
import { ButtonHTMLAttributes, ReactNode } from 'react'; // Import necessary types from React

// Define the props interface for the Button component
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode; // Ensure children prop is explicitly typed
  variant?: 'primary' | 'secondary'; // Optional variant prop for styling
  isLoading?: boolean; // Optional prop to show a loading state
  className?: string; // Allow additional custom classes
}

// Define the Button component
export default function Button({
  children, // Content of the button
  variant = 'primary', // Default variant is 'primary'
  isLoading = false, // Default loading state is false
  className = '', // Default className is empty
  disabled, // Standard HTML disabled attribute
  ...props // Spread any other standard button attributes
}: ButtonProps) {
  // --- Styling ---
  // Base styles applied to all button variants
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 inline-flex items-center justify-center'; // Added flex for loading spinner alignment
  // Style definitions for different variants
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:hover:bg-blue-600',
    secondary: 'bg-gray-700 text-white hover:bg-gray-800 disabled:hover:bg-gray-700'
  };
  // Combine base styles, variant styles, and any custom className
  const combinedClassName = `${baseStyles} ${variants[variant]} ${className}`;

  // --- Rendering ---
  return (
    <button
      className={combinedClassName}
      // Disable the button if isLoading is true or if the standard disabled prop is true
      disabled={isLoading || disabled}
      {...props} // Apply any other passed-in button props
    >
      {/* Conditional Rendering for Loading State */}
      {isLoading ? (
        // Show loading spinner and text if isLoading is true
        <> {/* Use fragment to group elements */}
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : (
        // Show the button's children (text or other elements) if not loading
        children
      )}
    </button>
  );
}
