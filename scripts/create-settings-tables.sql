-- ตาราง system_settings: เก็บการตั้งค่าระบบ
CREATE TABLE IF NOT EXISTS system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    is_encrypted BOOLEAN DEFAULT TRUE,
    updated_by VARCHAR(50),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_setting_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ตาราง audit_logs: บันทึกการเปลี่ยนแปลง
CREATE TABLE IF NOT EXISTS audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    action VARCHAR(50) NOT NULL,
    setting_key VARCHAR(100),
    old_value TEXT,
    new_value TEXT,
    changed_by VARCHAR(50) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_changed_at (changed_at),
    INDEX idx_setting_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ตาราง admin_users: เก็บข้อมูล Admin (ใหม่)
CREATE TABLE IF NOT EXISTS admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin (password: admin123)
-- Note: ควรเปลี่ยนรหัสผ่านทันทีหลัง deploy
INSERT INTO admin_users (username, password_hash) 
VALUES ('admin', '$2a$10$rOZJQqVJ5J5y5y5y5y5y5uO5y5y5y5y5y5y5y5y5y5y5y5y5y5y5y')
ON DUPLICATE KEY UPDATE username=username;
