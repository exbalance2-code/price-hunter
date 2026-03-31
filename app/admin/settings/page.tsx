'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Settings {
    line_channel_access_token: string;
    line_channel_secret: string;
    shopee_affiliate_key: string;
    shopee_app_id: string;
    shopee_api_secret: string;
    lazada_affiliate_key: string;
    lazada_app_key: string;
    lazada_app_secret: string;
    lazada_access_token: string;
    mysql_host: string;
    mysql_user: string;
    mysql_password: string;
    mysql_database: string;
    passio_api_token: string;
    passio_api_url: string;
}

interface SettingField {
    key: keyof Settings;
    label: string;
    type: 'text' | 'password';
    placeholder: string;
    passwordKey?: string;
    mono?: boolean;
}

interface SettingSection {
    title: string;
    icon: string;
    color: string;
    fields: SettingField[];
    grid?: boolean;
}

export default function AdminSettings() {
    const [settings, setSettings] = useState<Settings>({
        line_channel_access_token: '',
        line_channel_secret: '',
        shopee_affiliate_key: '',
        shopee_app_id: '',
        shopee_api_secret: '',
        lazada_affiliate_key: '',
        lazada_app_key: '',
        lazada_app_secret: '',
        lazada_access_token: '',
        mysql_host: '',
        mysql_user: '',
        mysql_password: '',
        mysql_database: '',
        passio_api_token: '',
        passio_api_url: '',
    });

    const [credentials, setCredentials] = useState({
        currentPassword: '',
        newUsername: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/settings');
            if (response.ok) {
                const data = await response.json();
                setSettings(data.settings);
            }
        } catch {
            setError('ไม่สามารถโหลดการตั้งค่าได้');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSettings = async () => {
        setSaving(true);
        setError('');
        setMessage('');

        try {
            const response = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ settings }),
            });

            if (response.ok) {
                setMessage('บันทึกการตั้งค่าสำเร็จ');
                setTimeout(() => setMessage(''), 3000);
            } else {
                setError('ไม่สามารถบันทึกได้');
            }
        } catch {
            setError('เกิดข้อผิดพลาด');
        } finally {
            setSaving(false);
        }
    };

    const handleChangeCredentials = async () => {
        if (credentials.newPassword && credentials.newPassword !== credentials.confirmPassword) {
            setError('รหัสผ่านไม่ตรงกัน');
            return;
        }

        setSaving(true);
        setError('');
        setMessage('');

        try {
            const response = await fetch('/api/admin/credentials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(`เปลี่ยนข้อมูลสำเร็จ${data.newUsername ? ` (Username: ${data.newUsername})` : ''}`);
                setCredentials({ currentPassword: '', newUsername: '', newPassword: '', confirmPassword: '' });
                setTimeout(() => setMessage(''), 5000);
            } else {
                setError(data.error || 'ไม่สามารถเปลี่ยนได้');
            }
        } catch {
            setError('เกิดข้อผิดพลาด');
        } finally {
            setSaving(false);
        }
    };

    const togglePassword = (field: string) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const sections: SettingSection[] = [
        {
            title: 'LINE Bot Configuration',
            icon: '📱',
            color: 'from-green-500 to-emerald-500',
            fields: [
                { key: 'line_channel_access_token', label: 'Channel Access Token', type: 'password', placeholder: '••••••••', passwordKey: 'line_token' },
                { key: 'line_channel_secret', label: 'Channel Secret', type: 'password', placeholder: '••••••••', passwordKey: 'line_secret' },
            ],
        },
        {
            title: 'Shopee Configuration',
            icon: '🛒',
            color: 'from-orange-500 to-red-500',
            fields: [
                { key: 'shopee_app_id', label: 'App ID', type: 'text', placeholder: 'Enter Shopee App ID' },
                { key: 'shopee_api_secret', label: 'API Secret', type: 'password', placeholder: '••••••••', passwordKey: 'shopee_secret' },
                { key: 'shopee_affiliate_key', label: 'Affiliate Key', type: 'password', placeholder: '••••••••', passwordKey: 'shopee_affiliate' },
            ],
        },
        {
            title: 'Lazada Configuration',
            icon: '🛍️',
            color: 'from-blue-500 to-indigo-500',
            fields: [
                { key: 'lazada_affiliate_key', label: 'Affiliate Key', type: 'password', placeholder: '••••••••', passwordKey: 'lazada' },
                { key: 'lazada_app_key', label: 'App Key', type: 'text', placeholder: 'Enter Lazada App Key' },
                { key: 'lazada_app_secret', label: 'App Secret', type: 'password', placeholder: '••••••••', passwordKey: 'lazada_secret' },
                { key: 'lazada_access_token', label: 'Access Token', type: 'password', placeholder: 'Enter Lazada Access Token', passwordKey: 'lazada_token' },
            ],
        },
        {
            title: 'Passio / Ecomobi',
            icon: '🔌',
            color: 'from-purple-500 to-violet-500',
            fields: [
                { key: 'passio_api_token', label: 'API Token', type: 'password', placeholder: 'Enter your Passio API Token', passwordKey: 'passio', mono: true },
                { key: 'passio_api_url', label: 'API URL (Optional)', type: 'text', placeholder: 'https://ga.passio.eco/api/v3', mono: true },
            ],
        },
        {
            title: 'Database Configuration',
            icon: '💾',
            color: 'from-cyan-500 to-blue-500',
            grid: true,
            fields: [
                { key: 'mysql_host', label: 'Host', type: 'text', placeholder: 'localhost' },
                { key: 'mysql_database', label: 'Database', type: 'text', placeholder: 'price_hunter' },
                { key: 'mysql_user', label: 'User', type: 'text', placeholder: 'root' },
                { key: 'mysql_password', label: 'Password', type: 'password', placeholder: '••••••••', passwordKey: 'mysql' },
            ],
        },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white/60 text-sm">กำลังโหลดการตั้งค่า...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 relative">
            <div className="absolute inset-0 grid-pattern" />
            <div className="floating-orb w-[400px] h-[400px] bg-blue-600/15 top-[-100px] right-[-100px]" />
            <div className="floating-orb w-[300px] h-[300px] bg-purple-600/10 bottom-[20%] left-[-100px]" />

            <div className="relative z-10 p-4 lg:p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-extrabold text-white mb-1">การตั้งค่าระบบ</h1>
                            <p className="text-white/40 text-sm">จัดการ API Keys, Database และข้อมูล Admin</p>
                        </div>
                        <Link
                            href="/admin"
                            className="glass-card px-4 py-2.5 text-white text-sm font-medium hover:bg-white/10 transition-all flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            กลับ Dashboard
                        </Link>
                    </div>

                    {/* Messages */}
                    {message && (
                        <div className="mb-6 glass-card p-4 bg-emerald-500/10 border-emerald-500/20 flex items-center gap-3">
                            <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-emerald-300 text-sm font-medium">{message}</span>
                        </div>
                    )}
                    {error && (
                        <div className="mb-6 glass-card p-4 bg-red-500/10 border-red-500/20 flex items-center gap-3">
                            <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-red-300 text-sm font-medium">{error}</span>
                        </div>
                    )}

                    <div className="space-y-5">
                        {/* Dynamic Sections */}
                        {sections.map((section, sIndex) => (
                            <div key={sIndex} className="glass-card p-6">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className={`w-10 h-10 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center text-lg shadow-lg`}>
                                        {section.icon}
                                    </div>
                                    <h2 className="text-lg font-bold text-white">{section.title}</h2>
                                </div>
                                <div className={section.grid ? 'grid md:grid-cols-2 gap-4' : 'space-y-4'}>
                                    {section.fields.map((field) => (
                                        <div key={field.key}>
                                            <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wide">
                                                {field.label}
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={field.passwordKey && !showPasswords[field.passwordKey] ? 'password' : 'text'}
                                                    value={settings[field.key]}
                                                    onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                                                    className={`w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm ${field.mono ? 'font-mono' : ''}`}
                                                    placeholder={field.placeholder}
                                                />
                                                {field.passwordKey && (
                                                    <button
                                                        onClick={() => togglePassword(field.passwordKey!)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                                                    >
                                                        {showPasswords[field.passwordKey] ? (
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Save Settings Button */}
                        <button
                            onClick={handleSaveSettings}
                            disabled={saving}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 text-sm"
                        >
                            {saving ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    กำลังบันทึก...
                                </span>
                            ) : (
                                '💾 บันทึกการตั้งค่า'
                            )}
                        </button>

                        {/* Admin Credentials */}
                        <div className="glass-card p-6">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-lg shadow-lg">
                                    👤
                                </div>
                                <h2 className="text-lg font-bold text-white">เปลี่ยนข้อมูล Admin</h2>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wide">
                                        รหัสผ่านปัจจุบัน <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={credentials.currentPassword}
                                        onChange={(e) => setCredentials({ ...credentials, currentPassword: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wide">
                                        Username ใหม่ (ถ้าต้องการเปลี่ยน)
                                    </label>
                                    <input
                                        type="text"
                                        value={credentials.newUsername}
                                        onChange={(e) => setCredentials({ ...credentials, newUsername: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm"
                                        placeholder="admin"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wide">
                                            รหัสผ่านใหม่
                                        </label>
                                        <input
                                            type="password"
                                            value={credentials.newPassword}
                                            onChange={(e) => setCredentials({ ...credentials, newPassword: e.target.value })}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm"
                                            placeholder="••••••••"
                                        />
                                        <p className="text-[10px] text-white/30 mt-1.5">
                                            อย่างน้อย 8 ตัวอักษร, ตัวพิมพ์ใหญ่, ตัวพิมพ์เล็ก และตัวเลข
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wide">
                                            ยืนยันรหัสผ่านใหม่
                                        </label>
                                        <input
                                            type="password"
                                            value={credentials.confirmPassword}
                                            onChange={(e) => setCredentials({ ...credentials, confirmPassword: e.target.value })}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleChangeCredentials}
                                    disabled={saving || !credentials.currentPassword}
                                    className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold py-3.5 rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 text-sm"
                                >
                                    {saving ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            กำลังเปลี่ยน...
                                        </span>
                                    ) : (
                                        '🔐 เปลี่ยนข้อมูล Admin'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
