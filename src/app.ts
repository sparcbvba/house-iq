// src/app.ts

import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import bodyParser from 'body-parser';
import session from 'express-session';
import authRoutes from './routes/authRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import installationRoutes from './routes/installationRoutes';
import userRoutes from './routes/userRoutes';
import logger from './utils/logger';
import { startHealthCheck } from './healthCheck';

dotenv.config();

const app = express();

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
    logger.info(`Server draait op http://localhost:${PORT}`);
});
