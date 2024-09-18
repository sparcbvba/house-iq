// src/utils/encryption.ts

import bcrypt from 'bcrypt';
import crypto from 'crypto';

const SALT_ROUNDS = 10;
const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = process.env.SECRET_KEY || '9b1c4a7d1e2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5';

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

export function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export function encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const key = crypto.createHash('sha256').update(SECRET_KEY).digest();
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

export function decrypt(encryptedText: string): string {
    const textParts = encryptedText.split(':');
    const iv = Buffer.from(textParts.shift() as string, 'hex');
    const encrypted = textParts.join(':');
    const key = crypto.createHash('sha256').update(SECRET_KEY).digest();
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

