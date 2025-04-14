// AbstractSnippet: AUTH001
// --- Service Setup: Imports, Validation Schemas, Custom Error ---
import bcrypt from 'bcryptjs';
import db from '../db';
import { User, UserCredentials, AuthResponse } from '@/types/auth';
import { z } from 'zod';

// Define Zod schema for email validation
const emailSchema = z.string().email({ message: "Invalid email format" });
// Define Zod schema for password validation (length constraints)
const passwordSchema = z.string().min(6, { message: "Password must be at least 6 characters long" }).max(100, { message: "Password must be no more than 100 characters long" });

// Define a custom error class for authentication-specific issues
export class AuthenticationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AuthenticationError'; // Set error name for easier identification
    }
}

// AbstractSnippet: AUTH002
// --- User Registration Logic ---
export async function registerUser(credentials: UserCredentials): Promise<AuthResponse> {
    try {
        // Step 1: Validate incoming email and password using Zod schemas
        emailSchema.parse(credentials.email);
        passwordSchema.parse(credentials.password);

        // Step 2: Generate a salt for password hashing
        const salt = await bcrypt.genSalt(12);
        // Step 3: Hash the user's password using bcrypt
        const passwordHash = await bcrypt.hash(credentials.password, salt);

        // Step 4: Prepare the SQL statement for inserting the new user
        const stmt = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)');
        // Step 5: Execute the insert statement with email and hashed password
        const result = stmt.run(credentials.email, passwordHash);

        // Step 6: Check if the insert operation was successful (1 row changed)
        if (result.changes === 1) {
            // Step 7: Retrieve the newly created user's data (excluding password hash)
            const user = db.prepare('SELECT id, email, created_at, updated_at FROM users WHERE id = ?')
                .get(result.lastInsertRowid) as User;

            // Step 8: Return a success response with user data
            return {
                success: true,
                message: 'User registered successfully',
                user
            };
        }
        // Step 9: If insert failed, throw a custom authentication error
        throw new AuthenticationError('Failed to register user');
    } catch (error) {
        // Step 10: Handle potential errors during registration
        // Check if the error is a Zod validation error
        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: 'Invalid input: ' + error.errors[0].message // Return specific validation message
            };
        }
        // Check if the error is a SQLite unique constraint violation (email already exists)
        if (error instanceof Error && 'code' in error && error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return {
                success: false,
                message: 'Email already registered'
            };
        }
        // Handle AuthenticationError thrown in Step 9 or other generic errors
        return {
            success: false,
            // Use the message from AuthenticationError or a generic failure message
            message: error instanceof Error ? error.message : 'Registration failed'
        };
    }
}

// AbstractSnippet: AUTH003
// --- User Login Logic ---
export async function loginUser(credentials: UserCredentials): Promise<AuthResponse> {
    try {
        // Step 1: Validate incoming email and password using Zod schemas
        emailSchema.parse(credentials.email);
        passwordSchema.parse(credentials.password);

        // Step 2: Prepare SQL statement to find user by email
        const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
        // Step 3: Execute the select statement to find the user
        const user = stmt.get(credentials.email) as (User & { password_hash: string }) | undefined;

        // Step 4: Check if a user with the provided email was found
        if (!user) {
            // Return failure if user does not exist
            return {
                success: false,
                message: 'Invalid credentials' // Generic message for security
            };
        }

        // Step 5: Compare the provided password with the stored hash using bcrypt
        const isValid = await bcrypt.compare(credentials.password, user.password_hash);
        // Step 6: Check if the password comparison was successful
        if (!isValid) {
            // Return failure if password does not match
            return {
                success: false,
                message: 'Invalid credentials' // Generic message for security
            };
        }

        // Step 7: Remove the password hash from the user object before returning
        const { password_hash, ...safeUser } = user;
        // Step 8: Return a success response with the user data (excluding hash)
        return {
            success: true,
            message: 'Login successful',
            user: safeUser
        };
    } catch (error) {
        // Step 9: Handle potential errors during login
        // Check if the error is a Zod validation error
        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: 'Invalid input: ' + error.errors[0].message // Return specific validation message
            };
        }
        // Handle other generic errors
        return {
            success: false,
            // Use the error message if available, otherwise a generic failure message
            message: error instanceof Error ? error.message : 'Login failed'
        };
    }
}
