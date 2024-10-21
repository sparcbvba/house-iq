export interface Installation {
    installation_id: number;
    house_id: number;
    name: string;
    installation_date: string; // Use Date if you prefer
    status: string;
    url: string;
    token: string;
}
