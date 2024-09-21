// migrate_add_preferred_user.ts

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

async function migrateDatabase() {
    const dbPath = path.join(__dirname, 'data', 'database.db');

    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database,
    });

    // Verwijder de status- en timestampkolommen uit installations
    // await db.run(`ALTER TABLE installations DROP COLUMN status`);
    // await db.run(`ALTER TABLE installations DROP COLUMN last_check`);

    // Maak de nieuwe healthcheck_data tabel aan
    await db.run(`
        UPDATE installations SET update_available=0, installed_version='', latest_version='';
    `);

    console.log('Migratie succesvol voltooid');
}

migrateDatabase().catch((err) => {
    console.error('Fout bij database migratie:', err);
});
