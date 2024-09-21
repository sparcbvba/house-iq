import { startHealthCheck } from '../healthCheck';
import logger from '../utils/logger';

// Start de healthcheck worker
logger.info('HealthCheck worker gestart');
startHealthCheck();
