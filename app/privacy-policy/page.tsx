import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col">
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
                            <Link href="/trending" className="text-sm text-gray-600 hover:text-orange-600 font-medium transition-colors flex items-center gap-1">
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

                        <Link href="/" className="md:hidden text-sm text-gray-600 font-medium">← หน้าแรก</Link>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <div className="flex-grow pt-28 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 rounded-full mb-4">
                        <span className="text-orange-600 text-xs font-semibold">PRIVACY POLICY</span>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-10">นโยบายความเป็นส่วนตัว</h1>

                    <div className="space-y-8 text-gray-600">
                        <p className="text-base leading-relaxed">
                            Price Hunter Bot (&quot;เรา&quot;) ให้ความสำคัญกับความเป็นส่วนตัวของผู้ใช้งาน (&quot;ท่าน&quot;) อย่างยิ่ง
                            นโยบายความเป็นส่วนตัวนี้อธิบายถึงวิธีการที่เราเก็บรวบรวม ใช้ และเปิดเผยข้อมูลของท่านเมื่อท่านใช้บริการ LINE Bot ของเรา
                        </p>

                        <div className="glass-card-light p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">1. ข้อมูลที่เราเก็บรวบรวม</h2>
                            <p className="mb-4">เราเก็บรวบรวมข้อมูลเพียงเล็กน้อยเท่าที่จำเป็นเพื่อให้บริการแก่ท่าน ได้แก่:</p>
                            <ul className="list-none space-y-3">
                                <li className="flex gap-3"><span className="text-orange-500 font-bold">•</span><span><strong>ข้อมูลระบุตัวตนทาง LINE (LINE User ID):</strong> เพื่อใช้ในการตอบกลับข้อความและส่งผลลัพธ์การค้นหาให้ท่าน</span></li>
                                <li className="flex gap-3"><span className="text-orange-500 font-bold">•</span><span><strong>ข้อความค้นหา (Search Queries):</strong> คำค้นหาที่ท่านพิมพ์ส่งมา เพื่อนำไปค้นหาสินค้าจาก Shopee</span></li>
                                <li className="flex gap-3"><span className="text-orange-500 font-bold">•</span><span><strong>ข้อมูลการใช้งาน (Usage Data):</strong> สถิติการใช้งานทั่วไป เช่น จำนวนครั้งที่ค้นหา เพื่อนำไปปรับปรุงประสิทธิภาพของบอท</span></li>
                                <li className="flex gap-3"><span className="text-orange-500 font-bold">•</span><span><strong>ข้อมูล Analytics:</strong> เราเก็บสถิติการค้นหา (คำค้นหา, จำนวนผลลัพธ์) และการคลิก (ชื่อสินค้า, ราคา) เพื่อวิเคราะห์เทรนด์และปรับปรุงบริการ โดยไม่เชื่อมโยงกับข้อมูลส่วนตัวของท่าน</span></li>
                            </ul>
                            <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                <p className="text-emerald-700 text-sm font-medium">
                                    ✅ <strong>เราไม่เก็บรวบรวม:</strong> ชื่อ-นามสกุลจริง, ที่อยู่, เบอร์โทรศัพท์, หรือข้อมูลทางการเงิน (บัตรเครดิต) ของท่าน
                                </p>
                            </div>
                        </div>

                        <div className="glass-card-light p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">2. การใช้ข้อมูล</h2>
                            <p className="mb-4">เราใช้ข้อมูลของท่านเพื่อ:</p>
                            <ul className="list-none space-y-2">
                                <li className="flex gap-3"><span className="text-orange-500 font-bold">•</span><span>ประมวลผลและส่งผลลัพธ์การค้นหาสินค้าให้ท่าน</span></li>
                                <li className="flex gap-3"><span className="text-orange-500 font-bold">•</span><span>วิเคราะห์และปรับปรุงการทำงานของ Price Hunter Bot</span></li>
                                <li className="flex gap-3"><span className="text-orange-500 font-bold">•</span><span>แสดงสถิติสินค้ายอดนิยมในหน้า &quot;Trending Products&quot; (โดยไม่แสดงข้อมูลส่วนตัวของผู้ใช้)</span></li>
                                <li className="flex gap-3"><span className="text-orange-500 font-bold">•</span><span>วิเคราะห์พฤติกรรมการใช้งานเพื่อพัฒนาฟีเจอร์ใหม่</span></li>
                                <li className="flex gap-3"><span className="text-orange-500 font-bold">•</span><span>ป้องกันการใช้งานในทางที่ผิด</span></li>
                            </ul>
                        </div>

                        <div className="glass-card-light p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">3. การแสดงข้อมูลสาธารณะ</h2>
                            <p className="mb-4">เราแสดงข้อมูลสถิติแบบรวม (Aggregated Data) ในหน้า &quot;สินค้ายอดนิยม&quot; ซึ่งประกอบด้วย:</p>
                            <ul className="list-none space-y-2 mb-4">
                                <li className="flex gap-3"><span className="text-orange-500 font-bold">•</span><span>ชื่อสินค้าที่ได้รับความสนใจมากที่สุด</span></li>
                                <li className="flex gap-3"><span className="text-orange-500 font-bold">•</span><span>ราคาสินค้า / แพลตฟอร์ม (Shopee) / จำนวนคนที่สนใจ (ไม่ระบุตัวตน)</span></li>
                            </ul>
                            <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                                <p className="text-red-700 text-sm font-medium">
                                    🔒 ข้อมูลเหล่านี้ไม่สามารถระบุตัวตนของผู้ใช้รายบุคคลได้ และเป็นเพียงสถิติรวมเท่านั้น
                                </p>
                            </div>
                        </div>

                        <div className="glass-card-light p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">4. การเปิดเผยข้อมูล</h2>
                            <p className="mb-4">เราไม่ขาย แลกเปลี่ยน หรือโอนข้อมูลส่วนบุคคลของท่านให้แก่บุคคลภายนอก ยกเว้น:</p>
                            <ul className="list-none space-y-2">
                                <li className="flex gap-3"><span className="text-orange-500 font-bold">•</span><span><strong>แพลตฟอร์ม E-commerce (Shopee):</strong> เมื่อท่านคลิกลิงก์สินค้า เราอาจส่งต่อท่านไปยังแอปพลิเคชันหรือเว็บไซต์ของ Shopee ซึ่งอยู่นอกเหนือการควบคุมของเรา</span></li>
                                <li className="flex gap-3"><span className="text-orange-500 font-bold">•</span><span><strong>การปฏิบัติตามกฎหมาย:</strong> หากมีความจำเป็นต้องเปิดเผยตามคำสั่งศาลหรือกฎหมาย</span></li>
                            </ul>
                        </div>

                        <div className="glass-card-light p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">5. ความปลอดภัยของข้อมูล</h2>
                            <p>เราใช้มาตรการรักษาความปลอดภัยที่เหมาะสมเพื่อป้องกันการเข้าถึงข้อมูลของท่านโดยไม่ได้รับอนุญาต ข้อมูล Analytics ถูกเก็บในฐานข้อมูลที่มีการเข้ารหัสและจำกัดการเข้าถึง</p>
                        </div>

                        <div className="glass-card-light p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">6. สิทธิของผู้ใช้งาน</h2>
                            <p className="mb-3">ท่านมีสิทธิ์:</p>
                            <ul className="list-none space-y-2">
                                <li className="flex gap-3"><span className="text-orange-500 font-bold">•</span><span>หยุดใช้บริการได้ทุกเมื่อโดยการบล็อกหรือลบเพื่อน LINE Bot</span></li>
                                <li className="flex gap-3"><span className="text-orange-500 font-bold">•</span><span>ขอข้อมูลที่เกี่ยวข้องกับการใช้งานของท่าน (หากมี)</span></li>
                            </ul>
                        </div>

                        <div className="glass-card-light p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">7. การเปลี่ยนแปลงนโยบาย</h2>
                            <p>เราอาจปรับปรุงนโยบายความเป็นส่วนตัวนี้เป็นครั้งคราว โดยจะประกาศให้ทราบผ่านทางหน้าเว็บไซต์นี้</p>
                        </div>

                        <div className="glass-card-light p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">8. ติดต่อเรา</h2>
                            <p>
                                หากท่านมีข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัว สามารถติดต่อเราได้ที่{' '}
                                <a
                                    href="https://www.facebook.com/profile.php?id=61584449372366"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-orange-600 hover:text-orange-700 underline font-semibold"
                                >
                                    Facebook Page: Price Hunter
                                </a>
                            </p>
                        </div>

                        <div className="pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-400">อัปเดตล่าสุด: 13 ธันวาคม 2568</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-slate-950 text-white py-12 relative">
                <div className="absolute inset-0 dot-pattern opacity-30" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-white/30 text-xs">© {new Date().getFullYear()} Price Hunter Bot. All rights reserved.</p>
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
