// src/models/database.ts

import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { open, Database } from 'sqlite';
import logger from '../utils/logger';

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

    // Initialiseer de database als dat nog niet is gebeurd
    await initializeDatabase(dbInstance);

    return dbInstance;
}

async function initializeDatabase(db: Database) {
    try {
        // Tabel voor installaties
        await db.exec(`CREATE TABLE IF NOT EXISTS installations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            url TEXT,
            street TEXT,
            number TEXT,
            postal_code TEXT,
            city TEXT,
            country TEXT,
            update_available INTEGER DEFAULT 0,
            installed_version TEXT DEFAULT 'onbekend',
            latest_version TEXT DEFAULT 'onbekend',
            last_entity_fetch DATETIME,
            active_update_sensors INTEGER DEFAULT 0
        )`);

        await db.exec(`CREATE TABLE IF NOT EXISTS healthcheck_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            installation_id INTEGER NOT NULL,
            status TEXT NOT NULL,
            duration INTEGER NOT NULL, -- duur van de healthcheck in milliseconden
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, -- tijdstip van de healthcheck
            FOREIGN KEY (installation_id) REFERENCES installations(id)
        )`);

        await db.exec(`CREATE TABLE IF NOT EXISTS entity_states (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            entity_id TEXT NOT NULL,
            state TEXT,
            last_updated DATETIME,
            installation_id INTEGER NOT NULL,
            response_time DATETIME DEFAULT CURRENT_TIMESTAMP,
            created_at DATETIME,
            updated_at DATETIME,
            UNIQUE(entity_id, installation_id)  -- Voeg de UNIQUE constraint toe
        );`);

        await db.exec(`CREATE TABLE IF NOT EXISTS entity_state_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            entity_id TEXT NOT NULL,
            state TEXT,
            last_updated DATETIME,
            installation_id INTEGER NOT NULL,
            response_time DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (installation_id) REFERENCES installations(id)
            UNIQUE(entity_id, installation_id)  -- Voeg de UNIQUE constraint toe
        )`);



        // Nieuwe tabel voor applicatiegebruikers
        await db.exec(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            email TEXT UNIQUE,
            password TEXT,
            active BOOLEAN DEFAULT true
        )`);

        // Tabel voor gebruikers die bij een installatie horen
        await db.exec(`CREATE TABLE IF NOT EXISTS installation_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            installation_id INTEGER,
            username TEXT,
            password TEXT,
            type TEXT,
            longlivingtoken TEXT,
            preferred INTEGER DEFAULT 0, -- Nieuw veld
            FOREIGN KEY (installation_id) REFERENCES installations(id)
        )`);

        logger.info('Database is geïnitialiseerd.');
    } catch (error) {
        logger.error('Fout bij het initialiseren van de database:', error);
        throw error;
    }
}




