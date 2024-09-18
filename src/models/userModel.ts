// src/models/userModel.ts
import { AppUser } from '../utils/types';
import { BaseModel } from './baseModel';

export class UserModel extends BaseModel {

    constructor() {
        super();
    }

    public async getUserByUsername(username: string): Promise<AppUser | undefined> {
        const db = await this.db;
        return db.get<AppUser>('SELECT * FROM users WHERE username = ?', [username]);
    }

    public async getUserByEmail(email: string): Promise<AppUser | undefined> {
        const db = await this.db;
        return db.get<AppUser>('SELECT * FROM users WHERE email = ?', [email]);
    }

    public async createUser(user: Partial<AppUser>): Promise<void> {
        const db = await this.db;
        const { username, email, password } = user;
        await db.run(
            `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
            [username, email, password]
        );
    }
}
