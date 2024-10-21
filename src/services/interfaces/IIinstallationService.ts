// src/services/IInstallationService.ts

import { Installation } from '../../utils';

export interface IInstallationService {
    verifyInstallation(installation_id: any): unknown;
    getInstallationLink(id: number): Promise<string | undefined>;
    getAllInstallations(): Promise<Installation[]>;
    getInstallationById(id: number): Promise<Installation | undefined>;
    createInstallation(data: Partial<Installation>): Promise<Installation | undefined>;
    updateInstallation(id: number, data: Partial<Installation>): Promise<void>;
}