#!/bin/bash

# Maak de hoofdmap 'src' aan als deze nog niet bestaat
mkdir -p src

# Navigeer naar de 'src' map
cd src || exit

# Maak 'app.ts' aan en schrijf de code
cat << 'EOF' > app.ts
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import bodyParser from 'body-parser';
import session from 'express-session';
import authRoutes from './routes/authRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import installationRoutes from './routes/installationRoutes';
import userRoutes from './routes/userRoutes';
import { Logger } from './utils/logger';
import { startHealthCheck } from './healthCheck';

dotenv.config();

const app = express();
const logger = Logger.getInstance();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: false,
}));

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
app.use('/', authRoutes);
app.use('/', dashboardRoutes);
app.use('/', installationRoutes);
app.use('/', userRoutes);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Start de health check
startHealthCheck();

// Start de server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(\`Server draait op http://localhost:\${PORT}\`);
});
EOF

# Maak de benodigde directories aan
mkdir -p controllers services models routes utils views middleware

# Controllers
# authController.ts
cat << 'EOF' > controllers/authController.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { Logger } from '../utils/logger';

const logger = Logger.getInstance();

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    public showLoginForm = (req: Request, res: Response) => {
        res.render('login');
    };

    public login = async (req: Request, res: Response) => {
        try {
            const { username, password } = req.body;
            const user = await this.authService.authenticate(username, password);
            if (user) {
                req.session.user = user;
                res.redirect('/dashboard');
            } else {
                res.render('login', { error: 'Ongeldige gebruikersnaam of wachtwoord' });
            }
        } catch (error) {
            logger.error('Fout bij inloggen:', error);
            res.status(500).send('Er is een fout opgetreden bij het inloggen.');
        }
    };

    public logout = (req: Request, res: Response) => {
        req.session.destroy((err) => {
            if (err) {
                logger.error('Fout bij uitloggen:', err);
            }
            res.redirect('/login');
        });
    };
}
EOF

# installationController.ts
cat << 'EOF' > controllers/installationController.ts
import { Request, Response } from 'express';
import { InstallationService } from '../services/installationService';
import { Logger } from '../utils/logger';

const logger = Logger.getInstance();

export class InstallationController {
    private installationService: InstallationService;

    constructor() {
        this.installationService = new InstallationService();
    }

    public showInstallations = async (req: Request, res: Response) => {
        try {
            const installations = await this.installationService.getAllInstallations();
            res.render('dashboard', { installations });
        } catch (error) {
            logger.error('Fout bij het ophalen van installaties:', error);
            res.status(500).send('Er is een fout opgetreden bij het ophalen van de installaties.');
        }
    };

    public showInstallationForm = (req: Request, res: Response) => {
        res.render('installation_form');
    };

    public createInstallation = async (req: Request, res: Response) => {
        try {
            await this.installationService.createInstallation(req.body);
            res.redirect('/dashboard');
        } catch (error) {
            logger.error('Fout bij het aanmaken van een installatie:', error);
            res.status(500).send('Er is een fout opgetreden bij het aanmaken van de installatie.');
        }
    };

    public showEditForm = async (req: Request, res: Response) => {
        try {
            const installationId = parseInt(req.params.id);
            const installation = await this.installationService.getInstallationById(installationId);
            if (!installation) {
                return res.status(404).send('Installatie niet gevonden.');
            }
            res.render('installation_edit', { installation });
        } catch (error) {
            logger.error('Fout bij het ophalen van installatie:', error);
            res.status(500).send('Er is een fout opgetreden bij het ophalen van de installatie.');
        }
    };

    public updateInstallation = async (req: Request, res: Response) => {
        try {
            const installationId = parseInt(req.params.id);
            await this.installationService.updateInstallation(installationId, req.body);
            res.redirect('/dashboard');
        } catch (error) {
            logger.error('Fout bij het bijwerken van installatie:', error);
            res.status(500).send('Er is een fout opgetreden bij het bijwerken van de installatie.');
        }
    };
}
EOF

# userController.ts
cat << 'EOF' > controllers/userController.ts
import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { Logger } from '../utils/logger';

