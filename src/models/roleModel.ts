import { logger } from '../utils';
import { BaseModel } from './base.model';

export class RoleModel extends BaseModel {

    constructor() {
        super();
        logger.info('RoleModel initialized');
    }

}