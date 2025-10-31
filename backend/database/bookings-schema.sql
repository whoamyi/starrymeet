-- ===================================
-- STARRYMEET BOOKING SYSTEM SCHEMA
-- Phase 5: Backend Booking System
-- ===================================

-- ===================================
-- MEETING SLOTS TABLE
-- ===================================
CREATE TABLE IF NOT EXISTS meeting_slots (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    celebrity_id INT NOT NULL,
    type ENUM('physical', 'virtual') NOT NULL,
    location VARCHAR(255),
    address TEXT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    duration_minutes INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    slots_total INT DEFAULT 1,
    slots_available INT DEFAULT 1,
    details JSON,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (celebrity_id) REFERENCES celebrities_new(id) ON DELETE CASCADE,
    INDEX idx_celebrity (celebrity_id),
    INDEX idx_date (date),
    INDEX idx_active (active),
    INDEX idx_type (type)
);

-- ===================================
-- BOOKINGS TABLE
-- ===================================
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    booking_number VARCHAR(20) UNIQUE NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    celebrity_id INT NOT NULL,
    meeting_slot_id VARCHAR(36) NOT NULL,
    status ENUM(
        'pending_approval',
        'approved',
        'declined',
        'payment_pending',
        'payment_complete',
        'confirmed',
        'completed',
        'cancelled',
        'refunded'
    ) DEFAULT 'pending_approval',
    user_message TEXT,
    celebrity_message TEXT,
    meeting_date DATETIME,
    duration_minutes INT,
    price DECIMAL(10,2) NOT NULL,
    platform_fee DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_intent_id VARCHAR(255),
    payment_status ENUM('pending', 'held', 'captured', 'refunded') DEFAULT 'pending',
    nda_requested BOOLEAN DEFAULT FALSE,
    photo_permission BOOLEAN DEFAULT FALSE,
    concierge_assistance BOOLEAN DEFAULT FALSE,
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    approved_at TIMESTAMP NULL,
    confirmed_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    cancelled_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (celebrity_id) REFERENCES celebrities_new(id) ON DELETE RESTRICT,
    FOREIGN KEY (meeting_slot_id) REFERENCES meeting_slots(id) ON DELETE RESTRICT,
    INDEX idx_booking_number (booking_number),
    INDEX idx_user (user_id),
    INDEX idx_celebrity (celebrity_id),
    INDEX idx_status (status),
    INDEX idx_meeting_date (meeting_date),
    INDEX idx_created_at (created_at)
);

-- ===================================
-- REVIEWS TABLE
-- ===================================
CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    booking_id VARCHAR(36) NOT NULL UNIQUE,
    user_id VARCHAR(36) NOT NULL,
    celebrity_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    verified BOOLEAN DEFAULT TRUE,
    visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (celebrity_id) REFERENCES celebrities_new(id) ON DELETE CASCADE,
    INDEX idx_celebrity (celebrity_id),
    INDEX idx_visible (visible),
    INDEX idx_rating (rating)
);

-- ===================================
-- NOTIFICATIONS TABLE
-- ===================================
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link VARCHAR(255),
    read_status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_read (read_status),
    INDEX idx_created_at (created_at)
);

-- ===================================
-- ACTIVITY LOG TABLE
-- ===================================
CREATE TABLE IF NOT EXISTS activity_log (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36),
    booking_id VARCHAR(36),
    action VARCHAR(100) NOT NULL,
    details JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_booking (booking_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
);

-- ===================================
-- SAVED CELEBRITIES (Favorites)
-- ===================================
CREATE TABLE IF NOT EXISTS saved_celebrities (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    celebrity_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (celebrity_id) REFERENCES celebrities_new(id) ON DELETE CASCADE,
    UNIQUE KEY unique_save (user_id, celebrity_id),
    INDEX idx_user (user_id),
    INDEX idx_celebrity (celebrity_id)
);

-- ===================================
-- STORED PROCEDURE: Generate Booking Number
-- ===================================
DELIMITER $$
CREATE PROCEDURE IF NOT EXISTS generate_booking_number(OUT booking_num VARCHAR(20))
BEGIN
    DECLARE num_part VARCHAR(10);
    DECLARE done INT DEFAULT 0;

    REPEAT
        SET num_part = LPAD(FLOOR(RAND() * 10000000000), 10, '0');
        SET booking_num = CONCAT('SM', num_part);

        SELECT COUNT(*) INTO done FROM bookings WHERE booking_number = booking_num;
    UNTIL done = 0 END REPEAT;
END$$
DELIMITER ;

-- ===================================
-- TRIGGER: Auto-generate booking number
-- ===================================
DELIMITER $$
CREATE TRIGGER IF NOT EXISTS before_booking_insert
BEFORE INSERT ON bookings
FOR EACH ROW
BEGIN
    IF NEW.booking_number IS NULL OR NEW.booking_number = '' THEN
        CALL generate_booking_number(@new_booking_num);
        SET NEW.booking_number = @new_booking_num;
    END IF;
END$$
DELIMITER ;

-- ===================================
-- VIEW: User Dashboard Summary
-- ===================================
CREATE OR REPLACE VIEW user_dashboard_summary AS
SELECT
    u.id as user_id,
    COUNT(DISTINCT b.id) as total_bookings,
    COUNT(DISTINCT CASE WHEN b.status IN ('confirmed', 'completed') THEN b.id END) as confirmed_bookings,
    COUNT(DISTINCT CASE WHEN b.status = 'pending_approval' THEN b.id END) as pending_bookings,
    COUNT(DISTINCT CASE WHEN b.meeting_date > NOW() AND b.status = 'confirmed' THEN b.id END) as upcoming_bookings,
    COUNT(DISTINCT sc.celebrity_id) as saved_count,
    COUNT(DISTINCT CASE WHEN n.read_status = FALSE THEN n.id END) as unread_notifications
FROM users u
LEFT JOIN bookings b ON u.id = b.user_id
LEFT JOIN saved_celebrities sc ON u.id = sc.user_id
LEFT JOIN notifications n ON u.id = n.user_id
GROUP BY u.id;
