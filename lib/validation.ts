// Input Validation Utilities
export function validateSearchQuery(query: unknown): string {
    if (typeof query !== 'string') {
        throw new Error('Query must be a string');
    }

    const trimmed = query.trim();

    if (trimmed.length === 0) {
        throw new Error('Query cannot be empty');
    }

    if (trimmed.length > 200) {
        throw new Error('Query too long (max 200 characters)');
    }

    // ป้องกัน SQL injection patterns
    const dangerousPatterns = /(\bDROP\b|\bDELETE\b|\bUPDATE\b|\bINSERT\b|--|;|\/\*|\*\/)/i;
    if (dangerousPatterns.test(trimmed)) {
        throw new Error('Invalid characters in query');
    }

    return trimmed;
}

export function validateUserId(userId: unknown): string {
    if (typeof userId !== 'string') {
        throw new Error('User ID must be a string');
    }

    // LINE User ID format: U + 32 hex characters
    const lineUserIdPattern = /^U[a-f0-9]{32}$/;
    if (!lineUserIdPattern.test(userId)) {
        throw new Error('Invalid LINE User ID format');
    }

    return userId;
}

export function validateProductData(data: unknown): {
    name: string;
    price: number;
    platform: string;
    url: string;
} {
    if (typeof data !== 'object' || data === null) {
        throw new Error('Product data must be an object');
    }

    const product = data as Record<string, unknown>;

    // Validate name
    if (typeof product.name !== 'string' || product.name.length === 0) {
        throw new Error('Product name is required');
    }
    if (product.name.length > 500) {
        throw new Error('Product name too long');
    }

    // Validate price
    const price = Number(product.price);
    if (isNaN(price) || price < 0 || price > 10000000) {
        throw new Error('Invalid price');
    }

    // Validate platform
    if (!['shopee', 'lazada'].includes(String(product.platform).toLowerCase())) {
        throw new Error('Invalid platform');
    }

    // Validate URL
    if (typeof product.url !== 'string') {
        throw new Error('URL is required');
    }
    try {
        new URL(product.url);
    } catch {
        throw new Error('Invalid URL format');
    }

    return {
        name: product.name,
        price,
        platform: String(product.platform).toLowerCase(),
        url: product.url,
    };
}

export function sanitizeString(input: string): string {
    // Remove HTML tags
    return input.replace(/<[^>]*>/g, '');
}

export function validateNumber(value: unknown, min?: number, max?: number): number {
    const num = Number(value);

    if (isNaN(num)) {
        throw new Error('Invalid number');
    }

    if (min !== undefined && num < min) {
        throw new Error(`Number must be at least ${min}`);
    }

    if (max !== undefined && num > max) {
        throw new Error(`Number must be at most ${max}`);
    }

    return num;
}
