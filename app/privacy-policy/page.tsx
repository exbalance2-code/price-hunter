import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-white flex flex-col">
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
                            <Link href="/trending" className="text-sm text-gray-700 hover:text-orange-600 font-medium transition-colors flex items-center gap-1">
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

            {/* Content */}
            <div className="flex-grow py-20 px-4 sm:px-6 lg:px-8 mt-20">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">นโยบายความเป็นส่วนตัว (Privacy Policy)</h1>

                    <div className="prose prose-orange max-w-none text-gray-600">
                        <p className="mb-6">
                            Price Hunter Bot ("เรา") ให้ความสำคัญกับความเป็นส่วนตัวของผู้ใช้งาน ("ท่าน") อย่างยิ่ง
                            นโยบายความเป็นส่วนตัวนี้อธิบายถึงวิธีการที่เราเก็บรวบรวม ใช้ และเปิดเผยข้อมูลของท่านเมื่อท่านใช้บริการ LINE Bot ของเรา
                        </p>

                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. ข้อมูลที่เราเก็บรวบรวม</h2>
                        <p className="mb-4">
                            เราเก็บรวบรวมข้อมูลเพียงเล็กน้อยเท่าที่จำเป็นเพื่อให้บริการแก่ท่าน ได้แก่:
                        </p>
                        <ul className="list-disc pl-6 mb-6 space-y-2">
                            <li><strong>ข้อมูลระบุตัวตนทาง LINE (LINE User ID):</strong> เพื่อใช้ในการตอบกลับข้อความและส่งผลลัพธ์การค้นหาให้ท่าน</li>
                            <li><strong>ข้อความค้นหา (Search Queries):</strong> คำค้นหาที่ท่านพิมพ์ส่งมา เพื่อนำไปค้นหาสินค้าจาก Shopee</li>
                            <li><strong>ข้อมูลการใช้งาน (Usage Data):</strong> สถิติการใช้งานทั่วไป เช่น จำนวนครั้งที่ค้นหา เพื่อนำไปปรับปรุงประสิทธิภาพของบอท</li>
                            <li><strong>ข้อมูล Analytics:</strong> เราเก็บสถิติการค้นหา (คำค้นหา, จำนวนผลลัพธ์) และการคลิก (ชื่อสินค้า, ราคา) เพื่อวิเคราะห์เทรนด์และปรับปรุงบริการ โดยไม่เชื่อมโยงกับข้อมูลส่วนตัวของท่าน</li>
                        </ul>
                        <p className="mb-6">
                            <strong>เราไม่เก็บรวบรวม:</strong> ชื่อ-นามสกุลจริง, ที่อยู่, เบอร์โทรศัพท์, หรือข้อมูลทางการเงิน (บัตรเครดิต) ของท่าน
                        </p>

                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. การใช้ข้อมูล</h2>
                        <p className="mb-6">
                            เราใช้ข้อมูลของท่านเพื่อ:
                        </p>
                        <ul className="list-disc pl-6 mb-6 space-y-2">
                            <li>ประมวลผลและส่งผลลัพธ์การค้นหาสินค้าให้ท่าน</li>
                            <li>วิเคราะห์และปรับปรุงการทำงานของ Price Hunter Bot</li>
                            <li>แสดงสถิติสินค้ายอดนิยมในหน้า "Trending Products" (โดยไม่แสดงข้อมูลส่วนตัวของผู้ใช้)</li>
                            <li>วิเคราะห์พฤติกรรมการใช้งานเพื่อพัฒนาฟีเจอร์ใหม่</li>
                            <li>ป้องกันการใช้งานในทางที่ผิด</li>
                        </ul>

                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. การแสดงข้อมูลสาธารณะ</h2>
                        <p className="mb-6">
                            เราแสดงข้อมูลสถิติแบบรวม (Aggregated Data) ในหน้า "สินค้ายอดนิยม" ซึ่งประกอบด้วย:
                        </p>
                        <ul className="list-disc pl-6 mb-6 space-y-2">
                            <li>ชื่อสินค้าที่ได้รับความสนใจมากที่สุด</li>
                            <li>ราคาสินค้า</li>
                            <li>แพลตฟอร์ม (Shopee)</li>
                            <li>จำนวนคนที่สนใจ (ไม่ระบุตัวตน)</li>
                        </ul>
                        <p className="mb-6">
                            <strong className="text-red-600">ข้อมูลเหล่านี้ไม่สามารถระบุตัวตนของผู้ใช้รายบุคคลได้</strong> และเป็นเพียงสถิติรวมเท่านั้น
                        </p>

                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. การเปิดเผยข้อมูล</h2>
                        <p className="mb-6">
                            เราไม่ขาย แลกเปลี่ยน หรือโอนข้อมูลส่วนบุคคลของท่านให้แก่บุคคลภายนอก ยกเว้นในกรณีต่อไปนี้:
                        </p>
                        <ul className="list-disc pl-6 mb-6 space-y-2">
                            <li><strong>แพลตฟอร์ม E-commerce (Shopee):</strong> เมื่อท่านคลิกลิงก์สินค้า เราอาจส่งต่อท่านไปยังแอปพลิเคชันหรือเว็บไซต์ของ Shopee ซึ่งอยู่นอกเหนือการควบคุมของเรา</li>
                            <li><strong>การปฏิบัติตามกฎหมาย:</strong> หากมีความจำเป็นต้องเปิดเผยตามคำสั่งศาลหรือกฎหมาย</li>
                        </ul>

                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. ความปลอดภัยของข้อมูล</h2>
                        <p className="mb-6">
                            เราใช้มาตรการรักษาความปลอดภัยที่เหมาะสมเพื่อป้องกันการเข้าถึงข้อมูลของท่านโดยไม่ได้รับอนุญาต ข้อมูล Analytics ถูกเก็บในฐานข้อมูลที่มีการเข้ารหัสและจำกัดการเข้าถึง
                        </p>

                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. สิทธิของผู้ใช้งาน</h2>
                        <p className="mb-6">
                            ท่านมีสิทธิ์:
                        </p>
                        <ul className="list-disc pl-6 mb-6 space-y-2">
                            <li>หยุดใช้บริการได้ทุกเมื่อโดยการบล็อกหรือลบเพื่อน LINE Bot</li>
                            <li>ขอข้อมูลที่เกี่ยวข้องกับการใช้งานของท่าน (หากมี)</li>
                        </ul>

                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">7. การเปลี่ยนแปลงนโยบาย</h2>
                        <p className="mb-6">
                            เราอาจปรับปรุงนโยบายความเป็นส่วนตัวนี้เป็นครั้งคราว โดยจะประกาศให้ทราบผ่านทางหน้าเว็บไซต์นี้
                        </p>

                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">8. ติดต่อเรา</h2>
                        <p className="mb-6">
                            หากท่านมีข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัว สามารถติดต่อเราได้ที่{' '}
                            <a
                                href="https://www.facebook.com/profile.php?id=61584449372366"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-orange-600 hover:text-orange-800 underline font-semibold"
                            >
                                Facebook Page: Price Hunter
                            </a>
                        </p>

                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <p className="text-sm text-gray-500">
                                อัปเดตล่าสุด: 13 ธันวาคม 2568
                            </p>
                        </div>
                    </div>
                </div>
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
