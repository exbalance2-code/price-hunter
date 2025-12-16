import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { decrypt } from '@/lib/encryption';
import axios from 'axios';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

// Reuse logic from client for the test
async function getSettings() {
    let apiUrl = process.env.ACCESSTRADE_API_URL || '';
    let accessKey = process.env.ACCESSTRADE_ACCESS_KEY || '';
    let secretKey = process.env.ACCESSTRADE_SECRET_KEY || '';

    const settings = await query<any[]>(
        `SELECT setting_key, setting_value, is_encrypted 
         FROM system_settings 
         WHERE setting_key IN ('accesstrade_api_url', 'accesstrade_access_key', 'accesstrade_secret_key')`
    );

    for (const s of settings) {
        const val = s.is_encrypted ? decrypt(s.setting_value) : s.setting_value;
        if (s.setting_key === 'accesstrade_api_url') apiUrl = val;
        if (s.setting_key === 'accesstrade_access_key') accessKey = val;
        if (s.setting_key === 'accesstrade_secret_key') secretKey = val;
    }
    return { apiUrl, accessKey, secretKey };
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('q') || 'mouse'; // Default query

    const { apiUrl, accessKey, secretKey } = await getSettings();

    // Detailed diagnostics
    if (!apiUrl || !accessKey) {
        return NextResponse.json({
            error: 'Settings missing',
            details: {
                apiUrl: apiUrl ? 'SET' : 'MISSING',
                accessKey: accessKey ? 'SET' : 'MISSING',
                secretKey: secretKey ? 'SET' : 'MISSING'
            },
            help: 'Please go to /admin/settings and save your AccessTrade configuration'
        }, { status: 400 });
    }

    try {
        // Authenticate
        let headers: Record<string, string> = { 'X-Accesstrade-User-Type': 'publisher' };
        if (secretKey) {
            // JWT
            const header = { alg: 'HS256', typ: 'JWT' };
            const payload = { sub: accessKey, iat: Math.floor(Date.now() / 1000) };
            const base64UrlEncode = (str: string) => Buffer.from(str).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
            const signatureInput = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(payload))}`;
            const signature = crypto.createHmac('sha256', secretKey).update(signatureInput).digest('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
            headers['Authorization'] = `Bearer ${signatureInput}.${signature}`;
        } else {
            headers['Authorization'] = `Token ${accessKey}`;
        }

        // Fetch RAW data
        const response = await axios.get(apiUrl, { headers, params: { keyword, limit: 50 } });
        const data = response.data;
        const productsRaw = data.data || data.products || (Array.isArray(data) ? data : []);

        // Analyze
        const totalItems = productsRaw.length;
        const shopeeItems: any[] = [];
        const allowedItems: any[] = [];

        productsRaw.forEach((item: any) => {
            const merchant = (item.merchant || item.campaign_name || '').toLowerCase();
            if (merchant.includes('shopee')) {
                shopeeItems.push({ name: item.title || item.name, merchant });
            } else {
                allowedItems.push({ name: item.title || item.name, merchant });
            }
        });

        return NextResponse.json({
            message: 'AccessTrade Exclusion Verification',
            query: keyword,
            stats: {
                totalFound: totalItems,
                shopeeExcluded: shopeeItems.length,
                allowedRemaining: allowedItems.length
            },
            excluded_samples: shopeeItems.slice(0, 5), // Show first 5 excluded
            allowed_samples: allowedItems.slice(0, 5)  // Show first 5 allowed
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message, details: error.response?.data }, { status: 500 });
    }
}
