
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL
});

async function clearLogs() {
    console.log('🗑️  Starting log cleanup (via Prisma)...');

    try {
        console.log('Clearing search_logs...');
        await prisma.searchLog.deleteMany({});

        console.log('Clearing click_logs...');
        await prisma.clickLog.deleteMany({});

        console.log('✅ All logs cleared successfully!');
    } catch (error) {
        console.error('❌ Error clearing logs:', error);
    } finally {
        await prisma.$disconnect();
    }
}

clearLogs();
