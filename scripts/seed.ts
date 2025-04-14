import db from '../src/lib/db'; // Adjust path relative to project root
import bcrypt from 'bcryptjs';

// AbstractSnippet: SCRIPT001
// --- Database Seeding Script ---
const seedDatabase = () => {
    console.log('Starting database seeding...');

    // Step 1: Define the common password and hash it
    const password = "harsha";
    const salt = bcrypt.genSaltSync(12); // Use sync for simplicity in script
    const passwordHash = bcrypt.hashSync(password, salt);
    console.log('Password hashed.');

    // Step 2: Define the dummy user data
    const dummyUsers = [
        { email: 'user1@example.com', hash: passwordHash },
        { email: 'user2@example.com', hash: passwordHash },
        { email: 'user3@example.com', hash: passwordHash },
        { email: 'user4@example.com', hash: passwordHash },
        { email: 'user5@example.com', hash: passwordHash },
    ];
    console.log(`Defined ${dummyUsers.length} dummy users.`);

    // Step 3: Prepare the insertion statement with OR IGNORE
    // OR IGNORE prevents errors if a user with the same email already exists
    const insert = db.prepare('INSERT OR IGNORE INTO users (email, password_hash) VALUES (?, ?)');

    // Step 4: Use a transaction for efficient bulk insertion
    const insertMany = db.transaction((users) => {
        let insertedCount = 0;
        for (const user of users) {
            const result = insert.run(user.email, user.hash);
            // Check if a row was actually inserted (changes > 0)
            if (result.changes > 0) {
                insertedCount++;
                console.log(`Inserted: ${user.email}`);
            } else {
                console.log(`Skipped (already exists?): ${user.email}`);
            }
        }
        console.log(`\nTotal new users inserted: ${insertedCount}`);
    });

    // Step 5: Execute the transaction
    try {
        console.log('\nExecuting transaction...');
        insertMany(dummyUsers);
        console.log('\nDatabase seeding completed successfully.');
    } catch (error) {
        console.error('\nError during database seeding:', error);
        process.exit(1); // Exit with error code if seeding fails
    } finally {
        // Step 6: Close the database connection
        db.close();
        console.log('Database connection closed.');
    }
};

// Run the seeding function
seedDatabase();
