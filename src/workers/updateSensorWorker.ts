import { InstallationModel } from '../models';
import axios from 'axios';
import { EntityResponse, logger } from '../utils';
import { UserService } from '../services';  // Voor het ophalen van de longlivingtoken

// Functie om de update sensoren op te halen en op te slaan
export async function fetchAndCountUpdateSensors() {
    const installationModel = new InstallationModel();
    const userService = new UserService();

    try {
        // Haal alle installaties op
        const installations = await installationModel.getAllInstallations();

        for (const installation of installations) {
            // Haal de voorkeursgebruiker en longlivingtoken op via de service
            const userWithToken = await userService.getPreferredUserWithToken(installation.id);

            if (!userWithToken) {
                logger.warn(`Geen voorkeursgebruiker met longlivingtoken gevonden voor installatie ID ${installation.id}`);
                continue;
            }

            const token = userWithToken.token;
            const url = `${installation.url}/api/states`;

            // API-oproep om alle entiteiten op te halen
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const entities: EntityResponse = response.data as EntityResponse;

            // Filter de entiteiten op 'update'-sensoren
            const updateSensors = entities.filter((entity: any) =>
                entity.entity_id.startsWith('update.') && entity.state === 'on'
            );

            const activeUpdateCount = updateSensors.length;

            // Update het aantal actieve update sensoren in de database
            await installationModel.updateActiveUpdateSensors(installation.id, activeUpdateCount);

            logger.info(`Installatie ${installation.id}: ${activeUpdateCount} actieve update sensoren.`);
        }
    } catch (error) {
        logger.error('Fout bij het ophalen van update sensoren:', error);
    }
}

// Start een worker die elke 60 minuten draait
// setInterval(fetchAndCountUpdateSensors, 60 * 60 * 1000);  // Elke 60 minuten
setInterval(fetchAndCountUpdateSensors, 30 * 1000);  // Elke 60 minuten
logger.info('updateSensorWorker gestart');