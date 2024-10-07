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

        -- Table: House
        CREATE TABLE IF NOT EXISTS House (
            house_id INTEGER PRIMARY KEY AUTOINCREMENT,
            address TEXT,
            city TEXT,
            postal_code TEXT,
            country TEXT,
            main_user_id INTEGER,
            FOREIGN KEY (main_user_id) REFERENCES User(user_id)
        );

        -- Table: Installation
        CREATE TABLE IF NOT EXISTS Installation (
            installation_id INTEGER PRIMARY KEY AUTOINCREMENT,
            house_id INTEGER,
            name TEXT,
            installation_date DATE,
            status TEXT,
            url TEXT,
            token TEXT,
            FOREIGN KEY (house_id) REFERENCES House(house_id)
        );

        CREATE TABLE IF NOT EXISTS User (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT,
            last_name TEXT,
            email TEXT UNIQUE,
            password_hash TEXT,
            role TEXT,
            gravatarUrl TEXT,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP,   
            is_online BOOLEAN DEFAULT FALSE
        );

        -- Tabel: User_House (tussenliggende tabel)
        CREATE TABLE IF NOT EXISTS User_House (
            user_id INTEGER,
            house_id INTEGER,
            PRIMARY KEY (user_id, house_id),
            FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
            FOREIGN KEY (house_id) REFERENCES House(house_id) ON DELETE CASCADE
        );

        -- Table: UserInstallation (Junction table for M:N relation between User and Installation)
        CREATE TABLE IF NOT EXISTS UserInstallation (
            user_installation_id INTEGER PRIMARY KEY AUTOINCREMENT,
            installation_id INTEGER,
            user_id INTEGER,
            role TEXT,
            access_date DATE,
            FOREIGN KEY (installation_id) REFERENCES Installation(installation_id),
            FOREIGN KEY (user_id) REFERENCES User(user_id)
        );

        -- Table: Addon
        CREATE TABLE IF NOT EXISTS Addon (
            addon_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            description TEXT,
            price REAL
        );

        -- Table: HouseAddon (Junction table for 1:N relation between House and Addon)
        CREATE TABLE IF NOT EXISTS HouseAddon (
            house_addon_id INTEGER PRIMARY KEY AUTOINCREMENT,
            house_id INTEGER,
            addon_id INTEGER,
            start_date DATE,
            end_date DATE,
            FOREIGN KEY (house_id) REFERENCES House(house_id),
            FOREIGN KEY (addon_id) REFERENCES Addon(addon_id)
        );
    `);

    console.log('Migration completed successfully');
}

migrateDatabase().catch((err) => {
    console.error('Error during database migration:', err);
});
