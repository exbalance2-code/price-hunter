'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

interface AnalyticsData {
    summary: {
        totalSearches: number;
        totalClicks: number;
        shopeeClicks: number;
        lazadaClicks: number;
    };
    topSearches: Array<{
        search_query: string;
        count: number;
    }>;
    topClicks: Array<{
        product_name: string;
        product_price: string;
        platform: string;
        click_count: number;
    }>;
}

interface TrendsData {
    trends: Array<{
        date: string;
        count: number;
    }>;
    priceRanges: Array<{
        price_range: string;
        count: number;
    }>;
    trending: Array<{
        product_name: string;
        product_price: string;
        platform: string;
        click_count: number;
    }>;
}

const CHART_COLORS = ['#ff6b35', '#7c3aed', '#06b6d4', '#10b981', '#f59e0b'];

export default function AdminPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [trendsData, setTrendsData] = useState<TrendsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAllData();
        const interval = setInterval(fetchAllData, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchAllData = async () => {
        try {
            const [analyticsRes, trendsRes] = await Promise.all([
                fetch('/api/analytics'),
                fetch('/api/analytics/trends')
            ]);

            if (!analyticsRes.ok || !trendsRes.ok) throw new Error('Failed to fetch');

            const [analyticsJson, trendsJson] = await Promise.all([
                analyticsRes.json(),
                trendsRes.json()
            ]);

            setData(analyticsJson);
            setTrendsData(trendsJson);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = (type: 'searches' | 'clicks') => {
        window.open(`/api/analytics/export?type=${type}`, '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white/60 text-sm">กำลังโหลดข้อมูล...</p>
                </div>
            </div>
        );
    }

    if (error || !data || !trendsData) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="glass-card p-8 text-center max-w-md">
                    <div className="text-4xl mb-4">⚠️</div>
                    <p className="text-red-400 text-lg font-semibold mb-2">เกิดข้อผิดพลาด</p>
                    <p className="text-white/40 text-sm">{error || 'No data'}</p>
                </div>
            </div>
        );
    }

    const conversionRate = data.summary.totalSearches > 0
        ? ((data.summary.totalClicks / data.summary.totalSearches) * 100).toFixed(2)
        : '0.00';

    const platformData = [
        { name: 'Shopee', value: data.summary.shopeeClicks },
        { name: 'Lazada', value: data.summary.lazadaClicks }
    ];

    const summaryCards = [
        { label: 'ยอดการค้นหา', sublabel: 'Total Searches', value: data.summary.totalSearches, icon: '🔍', color: 'from-blue-500 to-cyan-500', shadow: 'shadow-blue-500/10' },
        { label: 'ยอดคลิกซื้อ', sublabel: 'Total Clicks', value: data.summary.totalClicks, icon: '🛒', color: 'from-emerald-500 to-green-500', shadow: 'shadow-emerald-500/10' },
        { label: 'Shopee', sublabel: 'Shopee Clicks', value: data.summary.shopeeClicks, icon: '🛍️', color: 'from-orange-500 to-red-500', shadow: 'shadow-orange-500/10' },
        { label: 'Lazada', sublabel: 'Lazada Clicks', value: data.summary.lazadaClicks, icon: '🏪', color: 'from-violet-500 to-purple-500', shadow: 'shadow-violet-500/10' },
    ];

    const tooltipStyle = { backgroundColor: '#1e1b4b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' };

    const getRankBadge = (index: number) => {
        if (index === 0) return 'bg-gradient-to-br from-yellow-400 to-amber-500 text-yellow-900';
        if (index === 1) return 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800';
        if (index === 2) return 'bg-gradient-to-br from-orange-600 to-orange-700 text-orange-100';
        return 'bg-white/10 text-white/50';
    };

    return (
        <div className="min-h-screen bg-slate-950 relative">
            <div className="absolute inset-0 grid-pattern" />

            <div className="relative z-10 p-4 lg:p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-extrabold text-white mb-1">Analytics Dashboard</h1>
                            <p className="text-white/40 text-sm">Price Hunter - ระบบวิเคราะห์ข้อมูล</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Link
                                href="/admin/settings"
                                className="glass-card px-4 py-2 text-white text-sm font-medium hover:bg-white/10 transition-all flex items-center gap-1.5"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                ตั้งค่า
                            </Link>
                            <Link
                                href="/trending"
                                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold rounded-[1.25rem] hover:shadow-lg hover:shadow-orange-500/20 transition-all"
                            >
                                🔥 Trending
                            </Link>
                            <button
                                onClick={() => handleExport('searches')}
                                className="px-4 py-2 bg-emerald-500/20 text-emerald-300 text-sm font-medium rounded-[1.25rem] border border-emerald-500/20 hover:bg-emerald-500/30 transition-all"
                            >
                                📥 Searches
                            </button>
                            <button
                                onClick={() => handleExport('clicks')}
                                className="px-4 py-2 bg-blue-500/20 text-blue-300 text-sm font-medium rounded-[1.25rem] border border-blue-500/20 hover:bg-blue-500/30 transition-all"
                            >
                                📥 Clicks
                            </button>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {summaryCards.map((card, i) => (
                            <div key={i} className={`glass-card p-5 hover:bg-white/8 transition-all duration-300 ${card.shadow}`}>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-white/50 text-xs font-medium">{card.label}</span>
                                    <span className="text-lg">{card.icon}</span>
                                </div>
                                <div className="text-3xl font-extrabold text-white mb-1">{card.value.toLocaleString()}</div>
                                <div className="text-white/30 text-xs">{card.sublabel}</div>
                            </div>
                        ))}
                    </div>

                    {/* Conversion Rate */}
                    <div className="glass-card p-5 mb-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-blue-500/5" />
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <div className="text-white font-semibold mb-1">📈 Conversion Rate</div>
                                <div className="text-white/40 text-xs">อัตราการคลิกซื้อต่อการค้นหา</div>
                            </div>
                            <div className="text-4xl font-extrabold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">{conversionRate}%</div>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                        {/* Search Trends */}
                        <div className="glass-card p-5">
                            <h2 className="text-sm font-bold text-white mb-4">📈 เทรนด์การค้นหา (7 วัน)</h2>
                            <ResponsiveContainer width="100%" height={220}>
                                <LineChart data={trendsData.trends}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
                                    <Tooltip contentStyle={tooltipStyle} />
                                    <Legend />
                                    <Line type="monotone" dataKey="count" stroke="#ff6b35" strokeWidth={2.5} dot={{ fill: '#ff6b35', r: 4 }} name="จำนวนการค้นหา" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Platform Distribution */}
                        <div className="glass-card p-5">
                            <h2 className="text-sm font-bold text-white mb-4">🏪 สัดส่วน Platform</h2>
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie
                                        data={platformData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                                        outerRadius={90}
                                        innerRadius={50}
                                        fill="#8884d8"
                                        dataKey="value"
                                        strokeWidth={0}
                                    >
                                        {platformData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 0 ? '#ff6b35' : '#7c3aed'} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={tooltipStyle} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Price Range */}
                        <div className="glass-card p-5">
                            <h2 className="text-sm font-bold text-white mb-4">💰 ช่วงราคายอดนิยม</h2>
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={trendsData.priceRanges}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="price_range" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
                                    <Tooltip contentStyle={tooltipStyle} />
                                    <Legend />
                                    <Bar dataKey="count" fill="#10b981" name="จำนวนสินค้า" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Top Products Bar */}
                        <div className="glass-card p-5">
                            <h2 className="text-sm font-bold text-white mb-4">🏆 Top 5 สินค้า</h2>
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={data.topClicks.slice(0, 5)} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis type="number" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                                    <YAxis dataKey="product_name" type="category" stroke="rgba(255,255,255,0.3)" width={140} fontSize={10} />
                                    <Tooltip contentStyle={tooltipStyle} />
                                    <Bar dataKey="click_count" fill="#ff6b35" name="คลิก" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Tables Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Top Searches */}
                        <div className="glass-card p-5">
                            <h2 className="text-sm font-bold text-white mb-4">🔥 คำค้นหายอดนิยม</h2>
                            <div className="space-y-2">
                                {data.topSearches.length === 0 ? (
                                    <div className="text-white/30 text-center py-6 text-sm">ยังไม่มีข้อมูล</div>
                                ) : (
                                    data.topSearches.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between bg-white/5 rounded-xl p-3 hover:bg-white/8 transition-all"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[10px] ${getRankBadge(index)}`}>
                                                    {index + 1}
                                                </div>
                                                <span className="text-white text-sm font-medium">{item.search_query}</span>
                                            </div>
                                            <span className="bg-blue-500/15 px-3 py-1 rounded-lg text-blue-300 text-xs font-semibold border border-blue-500/10">
                                                {item.count}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Top Clicked Products */}
                        <div className="glass-card p-5">
                            <h2 className="text-sm font-bold text-white mb-4">🎯 สินค้าที่ถูกคลิกมากสุด</h2>
                            <div className="space-y-2">
                                {data.topClicks.length === 0 ? (
                                    <div className="text-white/30 text-center py-6 text-sm">ยังไม่มีข้อมูล</div>
                                ) : (
                                    data.topClicks.map((item, index) => (
                                        <div
                                            key={index}
                                            className="bg-white/5 rounded-xl p-3 hover:bg-white/8 transition-all"
                                        >
                                            <div className="flex items-start justify-between mb-1.5">
                                                <div className="flex items-center gap-2.5">
                                                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[10px] flex-shrink-0 ${getRankBadge(index)}`}>
                                                        {index + 1}
                                                    </div>
                                                    <span className="text-white text-xs line-clamp-2 leading-snug">
                                                        {item.product_name}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between ml-[34px]">
                                                <span className="text-emerald-400 text-sm font-bold">
                                                    ฿{parseFloat(item.product_price).toLocaleString()}
                                                </span>
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold ${item.platform === 'shopee' ? 'bg-orange-500/15 text-orange-300 border border-orange-500/10' : 'bg-purple-500/15 text-purple-300 border border-purple-500/10'}`}>
                                                        {item.platform === 'shopee' ? 'S' : 'L'}
                                                    </span>
                                                    <span className="bg-blue-500/15 px-2 py-0.5 rounded-lg text-blue-300 text-[10px] font-semibold border border-blue-500/10">
                                                        {item.click_count}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 text-center text-white/20 text-xs">
                        <p>อัปเดตทุก 30 วินาที • {new Date().toLocaleString('th-TH', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
