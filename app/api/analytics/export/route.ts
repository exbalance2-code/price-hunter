import { getAllSearches, getAllClicks } from '@/lib/analytics';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'searches';

        let data: any[] = [];
        let headers: string[] = [];

        if (type === 'searches') {
            data = await getAllSearches() as any[];
            headers = ['Search Query', 'Results Count', 'Created At'];
        } else if (type === 'clicks') {
            data = await getAllClicks() as any[];
            headers = ['Product Name', 'Price', 'Platform', 'Search Query', 'Created At'];
        }

        // Convert to CSV
        const csv = convertToCSV(data, headers);

        return new Response(csv, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename=analytics_${type}_${new Date().toISOString().split('T')[0]}.csv`
            }
        });
    } catch (error) {
        console.error('Export API error:', error);
        return NextResponse.json(
            { error: 'Failed to export data' },
            { status: 500 }
        );
    }
}

function convertToCSV(data: any[], headers: string[]): string {
    if (data.length === 0) {
        return headers.join(',') + '\n';
    }

    // Add BOM for Excel UTF-8 support
    const BOM = '\uFEFF';

    // Header row
    const headerRow = headers.join(',');

    // Data rows
    const dataRows = data.map(row => {
        return Object.values(row).map(value => {
            // Escape quotes and wrap in quotes if contains comma or quote
            const stringValue = String(value || '');
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
        }).join(',');
    }).join('\n');

    return BOM + headerRow + '\n' + dataRows;
}
