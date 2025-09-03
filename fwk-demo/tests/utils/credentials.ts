import dotenv from 'dotenv';

dotenv.config();

export const credentials = {
    userEmail: process.env.TEST_USER_EMAIL || '',
    userPassword: process.env.TEST_USER_PASSWORD || ''
};

// Optional: Type definitions for better TypeScript support
export interface TestCredentials {
    userEmail: string;
    userPassword: string;
}

// Optional: Function to validate credentials exist
export function validateCredentials(): void {
    if (!credentials.userEmail || !credentials.userPassword) {
        throw new Error('Test credentials are not properly configured in .env file');
    }
}