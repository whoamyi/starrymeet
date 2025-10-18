#!/bin/bash

# StarryMeet Database Setup Script
# This script creates the PostgreSQL database for StarryMeet

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  StarryMeet Database Setup${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo -e "${GREEN}✓${NC} Loaded environment variables from .env"
else
    echo -e "${RED}✗${NC} .env file not found!"
    exit 1
fi

# Database configuration
DB_NAME="${DB_NAME:-starrymeet_dev}"
DB_USER="${DB_USER:-postgres}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"

echo ""
echo -e "${YELLOW}Database Configuration:${NC}"
echo -e "  Host: ${DB_HOST}:${DB_PORT}"
echo -e "  Database: ${DB_NAME}"
echo -e "  User: ${DB_USER}"
echo ""

# Check if PostgreSQL is running
if ! command -v psql &> /dev/null; then
    echo -e "${RED}✗${NC} PostgreSQL client (psql) is not installed!"
    echo -e "  Install with: sudo apt install postgresql postgresql-contrib"
    exit 1
fi

echo -e "${GREEN}✓${NC} PostgreSQL client found"

# Function to run psql command
run_psql() {
    PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d postgres "$@"
}

# Check if we can connect to PostgreSQL
echo ""
echo -e "${YELLOW}Testing PostgreSQL connection...${NC}"
if ! PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d postgres -c "SELECT 1" > /dev/null 2>&1; then
    echo -e "${RED}✗${NC} Cannot connect to PostgreSQL!"
    echo ""
    echo -e "${YELLOW}Please ensure:${NC}"
    echo -e "  1. PostgreSQL is running: sudo systemctl start postgresql"
    echo -e "  2. Your DB_PASSWORD in .env is correct"
    echo -e "  3. PostgreSQL is configured to accept password authentication"
    echo ""
    echo -e "${YELLOW}To set up PostgreSQL authentication:${NC}"
    echo -e "  sudo -u postgres psql"
    echo -e "  ALTER USER postgres PASSWORD 'your_password';"
    echo -e "  \\q"
    echo ""
    exit 1
fi

echo -e "${GREEN}✓${NC} Successfully connected to PostgreSQL"

# Check if database exists
echo ""
echo -e "${YELLOW}Checking if database '${DB_NAME}' exists...${NC}"
if run_psql -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1; then
    echo -e "${YELLOW}⚠${NC} Database '${DB_NAME}' already exists"
    read -p "Do you want to drop and recreate it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Dropping database...${NC}"
        run_psql -c "DROP DATABASE IF EXISTS ${DB_NAME};"
        echo -e "${GREEN}✓${NC} Database dropped"
    else
        echo -e "${YELLOW}Skipping database creation${NC}"
        exit 0
    fi
fi

# Create database
echo -e "${YELLOW}Creating database '${DB_NAME}'...${NC}"
run_psql -c "CREATE DATABASE ${DB_NAME};"
echo -e "${GREEN}✓${NC} Database '${DB_NAME}' created successfully"

# Grant privileges
echo -e "${YELLOW}Granting privileges...${NC}"
run_psql -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};"
echo -e "${GREEN}✓${NC} Privileges granted"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Database setup complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo -e "  1. Run: npm run dev"
echo -e "  2. The server will automatically sync database tables"
echo ""
