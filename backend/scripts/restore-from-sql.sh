#!/bin/bash
# StarryMeet Database Restore Script
# Restores database from SQL or binary backup files

set -e # Exit on error

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 StarryMeet Database Restore Tool${NC}\n"

# Check if backup file is provided
if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: No backup file specified${NC}"
    echo -e "\nUsage: ./restore-from-sql.sh <backup-file>"
    echo -e "\nExamples:"
    echo -e "  ${GREEN}./restore-from-sql.sh backups/starrymeet_backup_20250121_101520.sql${NC}"
    echo -e "  ${GREEN}./restore-from-sql.sh backups/starrymeet_backup_20250121_101508.dump${NC}"
    echo -e "\nAvailable backups:"
    ls -lh backups/ 2>/dev/null || echo "  No backups found"
    exit 1
fi

BACKUP_FILE="$1"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}❌ Error: Backup file not found: $BACKUP_FILE${NC}"
    exit 1
fi

# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-starrymeet_dev}"
DB_USER="${DB_USER:-postgres}"
DB_PASS="${DB_PASSWORD}"

# Display configuration
echo -e "${YELLOW}📋 Restore Configuration:${NC}"
echo -e "  Database: ${GREEN}$DB_NAME${NC}"
echo -e "  Host: ${GREEN}$DB_HOST:$DB_PORT${NC}"
echo -e "  User: ${GREEN}$DB_USER${NC}"
echo -e "  Backup: ${GREEN}$BACKUP_FILE${NC}"
echo -e "  Size: ${GREEN}$(ls -lh $BACKUP_FILE | awk '{print $5}')${NC}\n"

# Warning
echo -e "${RED}⚠️  WARNING: This will DROP and recreate the database!${NC}"
echo -e "${RED}   All existing data in '$DB_NAME' will be LOST!${NC}\n"

# Confirmation
read -p "Are you sure you want to continue? (yes/no): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
    echo -e "${YELLOW}Restore cancelled.${NC}"
    exit 0
fi

echo ""

# Determine backup file type
if [[ "$BACKUP_FILE" == *.dump ]]; then
    echo -e "${BLUE}📥 Restoring from binary dump...${NC}\n"

    # Restore using pg_restore
    PGPASSWORD="$DB_PASS" pg_restore \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        -d "$DB_NAME" \
        --clean \
        --if-exists \
        --no-owner \
        --no-privileges \
        "$BACKUP_FILE"

elif [[ "$BACKUP_FILE" == *.sql ]]; then
    echo -e "${BLUE}📥 Restoring from SQL dump...${NC}\n"

    # Restore using psql
    PGPASSWORD="$DB_PASS" psql \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        -d "$DB_NAME" \
        < "$BACKUP_FILE"
else
    echo -e "${RED}❌ Error: Unknown backup file format${NC}"
    echo "Supported formats: .sql, .dump"
    exit 1
fi

# Check restore status
if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}✅ Database restored successfully!${NC}\n"

    # Display record counts
    echo -e "${BLUE}📊 Verifying restored data:${NC}"
    PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
        SELECT
            (SELECT COUNT(*) FROM users) as users,
            (SELECT COUNT(*) FROM celebrities) as celebrities,
            (SELECT COUNT(*) FROM bookings) as bookings,
            (SELECT COUNT(*) FROM payments) as payments,
            (SELECT COUNT(*) FROM reviews) as reviews;
    "

    echo -e "\n${GREEN}🎉 Restore completed!${NC}"
else
    echo -e "\n${RED}❌ Restore failed! Check the error messages above.${NC}"
    exit 1
fi
