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

    // Voeg het 'preferred' veld toe aan de 'installation_users' tabel
    await db.exec(`ALTER TABLE installation_users ADD COLUMN preferred INTEGER DEFAULT 0`);

    // Haal alle installaties op
    const installations = await db.all<{ id: number }[]>('SELECT id FROM installations');

    for (const installation of installations) {
        // Haal de eerste gebruiker op voor elke installatie
        const user = await db.get<{ id: number }>(
            'SELECT id FROM installation_users WHERE installation_id = ? LIMIT 1',
            [installation.id]
        );

        if (user) {
            // Markeer de eerste gebruiker als voorkeursgebruiker
            await db.run('UPDATE installation_users SET preferred = 1 WHERE id = ?', [user.id]);
        }
    }

    console.log('Database migratie voltooid: preferred veld toegevoegd en eerste gebruikers gemarkeerd als voorkeursgebruiker.');
}

migrateDatabase().catch((err) => {
    console.error('Fout bij database migratie:', err);
});
