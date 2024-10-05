import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

async function migrateDatabase() {
    const dbPath = path.join(__dirname, 'data', 'database.db');

    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database,
    });

    // Start schema migration
    await db.exec(`
        UPDATE User
        SET role = CASE
            WHEN first_name = 'admin' THEN 'admin'
            WHEN first_name = 'home_owner' THEN 'home_owner'
            WHEN first_name = 'home_viewer' THEN 'home_viewer'
        END
        WHERE first_name IN ('admin', 'home_owner', 'home_viewer');

    `);

    console.log('Population completed successfully');
}

migrateDatabase().catch((err) => {
    console.error('Error during database population:', err);
});
