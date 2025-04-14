// AbstractSnippet: TYPES001
// --- TypeScript Interfaces for Authentication ---

// Defines the structure of a User object as retrieved from the database
// (excluding sensitive information like password hash).
export interface User {
    id: number; // Unique identifier for the user
    email: string; // User's email address (used for login)
    created_at: string; // Timestamp of user creation (ISO 8601 format)
    updated_at: string; // Timestamp of last user update (ISO 8601 format)
}

// Defines the structure for user credentials (email and password)
// used during login and registration requests.
export interface UserCredentials {
    email: string; // User's email address
    password: string; // User's plain text password (only used temporarily)
}

// Defines the structure for the response object returned by authentication functions (login/register).
export interface AuthResponse {
    success: boolean; // Indicates whether the authentication operation was successful
    message: string; // Provides a message about the outcome (e.g., "Login successful", "Invalid credentials")
    // Optional User object included on successful authentication.
    // Uses Omit utility type, although 'password_hash' is not in the base User interface,
    // this indicates the intent that password hashes should never be included here.
    user?: Omit<User, 'password_hash'>;
}
