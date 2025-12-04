import React from 'react';

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-white py-20 px-4 sm:px-6 lg:px-8">
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

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. การเปิดเผยข้อมูล Affiliate (Affiliate Disclosure)</h2>
                    <p className="mb-6">
                        บริการนี้ใช้งานฟรีสำหรับผู้ใช้ทั่วไป เพื่อสนับสนุนการให้บริการ เราอาจได้รับค่าตอบแทน (Commission) เล็กน้อยจากแพลตฟอร์ม E-commerce เมื่อท่านคลิกลิงก์และทำการสั่งซื้อสินค้า (โดยที่ท่านไม่ต้องจ่ายเงินเพิ่มแต่อย่างใด)
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. การใช้งานที่ห้ามกระทำ</h2>
                    <p className="mb-6">
                        ท่านตกลงที่จะไม่ใช้บริการนี้ในทางที่ผิด เช่น การส่งข้อความสแปม, การพยายามเจาะระบบ, หรือการใช้งานที่ละเมิดกฎหมาย
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. การเปลี่ยนแปลงเงื่อนไข</h2>
                    <p className="mb-6">
                        เราสงวนสิทธิ์ในการแก้ไขเปลี่ยนแปลงเงื่อนไขการใช้งานนี้ได้ตลอดเวลา โดยไม่ต้องแจ้งให้ทราบล่วงหน้า
                    </p>

                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            แก้ไขล่าสุดเมื่อ: 4 ธันวาคม 2568
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
