'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);

    const ctx = gsap.context(() => {
      gsap.from('.hero-badge', { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' });
      gsap.from('.hero-title', { opacity: 0, y: 40, duration: 0.8, delay: 0.2, ease: 'power3.out' });
      gsap.from('.hero-desc', { opacity: 0, y: 30, duration: 0.8, delay: 0.4, ease: 'power3.out' });
      gsap.from('.hero-buttons', { opacity: 0, y: 30, duration: 0.8, delay: 0.6, ease: 'power3.out' });
      gsap.from('.hero-stats', { opacity: 0, y: 20, duration: 0.8, delay: 0.8, ease: 'power3.out' });

      gsap.from('.hero-visual', {
        opacity: 0, x: 80, duration: 1.2, delay: 0.3, ease: 'power3.out',
        onComplete: () => {
          gsap.to('.hero-visual', { y: -15, duration: 3, repeat: -1, yoyo: true, ease: 'power1.inOut' });
        },
      });

      gsap.from('.service-card', {
        scrollTrigger: { trigger: '.services-section', start: 'top 80%' },
        opacity: 0, y: 60, duration: 0.7, stagger: 0.12, ease: 'power2.out',
      });

      gsap.from('.feature-card', {
        scrollTrigger: { trigger: '.features-section', start: 'top 80%' },
        opacity: 0, y: 50, duration: 0.7, stagger: 0.15, ease: 'power2.out',
      });

      gsap.from('.step-item', {
        scrollTrigger: { trigger: '.steps-container', start: 'top 80%' },
        opacity: 0, y: 40, duration: 0.7, stagger: 0.15, ease: 'power2.out',
      });

      gsap.from('.cta-content', {
        scrollTrigger: { trigger: '.cta-section', start: 'top 80%' },
        opacity: 0, scale: 0.9, duration: 0.8, ease: 'back.out(1.7)',
      });
    }, heroRef);

    return () => { ctx.revert(); window.removeEventListener('scroll', handleScroll); };
  }, []);

  const services = [
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: "ค้นหา Shopee ทันใจ",
      desc: "ไม่ต้องเปิดแอป พิมพ์ค้นหาใน LINE ได้เลย ระบบ AI ช่วยหาของให้ทันที",
      gradient: "from-orange-500 to-amber-500",
      glow: "group-hover:shadow-orange-500/20",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "คัดมาแต่ของดี",
      desc: "เลือกเฉพาะสินค้ายอดฮิต ร้านดัง คะแนนรีวิวสูง มั่นใจได้",
      gradient: "from-red-500 to-rose-500",
      glow: "group-hover:shadow-red-500/20",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "ปลอดภัย 100%",
      desc: "ทุกลิงก์พาไปที่แอป Shopee โดยตรง ปลอดภัย ไม่มีการดักข้อมูล",
      gradient: "from-emerald-500 to-green-500",
      glow: "group-hover:shadow-emerald-500/20",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "ไวเหมือนติดจรวด",
      desc: "ได้ผลลัพธ์ใน 3 วินาที จะเทียบราคาหรือหาร้านถูกสุดก็ง่าย",
      gradient: "from-violet-500 to-purple-500",
      glow: "group-hover:shadow-violet-500/20",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: "ใช้ง่ายผ่าน LINE",
      desc: "แอปสามัญประจำเครื่อง ไม่ต้องโหลดอะไรเพิ่มให้หนักเครื่อง",
      gradient: "from-blue-500 to-cyan-500",
      glow: "group-hover:shadow-blue-500/20",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "ใช้ฟรี ตลอดชีพ",
      desc: "ไม่มีค่าใช้จ่ายแฝง ไม่ต้องสมัครสมาชิก ใช้ได้ทันที",
      gradient: "from-yellow-500 to-orange-500",
      glow: "group-hover:shadow-yellow-500/20",
    },
  ];

  const features = [
    {
      number: "01",
      title: "ช้อปสนุกขึ้น",
      desc: "ไม่ต้องสลับแอปไปมา ค้นหาใน LINE ปุ๊บ เจอปั๊บ กดซื้อได้เลย",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      number: "02",
      title: "ความเป็นส่วนตัวสูง",
      desc: "เราไม่มีการเก็บข้อมูลบัตรเครดิต หรือที่อยู่ของคุณ 100%",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
    {
      number: "03",
      title: "ดีลเด็ดตลอด 24 ชม.",
      desc: "บอททำงานตลอดเวลา อยากช้อปตอนตี 2 ก็พร้อมช่วยคุณเสมอ",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const steps = [
    { step: "1", title: "เพิ่มเพื่อน", desc: "แอดไลน์ Price Hunter Bot", image: "/step1_add_friend.png", color: "from-orange-500 to-red-500" },
    { step: "2", title: "พิมพ์ชื่อสินค้า", desc: "อยากได้อะไร พิมพ์บอกบอท", image: "/step2_search.png", color: "from-red-500 to-rose-500" },
    { step: "3", title: "เลือกของ", desc: "ดูรายการสินค้าที่บอทหาให้", image: "/step3_results.png", color: "from-rose-500 to-purple-500" },
    { step: "4", title: "ไปที่ Shopee", desc: "กดปุ่มเพื่อไปหน้าแอป", image: "/step4_redirect.png", color: "from-purple-500 to-violet-500" },
    { step: "5", title: "ช้อปเลย!", desc: "สั่งซื้อในแอปตามปกติ", image: "/step5_buy.png", color: "from-violet-500 to-blue-500" },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans" ref={heroRef}>
      {/* ========== Navbar ========== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-18">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-orange-500 via-red-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span className="text-lg font-bold gradient-text">Price Hunter</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <a href="#services" className="text-sm text-gray-600 hover:text-orange-600 font-medium transition-colors duration-200">บริการ</a>
              <a href="#features" className="text-sm text-gray-600 hover:text-orange-600 font-medium transition-colors duration-200">จุดเด่น</a>
              <a href="#demo" className="text-sm text-gray-600 hover:text-orange-600 font-medium transition-colors duration-200">วิธีใช้งาน</a>
              <Link href="/trending" className="text-sm text-gray-600 hover:text-orange-600 font-medium transition-colors duration-200 flex items-center gap-1">
                <span className="text-base">🔥</span> สินค้ายอดนิยม
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

            <button className="md:hidden text-gray-600 p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 border-t border-gray-100 mt-2 pt-4 space-y-3">
              <a href="#services" className="block text-sm text-gray-600 hover:text-orange-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>บริการ</a>
              <a href="#features" className="block text-sm text-gray-600 hover:text-orange-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>จุดเด่น</a>
              <a href="#demo" className="block text-sm text-gray-600 hover:text-orange-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>วิธีใช้งาน</a>
              <Link href="/trending" className="block text-sm text-gray-600 hover:text-orange-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>🔥 สินค้ายอดนิยม</Link>
              <a
                href="https://lin.ee/8VZY6eI"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center px-5 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm rounded-xl font-semibold mt-2"
              >
                เริ่มใช้งานฟรี
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* ========== Hero Section ========== */}
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 grid-pattern" />
        <div className="floating-orb w-[500px] h-[500px] bg-orange-600/30 top-[-100px] right-[-100px]" />
        <div className="floating-orb w-[400px] h-[400px] bg-purple-600/20 bottom-[-50px] left-[-100px]" />
        <div className="floating-orb w-[300px] h-[300px] bg-red-500/15 top-[40%] left-[30%]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="hero-badge inline-flex items-center gap-2.5 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/10 mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                </span>
                <span className="text-white/80 font-medium text-xs tracking-wide">ออนไลน์ 24/7 — ใช้งานฟรีตลอดชีพ</span>
              </div>

              <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-[1.15] tracking-tight">
                ค้นหาสินค้า
                <br />
                <span className="bg-gradient-to-r from-orange-400 via-red-400 to-purple-400 bg-clip-text text-transparent">
                  โปรแรงจาก Shopee
                </span>
              </h1>

              <p className="hero-desc text-lg text-white/60 mb-10 leading-relaxed max-w-lg">
                แค่พิมพ์ชื่อสินค้าใน LINE เราคัดร้านเด็ด ราคาโดนใจ ส่งตรงถึงคุณภายใน 3 วินาที
              </p>

              <div className="hero-buttons flex flex-col sm:flex-row gap-4">
                <a
                  href="https://lin.ee/8VZY6eI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-line text-center text-base flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596a.626.626 0 01-.199.031c-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                  </svg>
                  เพิ่มเพื่อน LINE ฟรี
                </a>
                <a
                  href="#demo"
                  className="btn-secondary text-center text-base"
                >
                  ดูวิธีใช้งาน →
                </a>
              </div>

              {/* Hero Stats */}
              <div className="hero-stats grid grid-cols-3 gap-6 mt-14 pt-8 border-t border-white/10">
                {[
                  { value: "3 วิ", label: "ความเร็วตอบกลับ" },
                  { value: "100%", label: "ฟรี ไม่มีค่าใช้จ่าย" },
                  { value: "24/7", label: "พร้อมให้บริการ" },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-extrabold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">{stat.value}</div>
                    <div className="text-xs text-white/40 mt-1.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-visual relative hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-8 bg-gradient-to-r from-orange-500/20 via-red-500/10 to-purple-500/20 rounded-[2rem] blur-3xl" />
                <div className="relative glass-card p-6 overflow-hidden">
                  <img
                    src="/line-mockup.png"
                    alt="Price Hunter LINE Bot Demo"
                    className="relative w-full h-auto rounded-xl shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-[1.25rem]" />
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 glass-card px-4 py-2.5 animate-bounce">
                <span className="text-white text-sm font-semibold">⚡ ไวมาก 3 วิ</span>
              </div>
              <div className="absolute -bottom-4 -left-4 glass-card px-4 py-2.5" style={{ animation: 'float 4s ease-in-out infinite' }}>
                <span className="text-white text-sm font-semibold">🛒 Shopee ของแท้</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== Services Section ========== */}
      <section id="services" className="services-section py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-50 rounded-full mb-4">
              <span className="text-orange-600 text-xs font-semibold tracking-wide uppercase">บริการ</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">
              ออกแบบมาเพื่อ<span className="gradient-text">คนรักการช้อป</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              ฟีเจอร์ครบครันเพื่อให้คุณช้อป Shopee ได้ง่ายและคุ้มค่าที่สุด
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div key={index} className="service-card group">
                <div className={`relative p-7 bg-white rounded-2xl border border-gray-100 hover:border-transparent hover:shadow-2xl ${service.glow} transition-all duration-500 h-full card-hover`}>
                  <div className={`w-14 h-14 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== Features Section ========== */}
      <section id="features" className="features-section py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 dot-pattern" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full mb-4 border border-white/10">
              <span className="text-orange-300 text-xs font-semibold tracking-wide uppercase">จุดเด่น</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">
              ทำไมต้อง <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Price Hunter Bot?</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              เพื่อนคู่ใจนักช้อป Shopee ตัวจริง
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="glass-card p-8 h-full hover:bg-white/10 transition-all duration-500 card-hover">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-5xl font-black text-white/10">{feature.number}</span>
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-white/50 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== Demo / Steps Section ========== */}
      <section id="demo" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-50 rounded-full mb-4">
              <span className="text-orange-600 text-xs font-semibold tracking-wide uppercase">วิธีใช้งาน</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">
              ง่ายๆ แค่ <span className="gradient-text">5 ขั้นตอน</span>
            </h2>
            <p className="text-gray-500">ก็ช้อป Shopee ได้โปรคุ้มๆ</p>
          </div>

          <div className="steps-container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8 items-start max-w-6xl mx-auto">
            {steps.map((item, index) => (
              <div key={index} className="step-item text-center group">
                <div className="relative inline-block mb-5">
                  <div className={`absolute -inset-3 bg-gradient-to-r ${item.color} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500`} />
                  <img
                    src={item.image}
                    alt={item.title}
                    className="relative w-full max-w-[180px] mx-auto rounded-2xl shadow-xl ring-1 ring-black/5 transform group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                    onClick={() => setSelectedImage(item.image)}
                  />
                  <div className={`absolute -top-3 -right-3 w-9 h-9 bg-gradient-to-br ${item.color} text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg border-2 border-white`}>
                    {item.step}
                  </div>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA Section ========== */}
      <section className="cta-section py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-red-600 to-purple-700" />
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="floating-orb w-[400px] h-[400px] bg-white/10 top-[-100px] right-[-50px]" />
        <div className="floating-orb w-[300px] h-[300px] bg-purple-400/20 bottom-[-50px] left-[-50px]" />

        <div className="cta-content max-w-3xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full mb-8 border border-white/20">
            <span className="text-white/90 text-xs font-semibold">✨ ฟรีตลอดชีพ ไม่มีค่าบริการ</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            พร้อมช้อปของถูก<br className="hidden sm:block" />หรือยัง?
          </h2>
          <p className="text-lg text-white/70 mb-10 leading-relaxed">
            เพิ่มเพื่อน Price Hunter Bot วันนี้ ช้อป Shopee สนุกขึ้นเยอะ
          </p>
          <a
            href="https://lin.ee/8VZY6eI"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-gray-900 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1"
          >
            <svg className="w-6 h-6 text-[#06c755]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
            </svg>
            เพิ่มเพื่อน LINE ตอนนี้
          </a>
        </div>
      </section>

      {/* ========== Footer ========== */}
      <footer className="bg-slate-950 text-white py-16 relative">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-5">
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
                <li><a href="#services" className="text-sm text-white/40 hover:text-orange-400 transition-colors">บริการ</a></li>
                <li><a href="#features" className="text-sm text-white/40 hover:text-orange-400 transition-colors">จุดเด่น</a></li>
                <li><a href="#demo" className="text-sm text-white/40 hover:text-orange-400 transition-colors">วิธีใช้งาน</a></li>
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

      {/* ========== Scroll to Top ========== */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 right-6 z-50 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-xl transition-all duration-300 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
        aria-label="กลับขึ้นด้านบน"
      >
        <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

      {/* ========== Image Lightbox ========== */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors"
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={selectedImage}
              alt="Full size"
              className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
