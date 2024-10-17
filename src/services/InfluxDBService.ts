import { ApiKeyService } from './apikeyService';
// src/services/InfluxDBService.ts
import { InfluxDB, QueryApi } from '@influxdata/influxdb-client';

export class InfluxDBService {
    private static url: string = "https://eu-central-1-1.aws.cloud2.influxdata.com";
    private static token: string | undefined = ApiKeyService.getApiKey('influxdb');
    private static org: string = "c137f6ca19431652";
    private static bucket: string = "testhomeiq";
    private static measurement: string = "W";
    private static queryApi: QueryApi;

    static {
        if (!this.token) {
            throw new Error('InfluxDB token not found');
        }
        this.queryApi = new InfluxDB({ url: this.url, token: this.token }).getQueryApi(this.org);
    }

    /**
     * Run a custom query against the InfluxDB.
     * @param query The query string to run.
     * @returns A promise that resolves to the query result.
     */
    public static async queryRows(query: string, handlers: { next: (row: any, tableMeta: any) => void, error: (error: any) => void, complete: () => void }): Promise<void> {
        try {
            this.queryApi.queryRows(query, {
                next(row, tableMeta) {
                    handlers.next(row, tableMeta);
                },
                error(error) {
                    console.error('Error running custom query:', error);
                    handlers.error(error);
                },
                complete() {
                    console.log('Query completed successfully');
                    handlers.complete();
                }
            });
        } catch (error) {
            console.error('Error running custom query:', error);
            handlers.error(error);
        }
    }
}