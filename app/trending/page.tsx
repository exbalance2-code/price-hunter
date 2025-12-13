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
        showNotification('✅ คัดลอกลิงก์แล้ว!');
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-red-900 flex items-center justify-center">
                <div className="text-white text-lg animate-pulse">กำลังโหลด...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-red-900 flex flex-col">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                Price Hunter Bot
                            </span>
                        </Link>

                        <div className="hidden md:flex items-center gap-8">
                            <Link href="/" className="text-sm text-gray-700 hover:text-orange-600 font-medium transition-colors">หน้าแรก</Link>
                            <Link href="/trending" className="text-sm text-orange-600 font-semibold transition-colors flex items-center gap-1">
                                🔥 สินค้ายอดนิยม
                            </Link>
                            <a
                                href="https://lin.ee/8VZY6eI"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                เริ่มใช้งาน
                            </a>
                        </div>

                        <button className="md:hidden text-gray-700">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content Wrapper */}
            <div className="flex-grow">
                {/* Header */}
                <div className="bg-white/5 backdrop-blur-lg border-b border-white/10 mt-20">
                    <div className="max-w-7xl mx-auto px-6 py-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-white mb-2">
                                    🔥 สินค้ายอดนิยม
                                </h1>
                                <p className="text-orange-100 text-sm opacity-80">
                                    สินค้าจาก Shopee ที่ได้รับความสนใจมากที่สุดในสัปดาห์นี้
                                </p>
                            </div>

                            {/* Share Buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={shareToFacebook}
                                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all"
                                    title="แชร์ Facebook"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </button>

                                <button
                                    onClick={shareToTwitter}
                                    className="bg-sky-500 hover:bg-sky-600 text-white p-2 rounded-lg transition-all"
                                    title="แชร์ Twitter"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                    </svg>
                                </button>

                                <button
                                    onClick={shareToLine}
                                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-all"
                                    title="แชร์ LINE"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                                    </svg>
                                </button>

                                <button
                                    onClick={copyLink}
                                    className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-lg transition-all"
                                    title="คัดลอกลิงก์"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-7xl mx-auto px-6 py-6">
                    {products.length === 0 ? (
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 text-center">
                            <div className="text-4xl mb-3">📦</div>
                            <h2 className="text-lg font-bold text-white mb-2">ยังไม่มีข้อมูล</h2>
                            <p className="text-orange-200 text-sm opacity-80">
                                ลองค้นหาสินค้าผ่าน LINE bot เพื่อดูสินค้ายอดนิยม
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {products.map((product, index) => (
                                <div
                                    key={index}
                                    className="bg-white/10 backdrop-blur-lg rounded-xl p-3 border border-white/20 hover:bg-white/15 transition-all hover:scale-105 relative overflow-hidden"
                                >
                                    {/* Rank Badge */}
                                    {index < 3 && (
                                        <div className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-md
                    ${index === 0 ? 'bg-yellow-400 text-yellow-900 ring-2 ring-yellow-200' : ''}
                    ${index === 1 ? 'bg-gray-300 text-gray-800 ring-2 ring-gray-100' : ''}
                    ${index === 2 ? 'bg-orange-700 text-orange-100 ring-2 ring-orange-500' : ''}
                  `}>
                                            #{index + 1}
                                        </div>
                                    )}

                                    {/* Product Info */}
                                    <div className="mb-3">
                                        <h3 className="text-white font-bold text-sm mb-2 pr-10 line-clamp-2">
                                            {product.product_name}
                                        </h3>

                                        <div className="flex items-center justify-between mb-2">
                                            <div className="text-orange-300 font-bold text-lg">
                                                ฿{parseFloat(product.product_price).toLocaleString()}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 mb-2 flex-wrap">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold
                      ${product.platform === 'shopee' ? 'bg-orange-500/80 text-white' : 'bg-gray-500/50 text-gray-200'}
                    `}>
                                                {product.platform === 'shopee' ? 'Shopee' : 'Lazada'}
                                            </span>
                                            <span className="bg-red-500/30 px-2 py-0.5 rounded-full text-red-200 text-xs font-semibold">
                                                🔥 {product.click_count}
                                            </span>
                                        </div>

                                        <div className="text-orange-200/60 text-xs">
                                            {new Date(product.last_clicked).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>

                                    {/* CTA */}
                                    <div className="mt-2 pt-2 border-t border-white/10">
                                        <p className="text-orange-200 text-xs text-center opacity-80">
                                            💬 ค้นหาผ่าน LINE bot
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Footer CTA */}
                    <div className="mt-6 bg-gradient-to-r from-orange-500/20 to-red-600/20 backdrop-blur-lg rounded-xl p-6 border border-white/10 text-center">
                        <h2 className="text-xl font-bold text-white mb-2">
                            🤖 อยากได้ของถูก? ให้บอทช่วยหา
                        </h2>
                        <p className="text-orange-200 mb-4 text-sm opacity-90">
                            ค้นหาโปรลับจาก Shopee ได้ทันทีผ่าน LINE
                        </p>
                        <Link
                            href="/"
                            className="inline-block bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold px-6 py-3 rounded-full hover:shadow-lg hover:shadow-orange-500/30 transition-all transform hover:scale-105 text-sm"
                        >
                            เริ่มใช้งานฟรี →
                        </Link>
                    </div>
                </div>

                {/* Toast Notification */}
                {showToast && (
                    <div className="fixed bottom-8 right-8 z-50 animate-slide-up">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-lg border border-white/20">
                            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="font-medium">{toastMessage}</span>
                        </div>
                    </div>
                )}

                <style jsx>{`
                @keyframes slide-up {
                    from {
                        transform: translateY(100px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s ease-out;
                }
            `}</style>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <span className="text-xl font-bold">Price Hunter Bot</span>
                            </div>
                            <p className="text-sm text-gray-400 leading-relaxed max-w-md">
                                ผู้ช่วยค้นหาสินค้าจาก Shopee อัจฉริยะ ช่วยให้คุณช้อปฉลาด ประหยัด ง่าย และปลอดภัย
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-base mb-4">ลิงก์ด่วน</h3>
                            <ul className="space-y-2">
                                <li><Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">หน้าแรก</Link></li>
                                <li><Link href="/trending" className="text-sm text-gray-400 hover:text-white transition-colors">🔥 สินค้ายอดนิยม</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-bold text-base mb-4">ติดตามเรา</h3>
                            <a
                                href="https://www.facebook.com/profile.php?id=61584449372366"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                Facebook
                            </a>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-400 text-xs">
                            © {new Date().getFullYear()} Price Hunter Bot. All rights reserved. | v2.1.0 (Shopee Edition)
                        </p>
                        <div className="flex gap-6 text-xs text-gray-400">
                            <Link href="/privacy-policy" className="hover:text-white transition-colors">นโยบายความเป็นส่วนตัว</Link>
                            <Link href="/terms" className="hover:text-white transition-colors">เงื่อนไขการใช้งาน</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
