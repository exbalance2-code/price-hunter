import React from 'react';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-white py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">นโยบายความเป็นส่วนตัว (Privacy Policy)</h1>

                <div className="prose prose-blue max-w-none text-gray-600">
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
                        <li><strong>ข้อความค้นหา (Search Queries):</strong> คำค้นหาที่ท่านพิมพ์ส่งมา เพื่อนำไปค้นหาสินค้าจาก Lazada/Shopee</li>
                        <li><strong>ข้อมูลการใช้งาน (Usage Data):</strong> สถิติการใช้งานทั่วไป เช่น จำนวนครั้งที่ค้นหา เพื่อนำไปปรับปรุงประสิทธิภาพของบอท</li>
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
                        <li>ป้องกันการใช้งานในทางที่ผิด</li>
                    </ul>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. การเปิดเผยข้อมูล</h2>
                    <p className="mb-6">
                        เราไม่ขาย แลกเปลี่ยน หรือโอนข้อมูลส่วนบุคคลของท่านให้แก่บุคคลภายนอก ยกเว้นในกรณีต่อไปนี้:
                    </p>
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li><strong>แพลตฟอร์ม E-commerce (Lazada/Shopee):</strong> เมื่อท่านคลิกลิงก์สินค้า เราอาจส่งต่อท่านไปยังแอปพลิเคชันหรือเว็บไซต์เหล่านั้น ซึ่งอยู่นอกเหนือการควบคุมของเรา</li>
                        <li><strong>การปฏิบัติตามกฎหมาย:</strong> หากมีความจำเป็นต้องเปิดเผยตามคำสั่งศาลหรือกฎหมาย</li>
                    </ul>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. ความปลอดภัยของข้อมูล</h2>
                    <p className="mb-6">
                        เราใช้มาตรการรักษาความปลอดภัยที่เหมาะสมเพื่อป้องกันการเข้าถึงข้อมูลของท่านโดยไม่ได้รับอนุญาต
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. การเปลี่ยนแปลงนโยบาย</h2>
                    <p className="mb-6">
                        เราอาจปรับปรุงนโยบายความเป็นส่วนตัวนี้เป็นครั้งคราว โดยจะประกาศให้ทราบผ่านทางหน้าเว็บไซต์นี้
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. ติดต่อเรา</h2>
                    <p className="mb-6">
                        หากท่านมีข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัว สามารถติดต่อเราได้ที่ Facebook Page: Price Hunter
                    </p>

                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            ประกาศเมื่อ: 4 ธันวาคม 2568
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
