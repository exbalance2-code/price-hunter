import { getSearchTrends, getPriceRangeDistribution, getTrendingProducts } from '@/lib/analytics';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const [trends, priceRanges, trending] = await Promise.all([
            getSearchTrends(7),
            getPriceRangeDistribution(),
            getTrendingProducts(10)
        ]);

        return NextResponse.json({
            trends,
            priceRanges,
            trending
        });
    } catch (error) {
        console.error('Trends API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch trends' },
            { status: 500 }
        );
    }
}
