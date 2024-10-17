import { logger } from '../utils';
import { BaseModel } from './baseModel';

export class RoleModel extends BaseModel {

    constructor() {
        super();
        logger.info('RoleModel initialized');
    }

}