// import * as http from 'http';
// import * as https from 'https';
// import fetch from 'node-fetch'; 

// import { InstallationModel, HealthCheckModel } from './models';
// import { logger, Installation } from './utils';
// import { UserService } from './services';

// export function startHealthCheck() {
//     setInterval(async () => {
//         try {
//             const installationModel = new InstallationModel();
//             const installations = await installationModel.getAllInstallations();

//             installations.forEach((installation) => {
//                 performHealthCheck(installation, installationModel);
//             });
//         } catch (error) {
//             logger.error('Fout bij het uitvoeren van de health check:', error);
//         }
//     }, 60000); // Elke 60 seconden
// }

// export async function performHealthCheck(installation: Installation, installationModel: InstallationModel): Promise<void> {
//     const url = installation.url;
//     const requestModule = url.startsWith('https') ? https : http;
//     let callbackCalled = false;

//     const startTime = Date.now(); // Starttijd voor de duur van de healthcheck

//     return new Promise((resolve, reject) => {

//         const req = requestModule.get(url, (resp) => {
//             if (callbackCalled) return;
//             callbackCalled = true;

//             const duration = Date.now() - startTime; // Duur berekenen
//             const status = 'online';

//             // Sla de healthcheck data op
//             const healthCheckModel = new HealthCheckModel();
//             healthCheckModel.saveHealthCheckData(installation.id, status, duration);

//             logger.info(`Installatie ${installation.id} is online. Healthcheck duur: ${duration}ms`);

//             // Voer de update check uit
//             checkForUpdates(installation).then(resolve).catch(reject);

//         }).on('error', (err) => {
//             if (callbackCalled) return;
//             callbackCalled = true;

//             const duration = Date.now() - startTime;
//             const status = 'offline';

//             // Sla de healthcheck data op
//             const healthCheckModel = new HealthCheckModel();
//             healthCheckModel.saveHealthCheckData(installation.id, status, duration);

//             logger.error(`Installatie ${installation.id} is offline. Healthcheck duur: ${duration}ms`);
//             resolve(); // We lossen op zelfs bij een fout
//         });

//         req.setTimeout(5000, () => {
//             if (callbackCalled) return;
//             callbackCalled = true;

//             req.destroy();
//             const duration = Date.now() - startTime;
//             const status = 'offline';

//             // Sla de healthcheck data op
//             const healthCheckModel = new HealthCheckModel();
//             healthCheckModel.saveHealthCheckData(installation.id, status, duration);

//             logger.error(`Installatie ${installation.id} is offline (timeout). Healthcheck duur: ${duration}ms`);

//             resolve(); // We lossen op bij een timeout
//         });
//     });
// }

// // Functie om updates te controleren
// async function checkForUpdates(installation: Installation): Promise<void> {
//     const userService = new UserService();
//     const installationModel = new InstallationModel();

//     try {
//         // Haal de voorkeursgebruiker en longlivingtoken op via de service
//         const userWithToken = await userService.getPreferredUserWithToken(installation.id);

//         if (!userWithToken) {
//             await installationModel.resetInstallationVersions(installation.id);
//             return;
//         }

//         const token = userWithToken.token;
//         const apiUrl = `${installation.url}/api/states/update.home_assistant_core_update`;

//         const response = await fetch(apiUrl, {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json',
//             },
//             timeout: 5000,
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP fout! status: ${response.status}`);
//         }

//         const data = await response.json();
//         const state = data.state;  // 'on' of 'off'
//         const attributes = data.attributes;
//         const installedVersion = attributes.installed_version || 'onbekend';
//         const latestVersion = attributes.latest_version || 'onbekend';

//         const updateAvailable = state === 'on' ? 1 : 0;

//         // Update de installatie met de nieuwe update status en versies
//         await installationModel.updateInstallationUpdateStatus(installation.id, updateAvailable);
//         await installationModel.updateInstallationVersions(installation.id, installedVersion, latestVersion);

//     } catch (error) {
//         logger.error(`Fout bij het controleren op updates voor installatie ID ${installation.id}:`, error);
//         await installationModel.updateInstallationUpdateStatus(installation.id, 0);
//         await installationModel.resetInstallationVersions(installation.id);
//     }
// }
