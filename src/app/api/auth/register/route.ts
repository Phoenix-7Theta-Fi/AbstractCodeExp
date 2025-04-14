// AbstractSnippet: API001
// --- API Endpoint for User Registration ---
import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth/service'; // Import the registration logic
import { UserCredentials } from '@/types/auth'; // Import type definition

// Define the asynchronous POST handler for the registration route
export async function POST(request: NextRequest) {
    try {
        // Step 1: Parse the JSON body from the incoming request
        const body = await request.json();
        // Step 2: Extract email and password into a UserCredentials object
        const credentials: UserCredentials = {
            email: body.email,
            password: body.password,
        };

        // Step 3: Call the registerUser function from the auth service
        const result = await registerUser(credentials);

        // Step 4: Check the result from the registration service
        if (result.success) {
            // Step 5a: If successful, return the result with a 201 Created status
            return NextResponse.json(result, { status: 201 });
        } else {
            // Step 5b: If failed (e.g., validation error, email exists), return the result with a 400 Bad Request status
            return NextResponse.json(result, { status: 400 });
        }
    } catch (error) {
        // Step 6: Handle unexpected errors during the process
        console.error("Registration API Error:", error); // Log the error for debugging
        // Return a generic internal server error response with a 500 status
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
