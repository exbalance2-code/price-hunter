// @ts-nocheck
import { query } from '../lib/db';
// import * as dotenv from 'dotenv';
// dotenv.config();

async function clearLogs() {
    console.log('🗑️  Starting log cleanup...');

    try {
        console.log('Clearing search_logs...');
        await query('DELETE FROM search_logs');
        // Reset Auto Increment if possible (TiDB/MySQL specific, helpful for cleaner IDs)
        // await query('ALTER TABLE search_logs AUTO_INCREMENT = 1'); 

        console.log('Clearing click_logs...');
        await query('DELETE FROM click_logs');
        // await query('ALTER TABLE click_logs AUTO_INCREMENT = 1');

        console.log('✅ All logs cleared successfully!');
    } catch (error) {
        console.error('❌ Error clearing logs:', error);
    }
}

clearLogs();
