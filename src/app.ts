// src/app.ts
import path from 'path';
import fs from 'fs';
import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import session from 'express-session';
import { authRoutes, adminRoutes, dashboardRoutes, installationRoutes, userRoutes, houseRoutes, onboardingRoutes } from './routes';
import logger from './utils/logger';
import methodOverride from 'method-override';
import { setUser, setLayout, setActiveMenu, notFoundMiddleware, errorHandler, setDefaultTitle, setMenu } from './middleware';

dotenv.config();

const app = express();

// Maak de public map beschikbaar voor statische bestanden zoals CSS, JS
app.use(express.static(path.join(__dirname, '../public')));

// Middleware voor body-parser (komt vóór method-override)
app.use(bodyParser.urlencoded({ extended: true }));

// Gebruik method-override om andere HTTP-methoden zoals DELETE te ondersteunen
app.use(methodOverride('_method'));

// Logging om te zien welke HTTP-methoden en URL's worden gebruikt
app.use((req, res, next) => {
    logger.info(`Methode: ${req.method}, URL: ${req.originalUrl}`);
    next();
});

app.use(bodyParser.json());

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: false,
}));

app.use(expressLayouts);

// Functie om alle submappen binnen een bepaalde map op te halen
function getSubdirectories(directoryPath: string): string[] {
    return fs.readdirSync(directoryPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())  // Alleen directories selecteren
        .map(dirent => path.join(directoryPath, dirent.name));
}

// Standaard view path en publieke mappen
const viewPaths = [
    path.join(__dirname, 'views'),
    path.join(__dirname, 'views/public')
];

// Haal alle submappen op binnen 'views/private'
const privateViewsPath = path.join(__dirname, 'views/private');
const privateSubdirectories = getSubdirectories(privateViewsPath);

// Voeg de submappen van 'views/private' toe aan de view paths
privateSubdirectories.forEach(subdirectory => {
    viewPaths.push(subdirectory);
});

// Voeg het private root pad toe
viewPaths.push(privateViewsPath);

// Zet de views met de dynamisch verzamelde mappen
app.set('views', viewPaths);

app.set('view engine', 'ejs');

app.use(setUser);
app.use(setLayout);
app.use(setMenu);
app.use(setDefaultTitle);



// Routes
app.use('/', authRoutes);
app.use('/', adminRoutes);
app.use('/', dashboardRoutes);
app.use('/', installationRoutes);
app.use('/', userRoutes);
app.use('/', houseRoutes);
app.use('/', onboardingRoutes);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// 500-middleware om interne serverfouten op te vangen
app.use(errorHandler);

// De middleware voor het afhandelen van 404-fouten moet als laatste in de middleware-stack worden toegevoegd, zodat deze alleen wordt aangeroepen als geen enkele route overeenkomt.
app.use(notFoundMiddleware);

// Start de server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Server draait op http://localhost:${PORT}`);
});
