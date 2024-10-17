// src/services/ApiKeyService.ts
import * as fs from 'fs';
import * as path from 'path';

/**
 * Service for managing API keys.
 * 
 * This service provides static methods to fetch specific API keys or all API keys
 * from a JSON configuration file.
 * 
 * @class ApiKeyService
 * @example
 * const apiKey = ApiKeyService.getApiKey('myApiKey');
 * const allApiKeys = ApiKeyService.getAllApiKeys();
 */
export class ApiKeyService {
    private static apiKeysPath: string = path.join(__dirname, '../../config/apikeys.json');

    /**
     * Fetch a specific API key by its name.
     * @param keyName The name of the API key to fetch.
     * @returns The API key value or undefined if not found.
     */
    public static getApiKey(keyName: string): string | undefined {
        const apiKeys = this.readApiKeys();
        return apiKeys[keyName];
    }

    /**
     * Fetch all API keys.
     * @returns An object containing all API keys.
     */
    public static getAllApiKeys(): Record<string, string> {
        return this.readApiKeys();
    }

    /**
     * Read the API keys from the JSON file.
     * @returns An object containing all API keys.
     */
    private static readApiKeys(): Record<string, string> {
        const apiKeysContent = fs.readFileSync(this.apiKeysPath, 'utf8');
        return JSON.parse(apiKeysContent);
    }
}