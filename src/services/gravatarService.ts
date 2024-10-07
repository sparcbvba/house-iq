import * as crypto from 'crypto';

export class GravatarService {
    /**
     * Generates a Gravatar URL for a given email.
     * @param email - The email address to generate the Gravatar for.
     * @param size - Optional size of the Gravatar image (default: 200).
     * @returns The URL of the generated Gravatar.
     */
    generateGravatarUrl(email: string, size: number = 200): string {
        if (!email) {
            throw new Error('Email is required to generate a Gravatar URL.');
        }

        const trimmedEmail = email.trim().toLowerCase();
        const hash = crypto.createHash('md5').update(trimmedEmail).digest('hex');
        return `https://www.gravatar.com/avatar/${hash}?s=${size}`;
    }
}
