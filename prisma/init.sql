-- Create search_logs table
CREATE TABLE IF NOT EXISTS search_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  search_query VARCHAR(255) NOT NULL,
  results_count INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_search_query (search_query),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create click_logs table
CREATE TABLE IF NOT EXISTS click_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(500) NOT NULL,
  product_price DECIMAL(10, 2) NOT NULL,
  platform ENUM('shopee', 'lazada') NOT NULL,
  search_query VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_platform (platform),
  INDEX idx_search_query (search_query),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
