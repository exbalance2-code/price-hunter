'use client';

import React, { useEffect, useRef, useState } from 'react';
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
  const [showScrollTop, setShowScrollTop] = React.useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);

    const ctx = gsap.context(() => {
      // Hero animations
      gsap.from('.hero-content', {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.from('.hero-image', {
        opacity: 0,
        x: 60,
        duration: 1.2,
        delay: 0.3,
        ease: 'power3.out',
        onComplete: () => {
          gsap.to('.hero-image', {
            y: -20,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut',
          });
        },
      });

      // Service cards animation
      gsap.from('.service-card', {
        scrollTrigger: {
          trigger: '.services-section',
          start: 'top 75%',
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
      });

      // Feature cards animation
      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: '.features-section',
          start: 'top 75%',
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
      });

      // Stats animation
      gsap.from('.stat-item', {
        scrollTrigger: {
          trigger: '.stats-section',
          start: 'top 75%',
        },
        opacity: 0,
        scale: 0.8,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)',
      });

      // Steps animation
      gsap.from('.step-item', {
        scrollTrigger: {
          trigger: '.steps-container',
          start: 'top 75%',
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
      });

      // CTA animation
      gsap.from('.cta-content', {
        scrollTrigger: {
          trigger: '.cta-section',
          start: 'top 75%',
        },
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        ease: 'back.out(1.7)',
      });
    }, heroRef);

    return () => {
      ctx.revert();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans" ref={heroRef}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Price Hunter Bot
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-sm text-gray-700 hover:text-orange-600 font-medium transition-colors">บริการ</a>
              <a href="#features" className="text-sm text-gray-700 hover:text-orange-600 font-medium transition-colors">จุดเด่น</a>
              <a href="#demo" className="text-sm text-gray-700 hover:text-orange-600 font-medium transition-colors">วิธีใช้งาน</a>
              <a href="/trending" className="text-sm text-gray-700 hover:text-orange-600 font-medium transition-colors flex items-center gap-1">
                🔥 สินค้ายอดนิยม
              </a>
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

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-400/20 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="hero-content">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full mb-6">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-600" />
                </span>
                <span className="text-orange-700 font-semibold text-xs">ใช้งานได้ทันที ฟรี!</span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                ค้นหาสินค้าโปรแรง<br />
                <span className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent">
                  จาก Shopee
                </span>
              </h1>

              <p className="text-base text-gray-600 mb-8 leading-relaxed">
                ค้นหาสินค้าจาก Shopee ได้ง่ายๆ แค่พิมพ์ชื่อสินค้า เราคัดร้านเด็ด ราคาโดนใจ
                ส่งตรงถึง LINE ของคุณภายใน 3 วินาที
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://lin.ee/8VZY6eI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-[#06C755] hover:bg-[#05b34c] text-white rounded-xl font-bold text-base shadow-xl shadow-green-600/30 hover:shadow-2xl hover:shadow-green-600/40 transition-all duration-300 transform hover:-translate-y-1 text-center"
                >
                  เพิ่มเพื่อน LINE ฟรี
                </a>
                <a
                  href="#demo"
                  className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-xl font-bold text-base hover:border-orange-500 hover:text-orange-600 transition-all duration-300 text-center"
                >
                  ดูตัวอย่างการใช้งาน
                </a>
              </div>

              {/* Stats */}
              <div className="stats-section grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-200">
                <div className="stat-item text-center">
                  <div className="text-2xl font-bold text-orange-600">3 วิ</div>
                  <div className="text-xs text-gray-600 mt-1">ความเร็วตอบกลับ</div>
                </div>
                <div className="stat-item text-center">
                  <div className="text-2xl font-bold text-orange-600">100%</div>
                  <div className="text-xs text-gray-600 mt-1">ฟรี ไม่มีค่าใช้จ่าย</div>
                </div>
                <div className="stat-item text-center">
                  <div className="text-2xl font-bold text-orange-600">24/7</div>
                  <div className="text-xs text-gray-600 mt-1">พร้อมให้บริการ</div>
                </div>
              </div>
            </div>

            <div className="hero-image relative">
              <div className="relative bg-gray-100 rounded-2xl p-8">
                <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl opacity-20 blur-2xl" />
                <img
                  src="/line-mockup.png"
                  alt="Price Hunter LINE Bot Demo"
                  className="relative w-full h-auto rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">บริการของเรา</h2>
            <p className="text-base text-gray-600 max-w-3xl mx-auto">
              ออกแบบมาเพื่อคนรักการช้อป Shopee โดยเฉพาะ
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
                title: "ค้นหา Shopee ทันใจ",
                desc: "ไม่ต้องเปิดแอป พิมพ์ค้นหาใน LINE ได้เลย ระบบ AI ช่วยหาของให้ทันที",
                gradient: "from-orange-500 to-orange-600"
              },
              {
                icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
                title: "คัดมาแต่ของดี",
                desc: "เลือกเฉพาะสินค้ายอดฮิต ร้านดัง คะแนนรีวิวสูง มั่นใจได้",
                gradient: "from-red-500 to-red-600"
              },
              {
                icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
                title: "ปลอดภัย 100%",
                desc: "ทุกลิงก์พาไปที่แอป Shopee โดยตรง ปลอดภัย ไม่มีการดักข้อมูล",
                gradient: "from-yellow-500 to-orange-500"
              },
              {
                icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
                title: "ไวเหมือนติดจรวด",
                desc: "ได้ผลลัพธ์ใน 3 วินาที จะเทียบราคาหรือหาร้านถูกสุดก็ง่าย",
                gradient: "from-amber-500 to-orange-600"
              },
              {
                icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
                title: "ใช้ง่ายผ่าน LINE",
                desc: "แอปสามัญประจำเครื่อง ไม่ต้องโหลดอะไรเพิ่มให้หนักเครื่อง",
                gradient: "from-rose-500 to-red-600"
              },
              {
                icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                title: "ใช้ฟรี ตลอดชีพ",
                desc: "ไม่มีค่าใช้จ่ายแฝง ไม่ต้องสมัครสมาชิก ใช้ได้ทันที",
                gradient: "from-orange-600 to-red-700"
              }
            ].map((service, index) => (
              <div key={index} className="service-card group">
                <div className="relative p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-300 h-full">
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />

                  <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {service.icon}
                  </div>

                  <h3 className="text-base font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section py-20 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">ทำไมต้อง Price Hunter Bot?</h2>
            <p className="text-base text-gray-600 max-w-3xl mx-auto">
              เพื่อนคู่ใจนักช้อป Shopee ตัวจริง
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                number: "01",
                title: "ช้อปสนุกขึ้น",
                desc: "ไม่ต้องสลับแอปไปมา ค้นหาใน LINE ปุ๊บ เจอปั๊บ กดซื้อได้เลย",
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              },
              {
                number: "02",
                title: "ความเป็นส่วนตัวสูง",
                desc: "เราไม่มีการเก็บข้อมูลบัตรเครดิต หรือที่อยู่ของคุณ 100%",
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              },
              {
                number: "03",
                title: "ดีลเด็ดตลอด 24 ชม.",
                desc: "บอททำงานตลอดเวลา อยากช้อปตอนตี 2 ก็พร้อมช่วยคุณเสมอ",
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              }
            ].map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 h-full border border-gray-100">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-4xl font-bold text-orange-200">{feature.number}</div>
                    <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">วิธีใช้งาน</h2>
            <p className="text-base text-gray-600">ง่ายๆ แค่ 5 ขั้นตอน ก็ช้อป Shopee ได้โปรคุ้มๆ</p>
          </div>

          <div className="steps-container grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 items-start max-w-7xl mx-auto">
            {[
              {
                step: "1",
                title: "เพิ่มเพื่อน",
                desc: "แอดไลน์ Price Hunter Bot",
                image: "/step1_add_friend.png",
                gradient: "from-orange-400 to-orange-600",
                bg: "bg-orange-600"
              },
              {
                step: "2",
                title: "พิมพ์ชื่อสินค้า",
                desc: "อยากได้อะไร พิมพ์บอกบอท",
                image: "/step2_search.png",
                gradient: "from-red-400 to-red-600",
                bg: "bg-red-600"
              },
              {
                step: "3",
                title: "เลือกของ",
                desc: "ดูรายการสินค้าที่บอทหาให้",
                image: "/step3_results.png",
                gradient: "from-yellow-400 to-orange-500",
                bg: "bg-orange-500"
              },
              {
                step: "4",
                title: "ไปที่ Shopee",
                desc: "กดปุ่มเพื่อไปหน้าแอป",
                image: "/step4_redirect.png",
                gradient: "from-orange-500 to-red-500",
                bg: "bg-red-500"
              },
              {
                step: "5",
                title: "ช้อปเลย!",
                desc: "สั่งซื้อในแอปตามปกติ",
                image: "/step5_buy.png",
                gradient: "from-red-500 to-rose-600",
                bg: "bg-rose-600"
              }
            ].map((item, index) => (
              <div key={index} className="step-item text-center group">
                <div className="relative inline-block mb-6">
                  <div className={`absolute -inset-4 bg-gradient-to-r ${item.gradient} rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300`} />
                  <img
                    src={item.image}
                    alt={item.title}
                    className="relative w-full max-w-[200px] mx-auto rounded-2xl shadow-xl transform group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => setSelectedImage(item.image)}
                  />
                  <div className={`absolute -top-4 -right-4 w-10 h-10 ${item.bg} text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg border-2 border-white`}>
                    {item.step}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed px-2">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-24 bg-gradient-to-br from-orange-600 via-orange-700 to-red-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-800/20 rounded-full blur-3xl" />

        <div className="cta-content max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            พร้อมช้อปของถูกหรือยัง?
          </h2>
          <p className="text-base text-orange-100 mb-10 leading-relaxed">
            เพิ่มเพื่อน Price Hunter Bot วันนี้ ช้อป Shopee สนุกขึ้นเยอะ<br />
            ฟรี! ไม่มีค่าบริการ
          </p>
          <a
            href="https://lin.ee/8VZY6eI"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-white text-orange-700 rounded-xl font-bold text-base shadow-2xl hover:shadow-3xl hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1"
          >
            เพิ่มเพื่อน LINE ตอนนี้เลย
          </a>
        </div>
      </section>

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
                <li><a href="#services" className="text-sm text-gray-400 hover:text-white transition-colors">บริการ</a></li>
                <li><a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">จุดเด่น</a></li>
                <li><a href="#demo" className="text-sm text-gray-400 hover:text-white transition-colors">วิธีใช้งาน</a></li>
                <li><a href="/trending" className="text-sm text-gray-400 hover:text-white transition-colors">🔥 สินค้ายอดนิยม</a></li>
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
              <a href="/privacy-policy" className="hover:text-white transition-colors">นโยบายความเป็นส่วนตัว</a>
              <a href="/terms" className="hover:text-white transition-colors">เงื่อนไขการใช้งาน</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
          }`}
        aria-label="กลับขึ้นด้านบน"
      >
        <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={selectedImage}
              alt="Full size"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}