const logger = Logger.getInstance();

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    public showUsers = async (req: Request, res: Response) => {
        try {
            const installationId = parseInt(req.params.installationId);
            const users = await this.userService.getUsersByInstallationId(installationId);
            res.render('users', { users, installationId });
        } catch (error) {
            logger.error('Fout bij het ophalen van gebruikers:', error);
            res.status(500).send('Er is een fout opgetreden bij het ophalen van de gebruikers.');
        }
    };

    public showUserForm = (req: Request, res: Response) => {
        const installationId = parseInt(req.params.installationId);
        res.render('user_form', { installationId });
    };

    public createUser = async (req: Request, res: Response) => {
        try {
            const installationId = parseInt(req.params.installationId);
            await this.userService.createUser(installationId, req.body);
            res.redirect(\`/installations/\${installationId}/users\`);
        } catch (error) {
            logger.error('Fout bij het aanmaken van een gebruiker:', error);
            res.status(500).send('Er is een fout opgetreden bij het aanmaken van de gebruiker.');
        }
    };

    public showEditForm = async (req: Request, res: Response) => {
        try {
            const userId = parseInt(req.params.userId);
            const user = await this.userService.getUserById(userId);
            if (!user) {
                return res.status(404).send('Gebruiker niet gevonden.');
            }
            res.render('user_edit', { user });
        } catch (error) {
            logger.error('Fout bij het ophalen van gebruiker:', error);
            res.status(500).send('Er is een fout opgetreden bij het ophalen van de gebruiker.');
        }
    };

    public updateUser = async (req: Request, res: Response) => {
        try {
            const userId = parseInt(req.params.userId);
            await this.userService.updateUser(userId, req.body);
            const user = await this.userService.getUserById(userId);
            res.redirect(\`/installations/\${user.installation_id}/users\`);
        } catch (error) {
            logger.error('Fout bij het bijwerken van gebruiker:', error);
            res.status(500).send('Er is een fout opgetreden bij het bijwerken van de gebruiker.');
        }
    };
}
EOF

# Services
# installationService.ts
cat << 'EOF' > services/installationService.ts
import { InstallationModel } from '../models/installationModel';
import { Installation } from '../utils/types';

export class InstallationService {
    private installationModel: InstallationModel;

    constructor() {
        this.installationModel = new InstallationModel();
    }

    public async getAllInstallations(): Promise<Installation[]> {
        return this.installationModel.getAllInstallations();
    }

    public async getInstallationById(id: number): Promise<Installation | undefined> {
        return this.installationModel.getInstallationById(id);
    }

    public async createInstallation(data: any): Promise<void> {
        const installationData: Partial<Installation> = {
            name: data.name,
            domain: data.domain,
            ssl: data.ssl ? 1 : 0,
            street: data.street,
            number: data.number,
            postal_code: data.postal_code,
            city: data.city,
            country: data.country,
        };
        await this.installationModel.createInstallation(installationData);
    }

    public async updateInstallation(id: number, data: any): Promise<void> {
        const installationData: Partial<Installation> = {
            name: data.name,
            domain: data.domain,
            ssl: data.ssl ? 1 : 0,
            street: data.street,
            number: data.number,
            postal_code: data.postal_code,
            city: data.city,
            country: data.country,
        };
        await this.installationModel.updateInstallation(id, installationData);
    }
}
EOF

# userService.ts
cat << 'EOF' > services/userService.ts
import { UserModel } from '../models/userModel';
import { User } from '../utils/types';
import { hashPassword, encrypt } from '../utils/encryption';

export class UserService {
    private userModel: UserModel;

    constructor() {
        this.userModel = new UserModel();
    }

    public async getUsersByInstallationId(installationId: number): Promise<User[]> {
        return this.userModel.getUsersByInstallationId(installationId);
    }

    public async getUserById(id: number): Promise<User | undefined> {
        return this.userModel.getUserById(id);
    }

    public async createUser(installationId: number, data: any): Promise<void> {
        const hashedPassword = await hashPassword(data.password);
        const encryptedToken = encrypt(data.longlivingtoken);

        const userData: Partial<User> = {
            installation_id: installationId,
            username: data.username,
            password: hashedPassword,
            type: data.type,
            longlivingtoken: encryptedToken,
        };

        await this.userModel.createUser(userData);
    }

    public async updateUser(id: number, data: any): Promise<void> {
        const user = await this.userModel.getUserById(id);
        if (!user) throw new Error('Gebruiker niet gevonden');

        const updatedData: Partial<User> = {
            username: data.username,
            type: data.type,
        };

        if (data.password) {
            updatedData.password = await hashPassword(data.password);
        } else {
            updatedData.password = user.password;
        }

        if (data.longlivingtoken) {
            updatedData.longlivingtoken = encrypt(data.longlivingtoken);
        } else {
            updatedData.longlivingtoken = user.longlivingtoken;
        }

        await this.userModel.updateUser(id, updatedData);
    }
}
EOF

# Models
# database.ts
cat << 'EOF' > models/database.ts
import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { open, Database } from 'sqlite';
import { Logger } from '../utils/logger';

const logger = Logger.getInstance();

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
        await db.exec(\`CREATE TABLE IF NOT EXISTS installations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            domain TEXT,
            ssl INTEGER DEFAULT 0,
            street TEXT,
            number TEXT,
            postal_code TEXT,
            city TEXT,
            country TEXT,
            status TEXT DEFAULT 'unknown'
        )\`);

        await db.exec(\`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            installation_id INTEGER,
            username TEXT,
            password TEXT,
            type TEXT,
            longlivingtoken TEXT,
            FOREIGN KEY (installation_id) REFERENCES installations(id)
        )\`);

        logger.info('Database is geïnitialiseerd.');
    } catch (error) {
        logger.error('Fout bij het initialiseren van de database:', error);
        throw error;
    }
}
EOF

# installationModel.ts
cat << 'EOF' > models/installationModel.ts
import { Database } from 'sqlite';
import { getDbInstance } from './database';
import { Installation } from '../utils/types';

export class InstallationModel {
    private db: Database;

    constructor() {
        getDbInstance().then((db) => {
            this.db = db;
        });
    }

    public async getInstallationById(id: number): Promise<Installation | undefined> {
        return this.db.get<Installation>('SELECT * FROM installations WHERE id = ?', [id]);
    }

    public async getAllInstallations(): Promise<Installation[]> {
        return this.db.all<Installation[]>('SELECT * FROM installations');
    }

    public async createInstallation(installation: Partial<Installation>): Promise<void> {
        const { name, domain, ssl, street, number, postal_code, city, country } = installation;
        await this.db.run(
            \`INSERT INTO installations (name, domain, ssl, street, number, postal_code, city, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?)\`,
            [name, domain, ssl, street, number, postal_code, city, country]
        );
    }

    public async updateInstallation(id: number, installation: Partial<Installation>): Promise<void> {
        const { name, domain, ssl, street, number, postal_code, city, country } = installation;
        await this.db.run(
            \`UPDATE installations SET name = ?, domain = ?, ssl = ?, street = ?, number = ?, postal_code = ?, city = ?, country = ? WHERE id = ?\`,
            [name, domain, ssl, street, number, postal_code, city, country, id]
        );
    }

    public async updateInstallationStatus(id: number, status: string): Promise<void> {
        await this.db.run(\`UPDATE installations SET status = ? WHERE id = ?\`, [status, id]);
    }
}
EOF

# userModel.ts
cat << 'EOF' > models/userModel.ts
import { Database } from 'sqlite';
import { getDbInstance } from './database';
import { User } from '../utils/types';

export class UserModel {
    private db: Database;

    constructor() {
        getDbInstance().then((db) => {
            this.db = db;
        });
    }

    public async getUserById(id: number): Promise<User | undefined> {
        return this.db.get<User>('SELECT * FROM users WHERE id = ?', [id]);
    }

    public async getUsersByInstallationId(installationId: number): Promise<User[]> {
        return this.db.all<User[]>('SELECT * FROM users WHERE installation_id = ?', [installationId]);
    }

    public async createUser(user: Partial<User>): Promise<void> {
        const { installation_id, username, password, type, longlivingtoken } = user;
        await this.db.run(
            \`INSERT INTO users (installation_id, username, password, type, longlivingtoken) VALUES (?, ?, ?, ?, ?)\`,
            [installation_id, username, password, type, longlivingtoken]
        );
    }

    public async updateUser(id: number, user: Partial<User>): Promise<void> {
        const { username, password, type, longlivingtoken } = user;
        await this.db.run(
            \`UPDATE users SET username = ?, password = ?, type = ?, longlivingtoken = ? WHERE id = ?\`,
            [username, password, type, longlivingtoken, id]
        );
    }
}
EOF

# Routes
# installationRoutes.ts
cat << 'EOF' > routes/installationRoutes.ts
import { Router } from 'express';
import { checkAuth } from '../middleware/authMiddleware';
import { InstallationController } from '../controllers/installationController';

const router = Router();
const installationController = new InstallationController();

router.get('/dashboard', checkAuth, installationController.showInstallations);
router.get('/installations/new', checkAuth, installationController.showInstallationForm);
router.post('/installations', checkAuth, installationController.createInstallation);
router.get('/installations/:id/edit', checkAuth, installationController.showEditForm);
router.post('/installations/:id', checkAuth, installationController.updateInstallation);

export default router;
EOF

# userRoutes.ts
cat << 'EOF' > routes/userRoutes.ts
import { Router } from 'express';
import { checkAuth } from '../middleware/authMiddleware';
import { UserController } from '../controllers/userController';

const router = Router();
const userController = new UserController();

router.get('/installations/:installationId/users', checkAuth, userController.showUsers);
router.get('/installations/:installationId/users/new', checkAuth, userController.showUserForm);
router.post('/installations/:installationId/users', checkAuth, userController.createUser);
router.get('/users/:userId/edit', checkAuth, userController.showEditForm);
router.post('/users/:userId', checkAuth, userController.updateUser);

export default router;
EOF

# Utils
# encryption.ts
cat << 'EOF' > utils/encryption.ts
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const SALT_ROUNDS = 10;
const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = process.env.SECRET_KEY || 'vervang_dit_met_een_veilige_sleutel_van_32_bytes';

export function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

export function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export function encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY, 'hex'), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(encryptedText: string): string {
    const textParts = encryptedText.split(':');
    const iv = Buffer.from(textParts.shift() as string, 'hex');
    const encrypted = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY, 'hex'), iv);
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
EOF

# logger.ts
cat << 'EOF' > utils/logger.ts
import winston from 'winston';
import 'winston-daily-rotate-file';
import dotenv from 'dotenv';

dotenv.config();

const { combine, timestamp, printf, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
    return \`\${timestamp} \${level}: \${stack || message}\`;
});

export class Logger {
    private static instance: winston.Logger;

    private constructor() {}

    public static getInstance(): winston.Logger {
        if (!Logger.instance) {
            Logger.instance = winston.createLogger({
                level: process.env.LOG_LEVEL || 'info',
                format: combine(
                    timestamp(),
                    errors({ stack: true }),
                    logFormat
                ),
                transports: [
                    new winston.transports.Console(),
                    new winston.transports.DailyRotateFile({
                        filename: 'logs/%DATE%.log',
                        datePattern: 'YYYY-MM-DD',
                        zippedArchive: true,
                        maxSize: '20m',
                        maxFiles: '14d',
                    }),
                ],
            });
        }
        return Logger.instance;
    }
}
EOF

# types.ts
cat << 'EOF' > utils/types.ts
export interface Installation {
    id: number;
    name: string;
    domain: string;
    ssl: number;
    street: string;
    number: string;
    postal_code: string;
    city: string;
    country: string;
    status: string;
}

export interface User {
    id: number;
    installation_id: number;
    username: string;
    password: string;
    type: string;
    longlivingtoken: string;
}
EOF

# Middleware
# authMiddleware.ts
cat << 'EOF' > middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';

export function checkAuth(req: Request, res: Response, next: NextFunction) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}
EOF

# healthCheck.ts
cat << 'EOF' > healthCheck.ts
import { InstallationModel } from './models/installationModel';
import { Installation } from './utils/types';
import * as http from 'http';
import * as https from 'https';
import { Logger } from './utils/logger';

const logger = Logger.getInstance();

export function startHealthCheck() {
    setInterval(async () => {
        try {
            const installationModel = new InstallationModel();
            const installations = await installationModel.getAllInstallations();

            installations.forEach((installation) => {
                performHealthCheck(installation, installationModel);
            });
        } catch (error) {
            logger.error('Fout bij het uitvoeren van de health check:', error);
        }
    }, 60000); // Elke 60 seconden
}

function performHealthCheck(installation: Installation, installationModel: InstallationModel) {
    const domain = installation.domain;
    const ssl = installation.ssl === 1;
    let url: string;

    if (ssl) {
        url = \`https://\${domain}.duckdns.org:8123\`;
    } else {
        url = \`http://\${domain}.duckdns.org\`;
    }

    const requestModule = ssl ? https : http;
    let callbackCalled = false;

    const req = requestModule.get(url, (resp) => {
        if (callbackCalled) return;
        callbackCalled = true;

        installationModel.updateInstallationStatus(installation.id, 'online').catch((error) => {
            logger.error('Fout bij updaten van installatie status:', error);
        });
    }).on('error', (err: any) => {
        if (callbackCalled) return;
        callbackCalled = true;

        installationModel.updateInstallationStatus(installation.id, 'offline').catch((error) => {
            logger.error('Fout bij updaten van installatie status:', error);
        });
    });

    req.setTimeout(5000, () => {
        if (callbackCalled) return;
        callbackCalled = true;

        req.destroy();

        installationModel.updateInstallationStatus(installation.id, 'offline').catch((error) => {
            logger.error('Fout bij updaten van installatie status:', error);
        });
    });
}
EOF

# Maak '.env' bestand aan in 'src'
touch .env

# Ga terug naar de hoofdmap
cd ..

# Optioneel: Maak een 'logs' map voor logbestanden
mkdir -p logs

echo "De projectstructuur en bestanden zijn succesvol aangemaakt."
