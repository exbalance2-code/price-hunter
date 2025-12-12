import crypto from 'crypto';

// Encryption configuration
const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-32-character-secret-key!!'; // Must be 32 characters
const IV_LENGTH = 16;

/**
 * Encrypt sensitive data
 * @param text - Plain text to encrypt
 * @returns Encrypted string in format: iv:encryptedData
 */
export function encrypt(text: string): string {
    try {
        // Generate random IV
        const iv = crypto.randomBytes(IV_LENGTH);

        // Create cipher
        const cipher = crypto.createCipheriv(
            ALGORITHM,
            Buffer.from(ENCRYPTION_KEY.slice(0, 32)),
            iv
        );

        // Encrypt
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        // Return IV + encrypted data
        return iv.toString('hex') + ':' + encrypted;
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt data');
    }
}

/**
 * Decrypt encrypted data
 * @param encryptedText - Encrypted string in format: iv:encryptedData
 * @returns Decrypted plain text
 */
export function decrypt(encryptedText: string): string {
    try {
        // Split IV and encrypted data
        const parts = encryptedText.split(':');
        if (parts.length !== 2) {
            throw new Error('Invalid encrypted format');
        }

        const iv = Buffer.from(parts[0], 'hex');
        const encrypted = parts[1];

        // Create decipher
        const decipher = crypto.createDecipheriv(
            ALGORITHM,
            Buffer.from(ENCRYPTION_KEY.slice(0, 32)),
            iv
        );

        // Decrypt
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Failed to decrypt data');
    }
}

/**
 * Hash password using SHA-256 (simple version)
 * Note: ใน production ควรใช้ bcrypt
 */
export function hashPassword(password: string): string {
    return crypto
        .createHash('sha256')
        .update(password + ENCRYPTION_KEY)
        .digest('hex');
}

/**
 * Verify password
 */
export function verifyPassword(password: string, hash: string): boolean {
    return hashPassword(password) === hash;
}

/**
 * Generate random secret key
 */
export function generateSecretKey(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
}
