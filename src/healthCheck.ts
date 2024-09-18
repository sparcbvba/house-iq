// src/healthcheck.ts

import { InstallationModel } from './models/installationModel';
import { Installation } from './utils/types';
import * as http from 'http';
import * as https from 'https';
import { URL } from 'url';
import logger  from './utils/logger';
import { InstallationUserModel } from './models/installationUserModel';
import fetch from 'node-fetch'; // Zorg ervoor dat je node-fetch installeert
import { decrypt } from './utils/encryption';

export function startHealthCheck() {
    setInterval(async () => {
        try {
            const installationModel = new InstallationModel();
            const installations = await installationModel.getAllInstallations();

            installations.forEach((installation) => {
                performHealthCheck(installation, installationModel);
            });
        } catch (error) {
            logger.error('Fout bij het uitvoeren van de health check:', error);
        }
    }, 60000); // Elke 60 seconden
}

export async function performHealthCheck(installation: Installation, installationModel: InstallationModel): Promise<void> {
    const installationUrl = installation.url;
    let urlObj: URL;

    try {
        urlObj = new URL(installationUrl);
    } catch (error) {
        logger.error('Ongeldige URL in installatie:', installationUrl, error);
        await installationModel.updateInstallationStatus(installation.id, 'offline');
        return;
    }

    const protocol = urlObj.protocol;

    const requestModule = protocol === 'https:' ? https : http;
    let callbackCalled = false;

    return new Promise((resolve, reject) => {
        const req = requestModule.get(installationUrl, (resp) => {
            if (callbackCalled) return;
            callbackCalled = true;

            installationModel.updateInstallationStatus(installation.id, 'online').catch((error) => {
                logger.error('Fout bij updaten van installatie status:', error);
            });

            // Voer de update check uit
            checkForUpdates(installation).then(resolve).catch(reject);
        }).on('error', (err: any) => {
            if (callbackCalled) return;
            callbackCalled = true;

            installationModel.updateInstallationStatus(installation.id, 'offline').catch((error) => {
                logger.error('Fout bij updaten van installatie status:', error);
            });

            resolve(); // We lossen op zelfs bij een fout
        });

        req.setTimeout(5000, () => {
            if (callbackCalled) return;
            callbackCalled = true;

            req.destroy();

            installationModel.updateInstallationStatus(installation.id, 'offline').catch((error) => {
                logger.error('Fout bij updaten van installatie status:', error);
            });

            resolve(); // We lossen op bij een timeout
        });
    });
}

async function checkForUpdates(installation: Installation): Promise<void> {
    const installationUserModel = new InstallationUserModel();
    const installationModel = new InstallationModel();

    try {
        // Haal de voorkeursgebruiker op met een longlivingtoken
        const user = await installationUserModel.getPreferredUserByInstallationId(installation.id);

        if (!user) {
            logger.warn(`Geen voorkeursgebruiker met longlivingtoken gevonden voor installatie ID ${installation.id}`);
            // Reset de versies naar 'onbekend'
            await installationModel.resetInstallationVersions(installation.id);
            return;
        }

        // De longlivingtoken ontsleutelen
        const token = decrypt(user.longlivingtoken);

        // Rest van de code blijft hetzelfde
        const apiUrl = `${installation.url}/api/states/update.home_assistant_core_update`;

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            timeout: 5000,
        });

        if (!response.ok) {
            throw new Error(`HTTP fout! status: ${response.status}`);
        }

        const data = await response.json();

        // Haal de benodigde gegevens uit de respons
        const state = data.state; // 'on' of 'off'
        const attributes = data.attributes;
        const installedVersion = attributes.installed_version || 'onbekend';
        const latestVersion = attributes.latest_version || 'onbekend';

        const updateAvailable = state === 'on' ? 1 : 0;

        // Update de installatie met de nieuwe update status en versies
        await installationModel.updateInstallationUpdateStatus(installation.id, updateAvailable);
        await installationModel.updateInstallationVersions(installation.id, installedVersion, latestVersion);

    } catch (error) {
        logger.error(`Fout bij het controleren op updates voor installatie ID ${installation.id}:`, error);
        // Reset de update_available en versies naar standaardwaarden
        await installationModel.updateInstallationUpdateStatus(installation.id, 0);
        await installationModel.resetInstallationVersions(installation.id);
    }
}

