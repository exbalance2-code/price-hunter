'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface TrendingProduct {
    product_name: string;
    product_price: string;
    platform: string;
    click_count: number;
    last_clicked: string;
}

export default function TrendingPage() {
    const [products, setProducts] = useState<TrendingProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        fetchTrending();
    }, []);

    const fetchTrending = async () => {
        try {
            const response = await fetch('/api/analytics/trends');
            const data = await response.json();
            setProducts(data.trending || []);
        } catch (error) {
            console.error('Failed to fetch trending:', error);
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (message: string) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const shareToFacebook = () => {
        const url = window.location.href;
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        showNotification('เปิดหน้าต่างแชร์ Facebook แล้ว!');
    };

    const shareToTwitter = () => {
        const url = window.location.href;
        const text = '🔥 สินค้ายอดนิยมสัปดาห์นี้! ดูราคาดีที่สุดจาก Shopee';
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        showNotification('เปิดหน้าต่างแชร์ Twitter แล้ว!');
    };

    const shareToLine = () => {
        const url = window.location.href;
        const text = '🔥 สินค้ายอดนิยมสัปดาห์นี้!';
        window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        showNotification('เปิดหน้าต่างแชร์ LINE แล้ว!');
    };

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        showNotification('คัดลอกลิงก์แล้ว!');
    };

    const getRankStyle = (index: number) => {
        if (index === 0) return 'bg-gradient-to-br from-yellow-400 to-amber-500 text-yellow-900 ring-2 ring-yellow-300/50 shadow-lg shadow-yellow-500/20';
        if (index === 1) return 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800 ring-2 ring-gray-200/50 shadow-lg shadow-gray-400/20';
        if (index === 2) return 'bg-gradient-to-br from-orange-600 to-orange-700 text-orange-100 ring-2 ring-orange-500/50 shadow-lg shadow-orange-600/20';
        return '';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white/60 text-sm">กำลังโหลดข้อมูล...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 via-red-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <span className="text-lg font-bold gradient-text">Price Hunter</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-6">
                            <Link href="/" className="text-sm text-gray-600 hover:text-orange-600 font-medium transition-colors">หน้าแรก</Link>
                            <Link href="/trending" className="text-sm text-orange-600 font-semibold">
                                🔥 สินค้ายอดนิยม
                            </Link>
                            <a
                                href="https://lin.ee/8VZY6eI"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 hover:-translate-y-0.5"
                            >
                                เริ่มใช้งานฟรี
                            </a>
                        </div>

                        <Link href="/" className="md:hidden text-sm text-gray-600 font-medium">
                            ← หน้าแรก
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex-grow relative">
                {/* Background Effects */}
                <div className="absolute inset-0 grid-pattern" />
                <div className="floating-orb w-[400px] h-[400px] bg-orange-600/20 top-[10%] right-[-100px]" />
                <div className="floating-orb w-[300px] h-[300px] bg-purple-600/15 bottom-[20%] left-[-100px]" />

                {/* Header */}
                <div className="relative z-10 pt-24 pb-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 rounded-full border border-orange-500/20 mb-3">
                                    <span className="text-orange-400 text-xs font-semibold">TRENDING THIS WEEK</span>
                                </div>
                                <h1 className="text-3xl lg:text-4xl font-extrabold text-white mb-2">
                                    สินค้า<span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">ยอดนิยม</span>
                                </h1>
                                <p className="text-white/40 text-sm">
                                    สินค้าจาก Shopee ที่ได้รับความสนใจมากที่สุดในสัปดาห์นี้
                                </p>
                            </div>

                            {/* Share Buttons */}
                            <div className="flex gap-2">
                                {[
                                    { onClick: shareToFacebook, bg: 'bg-blue-600 hover:bg-blue-700', icon: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />, title: 'Facebook' },
                                    { onClick: shareToTwitter, bg: 'bg-sky-500 hover:bg-sky-600', icon: <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />, title: 'Twitter' },
                                    { onClick: shareToLine, bg: 'bg-[#06c755] hover:bg-[#05b34c]', icon: <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596a.626.626 0 01-.199.031c-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />, title: 'LINE' },
                                ].map((btn, i) => (
                                    <button
                                        key={i}
                                        onClick={btn.onClick}
                                        className={`${btn.bg} text-white p-2.5 rounded-xl transition-all duration-200 hover:scale-105`}
                                        title={`แชร์ ${btn.title}`}
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">{btn.icon}</svg>
                                    </button>
                                ))}
                                <button
                                    onClick={copyLink}
                                    className="bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-xl transition-all duration-200 hover:scale-105 border border-white/10"
                                    title="คัดลอกลิงก์"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="relative z-10 pb-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {products.length === 0 ? (
                            <div className="glass-card p-12 text-center max-w-md mx-auto">
                                <div className="text-5xl mb-4">📦</div>
                                <h2 className="text-xl font-bold text-white mb-2">ยังไม่มีข้อมูล</h2>
                                <p className="text-white/40 text-sm mb-6">
                                    ลองค้นหาสินค้าผ่าน LINE bot เพื่อดูสินค้ายอดนิยม
                                </p>
                                <a
                                    href="https://lin.ee/8VZY6eI"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-line inline-block text-sm"
                                >
                                    เพิ่มเพื่อน LINE Bot
                                </a>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {products.map((product, index) => (
                                    <div
                                        key={index}
                                        className="glass-card p-4 hover:bg-white/10 transition-all duration-500 card-hover relative overflow-hidden group"
                                    >
                                        {/* Hover glow */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        {/* Rank Badge */}
                                        {index < 3 && (
                                            <div className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${getRankStyle(index)}`}>
                                                #{index + 1}
                                            </div>
                                        )}

                                        <div className="relative z-10">
                                            <h3 className="text-white font-semibold text-sm mb-3 pr-10 line-clamp-2 leading-snug">
                                                {product.product_name}
                                            </h3>

                                            <div className="text-orange-400 font-bold text-xl mb-3">
                                                ฿{parseFloat(product.product_price).toLocaleString()}
                                            </div>

                                            <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                                                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${product.platform === 'shopee'
                                                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/20'
                                                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/20'
                                                    }`}>
                                                    {product.platform === 'shopee' ? 'Shopee' : 'Lazada'}
                                                </span>
                                                <span className="bg-red-500/15 px-2.5 py-1 rounded-lg text-red-300 text-xs font-semibold border border-red-500/20">
                                                    🔥 {product.click_count}
                                                </span>
                                            </div>

                                            <div className="text-white/30 text-xs">
                                                {new Date(product.last_clicked).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' })}
                                            </div>
                                        </div>

                                        <div className="relative z-10 mt-3 pt-3 border-t border-white/5">
                                            <p className="text-white/30 text-xs text-center">
                                                💬 ค้นหาผ่าน LINE bot
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Footer CTA */}
                        <div className="mt-10 glass-card p-8 text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-purple-500/10" />
                            <div className="relative z-10">
                                <h2 className="text-2xl font-extrabold text-white mb-3">
                                    อยากได้ของถูก? ให้บอทช่วยหา
                                </h2>
                                <p className="text-white/40 mb-6 text-sm">
                                    ค้นหาโปรลับจาก Shopee ได้ทันทีผ่าน LINE
                                </p>
                                <a
                                    href="https://lin.ee/8VZY6eI"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-line inline-flex items-center gap-2 text-sm"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                                    </svg>
                                    เริ่มใช้งานฟรี
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
                    <div className="glass-card bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-white px-5 py-3 flex items-center gap-2.5 border-green-500/30">
                        <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium text-sm">{toastMessage}</span>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="bg-slate-950 text-white py-12 border-t border-white/5 relative">
                <div className="absolute inset-0 dot-pattern opacity-30" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-2.5 mb-4">
                                <div className="w-9 h-9 bg-gradient-to-br from-orange-500 via-red-500 to-purple-600 rounded-xl flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <span className="text-lg font-bold">Price Hunter Bot</span>
                            </div>
                            <p className="text-sm text-white/40 leading-relaxed max-w-md">
                                ผู้ช่วยค้นหาสินค้าจาก Shopee อัจฉริยะ ช่วยให้คุณช้อปฉลาด ประหยัด ง่าย และปลอดภัย
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-sm mb-4 text-white/80 uppercase tracking-wide">ลิงก์ด่วน</h3>
                            <ul className="space-y-2.5">
                                <li><Link href="/" className="text-sm text-white/40 hover:text-orange-400 transition-colors">หน้าแรก</Link></li>
                                <li><Link href="/trending" className="text-sm text-white/40 hover:text-orange-400 transition-colors">🔥 สินค้ายอดนิยม</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-bold text-sm mb-4 text-white/80 uppercase tracking-wide">ติดตามเรา</h3>
                            <a
                                href="https://www.facebook.com/profile.php?id=61584449372366"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-orange-400 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                Facebook
                            </a>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-white/30 text-xs">
                            © {new Date().getFullYear()} Price Hunter Bot. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-xs text-white/30">
                            <Link href="/privacy-policy" className="hover:text-orange-400 transition-colors">นโยบายความเป็นส่วนตัว</Link>
                            <Link href="/terms" className="hover:text-orange-400 transition-colors">เงื่อนไขการใช้งาน</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
