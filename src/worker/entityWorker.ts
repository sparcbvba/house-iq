import { InstallationModel } from '../models/installationModel';
import { EntityModel } from '../models';  // Nieuw model om entiteiten op te slaan
import axios from 'axios';
import logger from '../utils/logger';
import { EntityResponse } from '../utils';

// Functie om entiteiten van een installatie op te halen en op te slaan
export async function fetchAndSaveEntities() {
    const installationModel = new InstallationModel();
    const entityModel = new EntityModel();
    
    try {
        const installations = await installationModel.getAllInstallations();
        const apiKey = '<long_lived_token>';  // Vervang dit met een geldig token
        
        for (const installation of installations) {
            const url = `${installation.url}/api/states`;
            
            // API-oproep om entiteiten op te halen
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const entities: EntityResponse = response.data as EntityResponse ;  // JSON array met entiteiten
            
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
                await entityModel.saveEntityStateHistory({
                    entity_id,
                    state,
                    last_updated,
                    installation_id: installation.id
                });
            }
        }
    } catch (error) {
        logger.error('Fout bij het ophalen van entiteiten:', error);
    }
}

// Start een worker die elke 60 minuten draait
setInterval(fetchAndSaveEntities, 60 * 60 * 1000);  // Elke 60 minuten
