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

const COLORS = ['#FF8042', '#00C49F', '#FFBB28', '#0088FE', '#8884D8'];

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
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <div className="text-white text-2xl">กำลังโหลด...</div>
            </div>
        );
    }

    if (error || !data || !trendsData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <div className="text-red-400 text-xl">Error: {error || 'No data'}</div>
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
            <div className="w-full px-4">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">📊 Analytics Dashboard</h1>
                        <p className="text-blue-200 text-sm">Price Hunter - ระบบวิเคราะห์ข้อมูล</p>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href="/admin/settings"
                            className="bg-gray-600 hover:bg-gray-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all flex items-center gap-1"
                        >
                            ⚙️ ตั้งค่า
                        </Link>
                        <Link
                            href="/trending"
                            className="bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all"
                        >
                            🔥 Trending
                        </Link>
                        <button
                            onClick={() => handleExport('searches')}
                            className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all"
                        >
                            📥 Searches
                        </button>
                        <button
                            onClick={() => handleExport('clicks')}
                            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all"
                        >
                            📥 Clicks
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all">
                        <div className="text-blue-300 text-xs font-medium mb-1">🔍 ยอดการค้นหา</div>
                        <div className="text-2xl font-bold text-white mb-1">{data.summary.totalSearches.toLocaleString()}</div>
                        <div className="text-blue-200 text-xs">Total Searches</div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all">
                        <div className="text-green-300 text-xs font-medium mb-1">🛒 ยอดคลิกซื้อ</div>
                        <div className="text-2xl font-bold text-white mb-1">{data.summary.totalClicks.toLocaleString()}</div>
                        <div className="text-green-200 text-xs">Total Clicks</div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all">
                        <div className="text-orange-300 text-xs font-medium mb-1">🛍️ Shopee</div>
                        <div className="text-2xl font-bold text-white mb-1">{data.summary.shopeeClicks.toLocaleString()}</div>
                        <div className="text-orange-200 text-xs">Shopee Clicks</div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all">
                        <div className="text-purple-300 text-xs font-medium mb-1">🏪 Lazada</div>
                        <div className="text-2xl font-bold text-white mb-1">{data.summary.lazadaClicks.toLocaleString()}</div>
                        <div className="text-purple-200 text-xs">Lazada Clicks</div>
                    </div>
                </div>

                {/* Conversion Rate */}
                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-lg rounded-xl p-4 border border-white/20 mb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-white text-base font-medium mb-1">📈 Conversion Rate</div>
                            <div className="text-blue-200 text-xs">อัตราการคลิกซื้อต่อการค้นหา</div>
                        </div>
                        <div className="text-3xl font-bold text-white">{conversionRate}%</div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
                    {/* Search Trends Chart */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                        <h2 className="text-base font-bold text-white mb-2">📈 เทรนด์การค้นหา (7 วัน)</h2>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={trendsData.trends}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                                <XAxis dataKey="date" stroke="#93c5fd" />
                                <YAxis stroke="#93c5fd" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                                <Legend />
                                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} name="จำนวนการค้นหา" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Platform Distribution */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                        <h2 className="text-base font-bold text-white mb-2">🏪 สัดส่วน Platform</h2>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={platformData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {platformData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#FF8042' : '#8B5CF6'} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Price Range Distribution */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                        <h2 className="text-base font-bold text-white mb-2">💰 ช่วงราคายอดนิยม</h2>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={trendsData.priceRanges}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                                <XAxis dataKey="price_range" stroke="#93c5fd" />
                                <YAxis stroke="#93c5fd" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                                <Legend />
                                <Bar dataKey="count" fill="#10b981" name="จำนวนสินค้า" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Top Products Bar Chart */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                        <h2 className="text-base font-bold text-white mb-2">🏆 Top 5 สินค้า</h2>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={data.topClicks.slice(0, 5)} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                                <XAxis type="number" stroke="#93c5fd" />
                                <YAxis dataKey="product_name" type="category" stroke="#93c5fd" width={150} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                                <Bar dataKey="click_count" fill="#f59e0b" name="คลิก" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Tables Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {/* Top Searches */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                        <h2 className="text-base font-bold text-white mb-3">🔥 คำค้นหายอดนิยม</h2>
                        <div className="space-y-2">
                            {data.topSearches.length === 0 ? (
                                <div className="text-blue-200 text-center py-4 text-sm">ยังไม่มีข้อมูล</div>
                            ) : (
                                data.topSearches.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className={`
                        w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs
                        ${index === 0 ? 'bg-yellow-500 text-yellow-900' : ''}
                        ${index === 1 ? 'bg-gray-400 text-gray-900' : ''}
                        ${index === 2 ? 'bg-orange-600 text-orange-100' : ''}
                        ${index > 2 ? 'bg-blue-500/30 text-blue-200' : ''}
                      `}>
                                                {index + 1}
                                            </div>
                                            <div className="text-white text-sm font-medium">{item.search_query}</div>
                                        </div>
                                        <div className="bg-blue-500/30 px-3 py-1 rounded-full text-blue-200 text-xs font-semibold">
                                            {item.count}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Top Clicked Products */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                        <h2 className="text-base font-bold text-white mb-3">🎯 สินค้าที่ถูกคลิกมากสุด</h2>
                        <div className="space-y-2">
                            {data.topClicks.length === 0 ? (
                                <div className="text-blue-200 text-center py-4 text-sm">ยังไม่มีข้อมูล</div>
                            ) : (
                                data.topClicks.map((item, index) => (
                                    <div
                                        key={index}
                                        className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all"
                                    >
                                        <div className="flex items-start justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <div className={`
                          w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs
                          ${index === 0 ? 'bg-yellow-500 text-yellow-900' : ''}
                          ${index === 1 ? 'bg-gray-400 text-gray-900' : ''}
                          ${index === 2 ? 'bg-orange-600 text-orange-100' : ''}
                          ${index > 2 ? 'bg-blue-500/30 text-blue-200' : ''}
                        `}>
                                                    {index + 1}
                                                </div>
                                                <div className="text-white text-xs line-clamp-2">
                                                    {item.product_name}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between ml-7">
                                            <div className="text-green-300 text-sm font-bold">
                                                ฿{parseFloat(item.product_price).toLocaleString()}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className={`
                          px-2 py-0.5 rounded-full text-xs font-semibold
                          ${item.platform === 'shopee' ? 'bg-orange-500/30 text-orange-200' : 'bg-purple-500/30 text-purple-200'}
                        `}>
                                                    {item.platform === 'shopee' ? 'S' : 'L'}
                                                </span>
                                                <span className="bg-blue-500/30 px-2 py-0.5 rounded-full text-blue-200 text-xs font-semibold">
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
                <div className="mt-4 text-center text-blue-300 text-xs">
                    <p>อัปเดตทุก 30 วินาที • {new Date().toLocaleString('th-TH', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
            </div>
        </div>
    );
}
