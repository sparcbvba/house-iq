// src/models/database.ts

import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { open, Database } from 'sqlite';

const dbFileName = 'database.db';

// Zorg ervoor dat de data map bestaat
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Definieer het pad naar het databasebestand
const dbPath = path.join(dataDir, dbFileName);

let dbInstance: Database | null = null;

export async function getDbInstance(): Promise<Database> {
    if (dbInstance) {
        return dbInstance;
    }
    dbInstance = await open({
        filename: dbPath,
        driver: sqlite3.Database,
    });

    return dbInstance;
}




