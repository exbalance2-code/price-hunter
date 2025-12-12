import pool from './db';
// Pool imported from lib/db.ts

export async function logSearch(searchQuery: string, resultsCount: number) {
    try {
        await pool.execute(
            'INSERT INTO search_logs (search_query, results_count, created_at) VALUES (?, ?, NOW())',
            [searchQuery, resultsCount]
        );
    } catch (error) {
        console.error('Failed to log search:', error);
    }
}

export async function logClick(
    productName: string,
    productPrice: number,
    platform: 'shopee' | 'lazada',
    searchQuery: string
) {
    try {
        await pool.execute(
            'INSERT INTO click_logs (product_name, product_price, platform, search_query, created_at) VALUES (?, ?, ?, ?, NOW())',
            [productName, productPrice, platform, searchQuery]
        );
    } catch (error) {
        console.error('Failed to log click:', error);
    }
}

export async function getTopSearches(limit: number = 10) {
    try {
        const [rows] = await pool.execute(
            `SELECT search_query, COUNT(*) as count 
       FROM search_logs 
       GROUP BY search_query 
       ORDER BY count DESC 
       LIMIT ${Number(limit)}`,
            []
        );
        return rows;
    } catch (error) {
        console.error('Failed to get top searches:', error);
        return [];
    }
}

export async function getTopClicks(limit: number = 10) {
    try {
        const [rows] = await pool.execute(
            `SELECT product_name, product_price, platform, COUNT(*) as click_count 
       FROM click_logs 
       GROUP BY product_name, product_price, platform 
       ORDER BY click_count DESC 
       LIMIT ${Number(limit)}`,
            []
        );
        return rows;
    } catch (error) {
        console.error('Failed to get top clicks:', error);
        return [];
    }
}

export async function getAnalyticsSummary() {
    try {
        const [searchCount] = await pool.execute('SELECT COUNT(*) as total FROM search_logs');
        const [clickCount] = await pool.execute('SELECT COUNT(*) as total FROM click_logs');
        const [shopeeCount] = await pool.execute('SELECT COUNT(*) as total FROM click_logs WHERE platform = "shopee"');
        const [lazadaCount] = await pool.execute('SELECT COUNT(*) as total FROM click_logs WHERE platform = "lazada"');

        return {
            totalSearches: (searchCount as any)[0].total,
            totalClicks: (clickCount as any)[0].total,
            shopeeClicks: (shopeeCount as any)[0].total,
            lazadaClicks: (lazadaCount as any)[0].total,
        };
    } catch (error) {
        console.error('Failed to get analytics summary:', error);
        return {
            totalSearches: 0,
            totalClicks: 0,
            shopeeClicks: 0,
            lazadaClicks: 0,
        };
    }
}

// Get search trends over time (for charts)
export async function getSearchTrends(days: number = 7) {
    try {
        const [rows] = await pool.execute(
            `SELECT DATE(created_at) as date, COUNT(*) as count
       FROM search_logs
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
       GROUP BY DATE(created_at)
       ORDER BY date ASC`,
            [days]
        );
        return rows;
    } catch (error) {
        console.error('Failed to get search trends:', error);
        return [];
    }
}

// Get price range distribution
export async function getPriceRangeDistribution() {
    try {
        const [rows] = await pool.execute(
            `SELECT 
        CASE 
          WHEN product_price < 500 THEN '0-500'
          WHEN product_price < 1000 THEN '500-1,000'
          WHEN product_price < 5000 THEN '1,000-5,000'
          WHEN product_price < 10000 THEN '5,000-10,000'
          ELSE '10,000+'
        END as price_range,
        COUNT(*) as count
      FROM click_logs
      GROUP BY price_range
      ORDER BY 
        CASE price_range
          WHEN '0-500' THEN 1
          WHEN '500-1,000' THEN 2
          WHEN '1,000-5,000' THEN 3
          WHEN '5,000-10,000' THEN 4
          ELSE 5
        END`
        );
        return rows;
    } catch (error) {
        console.error('Failed to get price range distribution:', error);
        return [];
    }
}

// Get trending products (most clicked in last 7 days)
export async function getTrendingProducts(limit: number = 10) {
    try {
        const [rows] = await pool.execute(
            `SELECT 
        product_name, 
        product_price, 
        platform,
        COUNT(*) as click_count,
        MAX(created_at) as last_clicked
      FROM click_logs
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY product_name, product_price, platform
      ORDER BY click_count DESC
      LIMIT ${Number(limit)}`,
            []
        );
        return rows;
    } catch (error) {
        console.error('Failed to get trending products:', error);
        return [];
    }
}

// Get all searches for export
export async function getAllSearches() {
    try {
        const [rows] = await pool.execute(
            `SELECT search_query, results_count, created_at
       FROM search_logs
       ORDER BY created_at DESC
       LIMIT 10000`
        );
        return rows;
    } catch (error) {
        console.error('Failed to get all searches:', error);
        return [];
    }
}

// Get all clicks for export
export async function getAllClicks() {
    try {
        const [rows] = await pool.execute(
            `SELECT product_name, product_price, platform, search_query, created_at
       FROM click_logs
       ORDER BY created_at DESC
       LIMIT 10000`
        );
        return rows;
    } catch (error) {
        console.error('Failed to get all clicks:', error);
        return [];
    }
}

