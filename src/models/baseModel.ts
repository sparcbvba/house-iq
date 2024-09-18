// src/models/baseModel.ts

import { Database } from 'sqlite';
import { getDbInstance } from './database';

export class BaseModel {
    protected db: Promise<Database>;

    constructor() {
        this.db = getDbInstance();
    }
}
