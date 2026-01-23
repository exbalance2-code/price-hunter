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

    // Load settings
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
        } catch (err) {
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
                setMessage('✅ บันทึกการตั้งค่าสำเร็จ');
                setTimeout(() => setMessage(''), 3000);
            } else {
                setError('❌ ไม่สามารถบันทึกได้');
            }
        } catch (err) {
            setError('❌ เกิดข้อผิดพลาด');
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
                setMessage(`✅ เปลี่ยนข้อมูลสำเร็จ${data.newUsername ? ` (Username: ${data.newUsername})` : ''}`);
                setCredentials({
                    currentPassword: '',
                    newUsername: '',
                    newPassword: '',
                    confirmPassword: '',
                });
                setTimeout(() => setMessage(''), 5000);
            } else {
                setError(`❌ ${data.error || 'ไม่สามารถเปลี่ยนได้'}`);
            }
        } catch (err) {
            setError('❌ เกิดข้อผิดพลาด');
        } finally {
            setSaving(false);
        }
    };

    const togglePassword = (field: string) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">กำลังโหลด...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">⚙️ การตั้งค่าระบบ</h1>
                        <p className="text-blue-200">จัดการ API Keys, Database และข้อมูล Admin</p>
                    </div>
                    <Link
                        href="/admin"
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                    >
                        ← กลับ Dashboard
                    </Link>
                </div>

                {/* Messages */}
                {message && (
                    <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    {/* LINE Bot Configuration */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                        <h2 className="text-xl font-bold text-white mb-4">📱 LINE Bot Configuration</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-blue-200 mb-2">
                                    Channel Access Token
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.line_token ? 'text' : 'password'}
                                        value={settings.line_channel_access_token}
                                        onChange={(e) => setSettings({ ...settings, line_channel_access_token: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        onClick={() => togglePassword('line_token')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white"
                                    >
                                        {showPasswords.line_token ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-blue-200 mb-2">
                                    Channel Secret
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.line_secret ? 'text' : 'password'}
                                        value={settings.line_channel_secret}
                                        onChange={(e) => setSettings({ ...settings, line_channel_secret: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        onClick={() => togglePassword('line_secret')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white"
                                    >
                                        {showPasswords.line_secret ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shopee Configuration */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                        <h2 className="text-xl font-bold text-white mb-4">🛒 Shopee Configuration</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-blue-200 mb-2">
                                    App ID
                                </label>
                                <input
                                    type="text"
                                    value={settings.shopee_app_id}
                                    onChange={(e) => setSettings({ ...settings, shopee_app_id: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter Shopee App ID"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-blue-200 mb-2">
                                    API Secret
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.shopee_secret ? 'text' : 'password'}
                                        value={settings.shopee_api_secret}
                                        onChange={(e) => setSettings({ ...settings, shopee_api_secret: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        onClick={() => togglePassword('shopee_secret')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white"
                                    >
                                        {showPasswords.shopee_secret ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lazada Configuration */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                        <h2 className="text-xl font-bold text-white mb-4">🛍️ Lazada Configuration</h2>
                        <div>
                            <label className="block text-sm font-medium text-blue-200 mb-2">
                                Affiliate Key
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.lazada ? 'text' : 'password'}
                                    value={settings.lazada_affiliate_key}
                                    onChange={(e) => setSettings({ ...settings, lazada_affiliate_key: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="••••••••"
                                />
                                <button
                                    onClick={() => togglePassword('lazada')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white"
                                >
                                    {showPasswords.lazada ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-blue-200 mb-2">
                                    App Key
                                </label>
                                <input
                                    type="text"
                                    value={settings.lazada_app_key}
                                    onChange={(e) => setSettings({ ...settings, lazada_app_key: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter Lazada App Key"
                                />
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-blue-200 mb-2">
                                    App Secret
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.lazada_secret ? 'text' : 'password'}
                                        value={settings.lazada_app_secret}
                                        onChange={(e) => setSettings({ ...settings, lazada_app_secret: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        onClick={() => togglePassword('lazada_secret')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white"
                                    >
                                        {showPasswords.lazada_secret ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-blue-200 mb-2">
                                    Access Token (User Token)
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.lazada_token ? 'text' : 'password'}
                                        value={settings.lazada_access_token}
                                        onChange={(e) => setSettings({ ...settings, lazada_access_token: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter Lazada Access Token"
                                    />
                                    <button
                                        onClick={() => togglePassword('lazada_token')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white"
                                    >
                                        {showPasswords.lazada_token ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Passio Configuration */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                        <h2 className="text-xl font-bold text-white mb-4">🔌 Passio / Ecomobi Configuration</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-blue-200 mb-2">
                                    API Token
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.passio ? 'text' : 'password'}
                                        value={settings.passio_api_token}
                                        onChange={(e) => setSettings({ ...settings, passio_api_token: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                                        placeholder="Enter your Passio API Token"
                                    />
                                    <button
                                        onClick={() => togglePassword('passio')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white"
                                    >
                                        {showPasswords.passio ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-200 mb-2">
                                    API URL (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={settings.passio_api_url}
                                    onChange={(e) => setSettings({ ...settings, passio_api_url: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                                    placeholder="https://ga.passio.eco/api/v3"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Database Configuration */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                        <h2 className="text-xl font-bold text-white mb-4">💾 Database Configuration</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-blue-200 mb-2">Host</label>
                                <input
                                    type="text"
                                    value={settings.mysql_host}
                                    onChange={(e) => setSettings({ ...settings, mysql_host: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="localhost"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-blue-200 mb-2">Database</label>
                                <input
                                    type="text"
                                    value={settings.mysql_database}
                                    onChange={(e) => setSettings({ ...settings, mysql_database: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="price_hunter"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-blue-200 mb-2">User</label>
                                <input
                                    type="text"
                                    value={settings.mysql_user}
                                    onChange={(e) => setSettings({ ...settings, mysql_user: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="root"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-blue-200 mb-2">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.mysql ? 'text' : 'password'}
                                        value={settings.mysql_password}
                                        onChange={(e) => setSettings({ ...settings, mysql_password: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        onClick={() => togglePassword('mysql')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white"
                                    >
                                        {showPasswords.mysql ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Save Settings Button */}
                    <button
                        onClick={handleSaveSettings}
                        disabled={saving}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? 'กำลังบันทึก...' : '💾 บันทึกการตั้งค่า'}
                    </button>

                    {/* Admin Credentials */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                        <h2 className="text-xl font-bold text-white mb-4">👤 เปลี่ยนข้อมูล Admin</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-blue-200 mb-2">
                                    รหัสผ่านปัจจุบัน *
                                </label>
                                <input
                                    type="password"
                                    value={credentials.currentPassword}
                                    onChange={(e) => setCredentials({ ...credentials, currentPassword: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-blue-200 mb-2">
                                    Username ใหม่ (ถ้าต้องการเปลี่ยน)
                                </label>
                                <input
                                    type="text"
                                    value={credentials.newUsername}
                                    onChange={(e) => setCredentials({ ...credentials, newUsername: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="admin"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-blue-200 mb-2">
                                    รหัสผ่านใหม่ (ถ้าต้องการเปลี่ยน)
                                </label>
                                <input
                                    type="password"
                                    value={credentials.newPassword}
                                    onChange={(e) => setCredentials({ ...credentials, newPassword: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="••••••••"
                                />
                                <p className="text-xs text-blue-300 mt-1">
                                    ต้องมีอย่างน้อย 8 ตัวอักษร, ตัวพิมพ์ใหญ่, ตัวพิมพ์เล็ก และตัวเลข
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-blue-200 mb-2">
                                    ยืนยันรหัสผ่านใหม่
                                </label>
                                <input
                                    type="password"
                                    value={credentials.confirmPassword}
                                    onChange={(e) => setCredentials({ ...credentials, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                onClick={handleChangeCredentials}
                                disabled={saving || !credentials.currentPassword}
                                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? 'กำลังเปลี่ยน...' : '🔐 เปลี่ยนข้อมูล Admin'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
