import React from 'react';
import Link from 'next/link';

export default function TermsOfService() {
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
                        <span className="text-orange-600 text-xs font-semibold">TERMS OF SERVICE</span>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-10">เงื่อนไขการใช้งาน</h1>

                    <div className="space-y-8 text-gray-600">
                        <p className="text-base leading-relaxed">
                            ยินดีต้อนรับสู่ Price Hunter Bot (&quot;บริการ&quot;) โปรดอ่านเงื่อนไขการใช้งานนี้อย่างละเอียดก่อนใช้งาน LINE Bot ของเรา
                        </p>

                        <div className="glass-card-light p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">1. ลักษณะการให้บริการ</h2>
                            <p className="mb-4">
                                Price Hunter Bot เป็นเพียง <strong>&quot;เครื่องมือค้นหาและเปรียบเทียบราคา&quot;</strong> เท่านั้น เราทำหน้าที่รวบรวมข้อมูลสินค้าจากแพลตฟอร์ม E-commerce (Shopee) มาแสดงผลเพื่ออำนวยความสะดวกแก่ผู้ใช้งาน
                            </p>
                            <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                                <p className="text-red-700 text-sm font-medium">
                                    ⚠️ เราไม่ใช่ผู้ขายสินค้า ไม่ใช่เจ้าของร้านค้า และไม่มีส่วนเกี่ยวข้องกับการจัดส่งหรือรับชำระเงินใดๆ ทั้งสิ้น
                                </p>
                            </div>
                        </div>

                        <div className="glass-card-light p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">2. การปฏิเสธความรับผิด (Disclaimer)</h2>
                            <ul className="list-none space-y-3">
                                <li className="flex gap-3"><span className="text-orange-500 font-bold">•</span><span><strong>ความถูกต้องของข้อมูล:</strong> แม้เราจะพยายามแสดงข้อมูลที่ถูกต้องที่สุด แต่ราคาและสต็อกสินค้าอาจมีการเปลี่ยนแปลงได้ตลอดเวลาตามแพลตฟอร์มต้นทาง เราไม่รับประกันความถูกต้องของราคา ณ เวลาที่ท่านสั่งซื้อ</span></li>
                                <li className="flex gap-3"><span className="text-orange-500 font-bold">•</span><span><strong>การซื้อขาย:</strong> การทำธุรกรรมใดๆ เกิดขึ้นระหว่างท่านและร้านค้าโดยตรง เราไม่รับผิดชอบต่อความเสียหาย ความล่าช้า หรือสินค้าที่ไม่ได้คุณภาพ</span></li>
                            </ul>
                        </div>

                        <div className="glass-card-light p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">3. หน้าสินค้ายอดนิยม (Trending Products)</h2>
                            <p className="mb-4">เราจัดทำหน้า &quot;สินค้ายอดนิยม&quot; เพื่อแสดงสถิติสินค้าที่ได้รับความสนใจมากที่สุด โดย:</p>
                            <ul className="list-none space-y-2">
                                <li className="flex gap-3"><span className="text-orange-500 font-bold">•</span><span>ข้อมูลที่แสดงเป็นสถิติรวม (Aggregated Data) ไม่สามารถระบุตัวตนผู้ใช้รายบุคคลได้</span></li>
                                <li className="flex gap-3"><span className="text-orange-500 font-bold">•</span><span>ข้อมูลอัปเดตอัตโนมัติตามพฤติกรรมการใช้งานจริง</span></li>
                                <li className="flex gap-3"><span className="text-orange-500 font-bold">•</span><span>หน้านี้เปิดให้สาธารณะเข้าถึงได้โดยไม่ต้อง login</span></li>
                                <li className="flex gap-3"><span className="text-orange-500 font-bold">•</span><span>ผู้ใช้สามารถแชร์หน้านี้ผ่าน Social Media ได้</span></li>
                            </ul>
                        </div>

                        <div className="glass-card-light p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">4. การเปิดเผยข้อมูล Affiliate (Affiliate Disclosure)</h2>
                            <p>
                                บริการนี้ใช้งานฟรีสำหรับผู้ใช้ทั่วไป เพื่อสนับสนุนการให้บริการ เราอาจได้รับค่าตอบแทน (Commission) เล็กน้อยจากแพลตฟอร์ม E-commerce เมื่อท่านคลิกลิงก์และทำการสั่งซื้อสินค้า (โดยที่ท่านไม่ต้องจ่ายเงินเพิ่มแต่อย่างใด)
                            </p>
                        </div>

                        <div className="glass-card-light p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">5. การใช้งานที่ห้ามกระทำ</h2>
                            <p>ท่านตกลงที่จะไม่ใช้บริการนี้ในทางที่ผิด เช่น การส่งข้อความสแปม, การพยายามเจาะระบบ, หรือการใช้งานที่ละเมิดกฎหมาย</p>
                        </div>

                        <div className="glass-card-light p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">6. การเปลี่ยนแปลงเงื่อนไข</h2>
                            <p>เราสงวนสิทธิ์ในการแก้ไขเปลี่ยนแปลงเงื่อนไขการใช้งานนี้ได้ตลอดเวลา โดยไม่ต้องแจ้งให้ทราบล่วงหน้า</p>
                        </div>

                        <div className="glass-card-light p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">7. ติดต่อเรา</h2>
                            <p>
                                หากท่านมีข้อสงสัยเกี่ยวกับเงื่อนไขการใช้งาน สามารถติดต่อเราได้ที่{' '}
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
