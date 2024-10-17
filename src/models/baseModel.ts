// src/models/baseModel.ts

import { Database } from 'sqlite';
import { getDbInstance } from './database';
import { logger } from '../utils';

export class BaseModel {
    protected db: Promise<Database>;

    constructor() {
        this.db = getDbInstance();
        logger.info('BaseModel initialized');
    }
}
