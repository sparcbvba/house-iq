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
        -- DROP TABLE House;
        -- DROP TABLE Installation;
        DROP TABLE User;
        -- DROP TABLE UserInstallation;
        -- DROP TABLE Addon;
        -- DROP TABLE HouseAddon;
    `);

    console.log('drop completed successfully');
}

migrateDatabase().catch((err) => {
    console.error('Error during database drops:', err);
});
