// AbstractSnippet: API004
// --- API Endpoint for Fetching Current User Data ---
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { User } from '@/types/auth';

// Define the asynchronous GET handler for the user route
export async function GET(request: NextRequest) {
    try {
        // Step 1: Get the session cookie containing the user ID
        const sessionCookie = request.cookies.get('session');
        
        // Step 2: Check if session cookie exists
        if (!sessionCookie?.value) {
            return NextResponse.json(
                { success: false, message: 'Not authenticated' },
                { status: 401 }
            );
        }

        // Step 3: Get user ID from session cookie
        const userId = parseInt(sessionCookie.value);

        // Step 4: Prepare and execute SQL query to fetch user data
        const stmt = db.prepare('SELECT id, email, created_at, updated_at FROM users WHERE id = ?');
        const user = stmt.get(userId) as User | undefined;

        // Step 5: Check if user exists
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        // Step 6: Return user data
        return NextResponse.json({
            success: true,
            user
        }, { status: 200 });

    } catch (error) {
        // Step 7: Handle any unexpected errors
        console.error("User API Error:", error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}