// AbstractSnippet: API002
// --- API Endpoint for User Login ---
import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth/service'; // Import the login logic
import { UserCredentials } from '@/types/auth'; // Import type definition

// Define the asynchronous POST handler for the login route
export async function POST(request: NextRequest) {
    try {
        // Step 1: Parse the JSON body from the incoming request
        const body = await request.json();
        // Step 2: Extract email and password into a UserCredentials object
        const credentials: UserCredentials = {
            email: body.email,
            password: body.password,
        };

        // Step 3: Call the loginUser function from the auth service
        const result = await loginUser(credentials);

        // Step 4: Check the result from the login service
        if (result.success && result.user) { // Ensure user object exists on success
            // Step 5a: If successful, create a JSON response with a 200 OK status
            const response = NextResponse.json(result, { status: 200 });

            // Step 5b: Set an HTTP-only cookie to manage the user session
            response.cookies.set({
                name: 'session', // Cookie name
                value: result.user.id.toString(), // Store user ID as the session value
                httpOnly: true, // Prevent client-side JavaScript access
                secure: process.env.NODE_ENV === 'production', // Use secure flag in production
                sameSite: 'lax', // Mitigate CSRF attacks
                maxAge: 60 * 60 * 24 * 7, // Set cookie expiry to 1 week (in seconds)
            });
            // Step 5c: Return the response containing the success message and the session cookie
            return response;
        } else {
            // Step 6: If login failed (invalid credentials, validation error), return the result with a 401 Unauthorized status
            return NextResponse.json(result, { status: 401 });
        }
    } catch (error) {
        // Step 7: Handle unexpected errors during the process
        console.error("Login API Error:", error); // Log the error for debugging
        // Return a generic internal server error response with a 500 status
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
