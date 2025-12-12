import React from 'react';
import Link from 'next/link';

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                Price Hunter Bot
                            </span>
                        </Link>

                        <div className="hidden md:flex items-center gap-8">
                            <Link href="/" className="text-sm text-gray-700 hover:text-blue-600 font-medium transition-colors">หน้าแรก</Link>
                            <Link href="/trending" className="text-sm text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-1">
                                🔥 สินค้ายอดนิยม
                            </Link>
                            <a
                                href="https://lin.ee/8VZY6eI"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">เงื่อนไขการใช้งาน (Terms of Service)</h1>

                    <div className="prose prose-blue max-w-none text-gray-600">
                        <p className="mb-6">
                            ยินดีต้อนรับสู่ Price Hunter Bot ("บริการ") โปรดอ่านเงื่อนไขการใช้งานนี้อย่างละเอียดก่อนใช้งาน LINE Bot ของเรา
                        </p>

                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. ลักษณะการให้บริการ</h2>
                        <p className="mb-4">
                            Price Hunter Bot เป็นเพียง <strong>"เครื่องมือค้นหาและเปรียบเทียบราคา"</strong> เท่านั้น เราทำหน้าที่รวบรวมข้อมูลสินค้าจากแพลตฟอร์ม E-commerce (เช่น Lazada, Shopee) มาแสดงผลเพื่ออำนวยความสะดวกแก่ผู้ใช้งาน
                        </p>
                        <p className="mb-6 text-red-600 font-semibold">
                            *เราไม่ใช่ผู้ขายสินค้า ไม่ใช่เจ้าของร้านค้า และไม่มีส่วนเกี่ยวข้องกับการจัดส่งหรือรับชำระเงินใดๆ ทั้งสิ้น*
                        </p>

                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. การปฏิเสธความรับผิด (Disclaimer)</h2>
                        <ul className="list-disc pl-6 mb-6 space-y-2">
                            <li><strong>ความถูกต้องของข้อมูล:</strong> แม้เราจะพยายามแสดงข้อมูลที่ถูกต้องที่สุด แต่ราคาและสต็อกสินค้าอาจมีการเปลี่ยนแปลงได้ตลอดเวลาตามแพลตฟอร์มต้นทาง เราไม่รับประกันความถูกต้องของราคา ณ เวลาที่ท่านสั่งซื้อ</li>
                            <li><strong>การซื้อขาย:</strong> การทำธุรกรรมใดๆ เกิดขึ้นระหว่างท่านและร้านค้าโดยตรง เราไม่รับผิดชอบต่อความเสียหาย ความล่าช้า หรือสินค้าที่ไม่ได้คุณภาพ</li>
                        </ul>

                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. หน้าสินค้ายอดนิยม (Trending Products)</h2>
                        <p className="mb-6">
                            เราจัดทำหน้า "สินค้ายอดนิยม" เพื่อแสดงสถิติสินค้าที่ได้รับความสนใจมากที่สุด โดย:
                        </p>
                        <ul className="list-disc pl-6 mb-6 space-y-2">
                            <li>ข้อมูลที่แสดงเป็นสถิติรวม (Aggregated Data) ไม่สามารถระบุตัวตนผู้ใช้รายบุคคลได้</li>
                            <li>ข้อมูลอัปเดตอัตโนมัติตามพฤติกรรมการใช้งานจริง</li>
                            <li>หน้านี้เปิดให้สาธารณะเข้าถึงได้โดยไม่ต้อง login</li>
                            <li>ผู้ใช้สามารถแชร์หน้านี้ผ่าน Social Media ได้</li>
                        </ul>

                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. การเปิดเผยข้อมูล Affiliate (Affiliate Disclosure)</h2>
                        <p className="mb-6">
                            บริการนี้ใช้งานฟรีสำหรับผู้ใช้ทั่วไป เพื่อสนับสนุนการให้บริการ เราอาจได้รับค่าตอบแทน (Commission) เล็กน้อยจากแพลตฟอร์ม E-commerce เมื่อท่านคลิกลิงก์และทำการสั่งซื้อสินค้า (โดยที่ท่านไม่ต้องจ่ายเงินเพิ่มแต่อย่างใด)
                        </p>

                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. การใช้งานที่ห้ามกระทำ</h2>
                        <p className="mb-6">
                            ท่านตกลงที่จะไม่ใช้บริการนี้ในทางที่ผิด เช่น การส่งข้อความสแปม, การพยายามเจาะระบบ, หรือการใช้งานที่ละเมิดกฎหมาย
                        </p>

                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. การเปลี่ยนแปลงเงื่อนไข</h2>
                        <p className="mb-6">
                            เราสงวนสิทธิ์ในการแก้ไขเปลี่ยนแปลงเงื่อนไขการใช้งานนี้ได้ตลอดเวลา โดยไม่ต้องแจ้งให้ทราบล่วงหน้า
                        </p>

                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">7. ติดต่อเรา</h2>
                        <p className="mb-6">
                            หากท่านมีข้อสงสัยเกี่ยวกับเงื่อนไขการใช้งาน สามารถติดต่อเราได้ที่{' '}
                            <a
                                href="https://www.facebook.com/profile.php?id=61584449372366"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline font-semibold"
                            >
                                Facebook Page: Price Hunter
                            </a>
                        </p>

                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <p className="text-sm text-gray-500">
                                อัปเดตล่าสุด: 7 ธันวาคม 2568
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
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <span className="text-xl font-bold">Price Hunter Bot</span>
                            </div>
                            <p className="text-sm text-gray-400 leading-relaxed max-w-md">
                                ผู้ช่วยค้นหาสินค้าอัจฉริยะที่จะช่วยให้คุณช้อปปิ้งได้อย่างฉลาด ประหยัด และปลอดภัย
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-base mb-4">ลิงก์ด่วน</h3>
                            <ul className="space-y-2">
                                <li><Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">หน้าแรก</Link></li>
                                <li><Link href="/trending" className="text-sm text-gray-400 hover:text-white transition-colors">🔥 สินค้ายอดนิยม</Link></li>
                                <li><Link href="/admin" className="text-sm text-gray-400 hover:text-white transition-colors">Admin</Link></li>
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
                            © {new Date().getFullYear()} Price Hunter Bot. All rights reserved. | v2.0.0
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
