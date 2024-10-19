// src/models/baseModel.ts

import { Database } from 'sqlite';
import { getDbInstance } from './database';
import { logger } from '../utils';
import { IBaseModel } from './interfaces';

export class BaseModel implements IBaseModel {
    public db: Promise<Database>;

    constructor() {
        this.db = getDbInstance();
        logger.info('BaseModel initialized');
    }
}
