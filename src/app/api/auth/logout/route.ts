// AbstractSnippet: API003
// --- API Endpoint for User Logout ---
import { NextResponse } from 'next/server';

// Define the asynchronous POST handler for the logout route
export async function POST() {
    // Step 1: Create a JSON response indicating successful logout with a 200 OK status
    const response = NextResponse.json(
        { success: true, message: 'Logged out successfully' },
        { status: 200 }
    );

    // Step 2: Clear the session cookie by setting its value to empty and expiration date to the past
    response.cookies.set({
        name: 'session', // Cookie name (must match the one set during login)
        value: '', // Empty value
        httpOnly: true, // Keep it httpOnly
        expires: new Date(0), // Set expiration date to epoch (Jan 1, 1970)
        secure: process.env.NODE_ENV === 'production', // Match secure flag from login
        sameSite: 'lax', // Match sameSite attribute from login
    });

    // Step 3: Return the response which includes the instruction to clear the cookie
    return response;
}
