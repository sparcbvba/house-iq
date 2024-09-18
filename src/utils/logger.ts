import * as winston from 'winston';
import 'winston-daily-rotate-file';
import dotenv from 'dotenv';

dotenv.config();

const { combine, timestamp, printf, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(timestamp(), errors({ stack: true }), logFormat),
  transports: [
    new winston.transports.Console(),
    new (winston.transports as any).DailyRotateFile({
      filename: 'logs/%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
});

export default logger;
