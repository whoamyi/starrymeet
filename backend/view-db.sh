#!/bin/bash
# Database Query Helper Script for StarryMeet
# Usage: ./view-db.sh [users|bookings|celebrities|all]

DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="starrymeet_dev"
DB_USER="postgres"
DB_PASS="Abuelo115@"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to run psql query
query() {
    PGPASSWORD="${DB_PASS}" psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" -c "$1"
}

case "${1:-all}" in
    users)
        echo -e "${GREEN}=== USERS ===${NC}"
        query "SELECT id, email, first_name, last_name, role, email_verified, created_at FROM users ORDER BY created_at DESC LIMIT 20;"
        ;;

    bookings)
        echo -e "${GREEN}=== BOOKINGS ===${NC}"
        query "SELECT b.id, u.email as user_email, c.name as celebrity_name, b.booking_date, b.time_slot, b.status, (b.total_cents/100.0) as total_price, b.created_at FROM bookings b LEFT JOIN users u ON b.user_id = u.id LEFT JOIN celebrities c ON b.celebrity_id = c.id ORDER BY b.created_at DESC LIMIT 20;"
        ;;

    celebrities)
        echo -e "${GREEN}=== CELEBRITIES ===${NC}"
        query "SELECT id, name, category, price, rating, is_available, created_at FROM celebrities ORDER BY name LIMIT 20;"
        ;;

    stats)
        echo -e "${GREEN}=== DATABASE STATISTICS ===${NC}"
        echo -e "${BLUE}Users:${NC}"
        query "SELECT COUNT(*) as total_users, COUNT(*) FILTER (WHERE role='user') as regular_users, COUNT(*) FILTER (WHERE role='celebrity') as celebrities_count FROM users;"

        echo -e "\n${BLUE}Bookings:${NC}"
        query "SELECT COUNT(*) as total_bookings, COUNT(*) FILTER (WHERE status='pending') as pending, COUNT(*) FILTER (WHERE status='confirmed') as confirmed, COUNT(*) FILTER (WHERE status='completed') as completed FROM bookings;"

        echo -e "\n${BLUE}Revenue:${NC}"
        query "SELECT (SUM(total_cents)/100.0) as total_revenue, COUNT(*) as paid_bookings FROM bookings WHERE status IN ('confirmed', 'completed');"
        ;;

    all|*)
        echo -e "${YELLOW}=== RECENT USERS (Last 10) ===${NC}"
        query "SELECT id, email, first_name, last_name, role, created_at FROM users ORDER BY created_at DESC LIMIT 10;"

        echo -e "\n${YELLOW}=== RECENT BOOKINGS (Last 10) ===${NC}"
        query "SELECT b.id, u.email as user, c.name as celebrity, b.booking_date, b.status, (b.total_cents/100.0) as total FROM bookings b LEFT JOIN users u ON b.user_id = u.id LEFT JOIN celebrities c ON b.celebrity_id = c.id ORDER BY b.created_at DESC LIMIT 10;"

        echo -e "\n${YELLOW}=== QUICK STATS ===${NC}"
        query "SELECT (SELECT COUNT(*) FROM users) as total_users, (SELECT COUNT(*) FROM bookings) as total_bookings, (SELECT COUNT(*) FROM celebrities) as total_celebrities;"
        ;;
esac

echo -e "\n${GREEN}Available commands:${NC}"
echo "  ./view-db.sh users      - View all users"
echo "  ./view-db.sh bookings   - View all bookings"
echo "  ./view-db.sh celebrities - View all celebrities"
echo "  ./view-db.sh stats      - View statistics"
echo "  ./view-db.sh all        - View everything (default)"
