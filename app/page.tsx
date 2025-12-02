'use client';

import React, { useEffect, useRef } from 'react';
import { Prompt } from 'next/font/google';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = React.useState(false);

  useEffect(() => {
    // Scroll to Top Button Visibility
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);

    // Hero Animation
    const ctx = gsap.context(() => {
      gsap.from('.hero-badge', {
        opacity: 0,
        y: -20,
        duration: 0.6,
        ease: 'power2.out',
      });

      gsap.from('.hero-title', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.2,
        ease: 'power2.out',
      });

      gsap.from('.hero-description', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.4,
        ease: 'power2.out',
      });

      gsap.from('.hero-cta', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.6,
        ease: 'power2.out',
      });

      gsap.from('.hero-mockup', {
        opacity: 0,
        y: 40,
        duration: 1,
        delay: 0.8,
        ease: 'power2.out',
      });

      // Dual Phone Mockup Animation (Stagger)
      gsap.from('.mockup-phone', {
        opacity: 0,
        y: 60,
        duration: 1,
        delay: 1,
        stagger: 0.3,
        ease: 'power2.out',
      });

      // Features Animation
      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: '.features-section',
          start: 'top 80%',
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
      });

      // CTA Section Animation
      gsap.from('.cta-content', {
        scrollTrigger: {
          trigger: '.cta-section',
          start: 'top 80%',
        },
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        ease: 'power2.out',
      });
    }, heroRef);

    return () => {
      ctx.revert();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`min-h-screen bg-white text-gray-900 ${prompt.className} flex flex-col`} ref={heroRef}>

      {/* ---------------- Navbar ---------------- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">Price Hunter</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#demo" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">วิธีใช้งาน</a>
              <a href="#features" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">จุดเด่น</a>
              <a href="https://lin.ee/8VZY6eI" target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium text-sm transition-all shadow-lg shadow-blue-600/20">
                แอดไลน์ฟรี
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                className="text-gray-500 hover:text-gray-900"
                aria-label="เปิดเมนู"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ---------------- Hero Section ---------------- */}
      <main className="flex-grow">
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white -z-10" />
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="hero-badge inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              พร้อมใช้งานแล้ววันนี้
            </div>

            <h1 className="hero-title text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
              ช้อปฉลาดกว่าใคร <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">ให้บอทช่วยหาของถูก</span>
            </h1>

            <p className="hero-description text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              ผู้ช่วยส่วนตัวที่จะช่วยคุณค้นหาสินค้าจาก Lazada เปรียบเทียบราคา และคัดเฉพาะร้านที่น่าเชื่อถือ ส่งตรงถึง LINE ของคุณในวินาทีเดียว
            </p>

            <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="https://lin.ee/8VZY6eI" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-600/20 transition-all transform hover:-translate-y-1">
                แอดไลน์ใช้งานฟรี 👉
              </a>
              <a href="#demo" className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl font-bold text-lg transition-all">
                ดูตัวอย่าง
              </a>
            </div>

            {/* Dual Phone Mockup Images */}
            <div id="demo" className="hero-mockup mt-16 relative mx-auto max-w-4xl scroll-mt-20">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Step 1: User sends message */}
                <div className="mockup-phone text-center">
                  <img
                    src="/mockup-step1.png"
                    alt="Step 1: ส่งข้อความค้นหาสินค้า"
                    className="w-full h-auto drop-shadow-2xl mx-auto max-w-sm"
                  />
                  <p className="mt-4 text-sm font-semibold text-gray-600">
                    <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                      ขั้นที่ 1
                    </span>
                    <br />
                    <span className="mt-2 inline-block">พิมพ์ชื่อสินค้าที่ต้องการ</span>
                  </p>
                </div>

                {/* Step 2: Bot responds with results */}
                <div className="mockup-phone text-center">
                  <img
                    src="/mockup-step2.png"
                    alt="Step 2: รับผลลัพธ์สินค้าราคาถูก"
                    className="w-full h-auto drop-shadow-2xl mx-auto max-w-sm"
                  />
                  <p className="mt-4 text-sm font-semibold text-gray-600">
                    <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full">
                      ขั้นที่ 2
                    </span>
                    <br />
                    <span className="mt-2 inline-block">รับผลลัพธ์ภายใน 3 วินาที</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- Features Section ---------------- */}
        <section id="features" className="features-section py-24 bg-white" ref={featuresRef}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">ทำไมต้องใช้ Price Hunter?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">เราออกแบบมาเพื่อช่วยให้การช้อปปิ้งของคุณง่ายขึ้น ประหยัดขึ้น และปลอดภัยขึ้น</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  ),
                  title: "ค้นหาไวใน 3 วิ",
                  desc: "ไม่ต้องเปิดแอป เลื่อนหาเองให้เสียเวลา แค่พิมพ์ชื่อสินค้า บอทจะไปกวาดข้อมูลมาให้ทันที"
                },
                {
                  icon: (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  ),
                  title: "คัดของถูกที่สุด",
                  desc: "ระบบจะเรียงลำดับราคาจากน้อยไปมากให้เสมอ เพื่อให้คุณได้ดีลที่ดีที่สุดโดยไม่ต้องเทียบเอง"
                },
                {
                  icon: (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  ),
                  title: "เชื่อถือได้",
                  desc: "เราคัดกรองเฉพาะร้านค้าที่มีประวัติการขายจริง มีรีวิว เพื่อป้องกันการโดนโกง"
                }
              ].map((feature, index) => (
                <div key={index} className="feature-card p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-shadow group">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- CTA Section ---------------- */}
        <section className="cta-section py-24 bg-gray-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

          <div className="cta-content max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">พร้อมจะประหยัดเงินหรือยัง?</h2>
            <p className="text-gray-400 mb-10 text-lg">เริ่มใช้งานได้ทันที ฟรีตลอดชีพ ไม่ต้องลงทะเบียน ไม่ต้องโหลดแอปเพิ่ม</p>
            <a href="https://lin.ee/8VZY6eI" target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-1">
              แอดไลน์ Price Hunter เลย
            </a>
          </div>
        </section>
      </main>

      {/* ---------------- Footer ---------------- */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-gray-900 text-white p-1 rounded">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <span className="font-bold text-gray-900">Price Hunter</span>
          </div>

          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Price Hunter. All rights reserved. | v1.0.0
          </div>

          <div className="flex gap-6">
            <a href="https://www.facebook.com/profile.php?id=61584449372366" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors">
              <span className="sr-only">Facebook</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
            </a>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all transform ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
          }`}
        aria-label="กลับขึ้นด้านบน"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
        </svg>
      </button>
    </div>
  );
}