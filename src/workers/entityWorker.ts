import axios from 'axios';
import { EntityModel, InstallationModel } from '../models';  // Model om entiteiten op te slaan
import { EntityResponse, logger } from '../utils';
import { UserService } from '../services';  // Import de UserService

export async function fetchAndSaveEntitiesForInstallation(installationId: number) {
    const installationModel = new InstallationModel();
    const userService = new UserService();  // Gebruik de UserService

    try {
        const installation = await installationModel.getInstallationById(installationId);

        if (!installation) {
            throw new Error(`Installatie met ID ${installationId} niet gevonden.`);
        }

        // Haal de voorkeursgebruiker en longlivingtoken op via de service
        const userWithToken = await userService.getPreferredUserWithToken(installation.id);

        if (!userWithToken) {
            logger.warn(`Geen voorkeursgebruiker met longlivingtoken gevonden voor installatie ID ${installationId}`);
            return;
        }

        const token = userWithToken.token;
        const url = `${installation.url}/api/states`;

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        logger.info('response from ' + url + ': ' + response.status);

        const entities: EntityResponse = response.data as EntityResponse;

        await processEntities(entities, installation.id);

        await installationModel.updateLastEntityFetch(installation.id, new Date().toISOString());

    } catch (error) {
        logger.error(`Fout bij het ophalen van entiteiten voor installatie ${installationId}:`, error);
    }
}

async function processEntities(entities: Array<any>, installationId: number) {
    const entityModel = new EntityModel();
    let insertCount = 0;
    let updateCount = 0;

    logger.info(`Aantal entiteiten: ${entities.length}`);

    for (const entity of entities) {
        const { entity_id, state, last_updated } = entity;

        // Roep de saveEntityState functie aan en wacht op de response
        const result = await entityModel.saveEntityState({
            entity_id,
            state,
            last_updated,
            installation_id: installationId
        });

        // Controleer de response en update de tellers
        if (result.insert) {
            insertCount++;
        } else if (result.update) {
            updateCount++;
        }
    }

    // Toon het aantal inserts en updates na de loop
    logger.info(`Aantal inserts: ${insertCount}`);
    logger.info(`Aantal updates: ${updateCount}`);
}




// Functie om entiteiten van een installatie op te halen en op te slaan
export async function fetchAndSaveEntities() {
    const installationModel = new InstallationModel();
    const entityModel = new EntityModel();
    const userService = new UserService();  // Gebruik de UserService

    try {
        const installations = await installationModel.getAllInstallations();

        const oneHourAgo = new Date(Date.now() - (60 * 60 * 1000));  // één uur geleden

        for (const installation of installations) {

            const userWithToken = await userService.getPreferredUserWithToken(installation.id);

            if (!userWithToken) {
                logger.warn(`Geen voorkeursgebruiker met longlivingtoken gevonden voor installatie ID ${installation.id}`);
                return;
            }

            const token = userWithToken.token;

            // Controleer of de laatste ophaalactie meer dan een uur geleden was
            if (installation.last_entity_fetch && new Date(installation.last_entity_fetch) > oneHourAgo) {
                logger.info(`Entiteiten al opgehaald voor installatie ${installation.id}, minder dan een uur geleden.`);
                continue;  // Sla deze installatie over
            }

            const url = `${installation.url}/api/states`;

            // API-oproep om entiteiten op te halen
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const entities: EntityResponse = response.data as EntityResponse;  // JSON array met entiteiten

            // Verwerk elke entiteit
            for (const entity of entities) {
                const { entity_id, state, last_updated } = entity;

                // Sla de huidige status op in de database
                await entityModel.saveEntityState({
                    entity_id,
                    state,
                    last_updated,
                    installation_id: installation.id
                });

                // Sla de status ook op in de historiektabel
                // await entityModel.saveEntityStateHistory({
                //     entity_id,
                //     state,
                //     last_updated,
                //     installation_id: installation.id
                // });
            }

            // Update de installatie met de tijd van de laatste succesvolle entiteitenophaling
            await installationModel.updateLastEntityFetch(installation.id, new Date().toISOString());
        }
    } catch (error) {
        logger.error('Fout bij het ophalen van entiteiten:', error);
    }
}

// Start een worker die elke 60 minuten draait
setInterval(fetchAndSaveEntities, 60 * 60 * 1000);  // Elke 60 minuten
logger.info('entityWorker gestart');