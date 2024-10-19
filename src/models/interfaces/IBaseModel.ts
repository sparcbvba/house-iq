// src/interfaces/IBaseModel.ts

import { Database } from 'sqlite';

export interface IBaseModel {
    /**
     * A promise that resolves to a Database instance.
     */
    db: Promise<Database>;
}