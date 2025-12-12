import { getTopSearches, getTopClicks, getAnalyticsSummary } from '@/lib/analytics';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const [topSearches, topClicks, summary] = await Promise.all([
            getTopSearches(10),
            getTopClicks(10),
            getAnalyticsSummary()
        ]);

        return NextResponse.json({
            summary,
            topSearches,
            topClicks
        });
    } catch (error) {
        console.error('Analytics API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analytics' },
            { status: 500 }
        );
    }
}
