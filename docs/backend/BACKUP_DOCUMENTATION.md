# 💾 StarryMeet Database Backup Documentation

**Created**: January 21, 2025
**Database**: starrymeet_dev
**Total Records**: 21,583

---

## 📊 Backup Summary

### Current Database State
```
Users:         3
Celebrities:   21,580
Bookings:      0
Payments:      0
Reviews:       0
─────────────────────
Total:         21,583 records
```

### Backup Files Created

#### 1. Binary Dump (Compressed, Fastest Restore)
```
File: backups/starrymeet_backup_YYYYMMDD_HHMMSS.dump
Size: ~2.0 MB
Format: PostgreSQL custom format
Use: Production restores, migrations
```

#### 2. SQL Text Dump (Human-readable)
```
File: backups/starrymeet_backup_YYYYMMDD_HHMMSS.sql
Size: ~11 MB
Format: Plain SQL
Use: Review changes, manual edits, version control
```

#### 3. Schema Only (Structure)
```
File: backups/schema_only_YYYYMMDD_HHMMSS.sql
Size: ~18 KB
Format: Plain SQL (DDL only)
Use: Create empty database with same structure
```

#### 4. JSON Export (Portable)
```
Directory: backups/json_export_YYYY-MM-DD_HH-MM-SS/
Files:
  - users.json         (3 records)
  - celebrities.json   (21,580 records)
  - bookings.json      (0 records)
  - payments.json      (0 records)
  - reviews.json       (0 records)
  - metadata.json      (backup info)
Format: JSON
Use: Data migration, cross-database import, data analysis
```

---

## 🔄 How to Restore

### Option 1: Restore from Binary Dump (Recommended)

**Fastest and most reliable method**

```bash
# Navigate to backend directory
cd backend

# Restore using the script
./scripts/restore-from-sql.sh backups/starrymeet_backup_YYYYMMDD_HHMMSS.dump

# Or manually:
PGPASSWORD='your_password' pg_restore \
  -h localhost \
  -U postgres \
  -d starrymeet_dev \
  --clean \
  --if-exists \
  backups/starrymeet_backup_YYYYMMDD_HHMMSS.dump
```

### Option 2: Restore from SQL Dump

**Human-readable, can edit before restore**

```bash
# Using the script
./scripts/restore-from-sql.sh backups/starrymeet_backup_YYYYMMDD_HHMMSS.sql

# Or manually:
PGPASSWORD='your_password' psql \
  -h localhost \
  -U postgres \
  -d starrymeet_dev \
  < backups/starrymeet_backup_YYYYMMDD_HHMMSS.sql
```

### Option 3: Restore from JSON Export

**Most portable, works across different PostgreSQL versions**

```bash
# 1. Build TypeScript files
npm run build

# 2. Restore data
npm run restore-json backups/json_export_YYYY-MM-DD_HH-MM-SS

# Or using ts-node:
npx ts-node scripts/restore-from-json.ts backups/json_export_YYYY-MM-DD_HH-MM-SS
```

### Option 4: Restore to Neon (Cloud Migration)

```bash
# Replace with your Neon connection string
psql "postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require" \
  < backups/starrymeet_backup_YYYYMMDD_HHMMSS.sql
```

---

## 🚨 Important Notes

### Before Restoring
1. ⚠️ **BACKUP CURRENT DATA** if the target database has any data you want to keep
2. ⚠️ **The restore will DROP existing tables** (uses `--clean` flag)
3. ⚠️ **Stop the application** to prevent connection errors during restore
4. ⚠️ **Verify connection details** in `.env` file

### After Restoring
1. ✅ **Verify record counts** match the backup
2. ✅ **Test application login** and basic functionality
3. ✅ **Check database logs** for any errors
4. ✅ **Restart the application**

---

## 📝 Backup Scripts Available

### Create New Backups

```bash
# Full SQL backup
PGPASSWORD='your_password' pg_dump \
  -h localhost \
  -U postgres \
  -d starrymeet_dev \
  > backups/backup_$(date +%Y%m%d_%H%M%S).sql

# Binary backup (compressed)
PGPASSWORD='your_password' pg_dump \
  -h localhost \
  -U postgres \
  -d starrymeet_dev \
  -F c \
  -f backups/backup_$(date +%Y%m%d_%H%M%S).dump

# JSON export
npm run export-json
```

### Add to package.json

```json
{
  "scripts": {
    "export-json": "ts-node scripts/export-data-json.ts",
    "restore-json": "ts-node scripts/restore-from-json.ts"
  }
}
```

---

## 🔐 Security Considerations

### ✅ DO:
- Store backups in **secure, encrypted** locations
- Keep backups **outside the git repository**
- Use **strong passwords** for backup encryption
- **Test restores regularly** to ensure backups work
- Keep **multiple generations** of backups (daily, weekly, monthly)
- Store backups in **multiple locations** (local + cloud)

### ❌ DON'T:
- Don't commit backups to git (`.gitignore` is configured)
- Don't store backups on public servers
- Don't share backup files in unsecured channels
- Don't rely on a single backup location

---

## 📅 Backup Schedule (Recommended)

### Development
- **Before major changes**: Create backup
- **Before migrations**: Create backup
- **Weekly**: Automated backup

### Production
- **Daily**: Full database backup (keep 7 days)
- **Weekly**: Full database backup (keep 4 weeks)
- **Monthly**: Full database backup (keep 12 months)
- **Before deployments**: Manual backup

---

## 🎯 Quick Reference

### Verify Backup Integrity

```bash
# Check SQL backup can be parsed
head -100 backups/backup_file.sql

# Check binary dump info
pg_restore -l backups/backup_file.dump | head -20

# Check JSON export
cat backups/json_export_*/metadata.json
```

### Find Latest Backup

```bash
# Latest SQL backup
ls -t backups/*.sql | head -1

# Latest binary backup
ls -t backups/*.dump | head -1

# Latest JSON export
ls -td backups/json_export_* | head -1
```

### Backup Size Check

```bash
# All backups
du -sh backups/

# Individual backups
ls -lh backups/
```

---

## 🔧 Troubleshooting

### "permission denied" Error
```bash
# Make restore script executable
chmod +x scripts/restore-from-sql.sh
```

### "database does not exist" Error
```bash
# Create database first
createdb -h localhost -U postgres starrymeet_dev
```

### "role does not exist" Error
```bash
# Use --no-owner flag
pg_restore --no-owner backups/backup.dump
```

### Large Backup Takes Too Long
```bash
# Use binary format (faster)
pg_dump -F c -f backup.dump starrymeet_dev

# Restore with more workers (parallel)
pg_restore -j 4 backup.dump  # 4 parallel jobs
```

---

## 📞 Emergency Recovery

If you need to recover from a disaster:

1. **Stop panic** - You have backups! ✅
2. **Identify latest good backup** from `backups/` directory
3. **Create fresh database** (if needed)
4. **Run restore script**: `./scripts/restore-from-sql.sh backups/latest_backup.dump`
5. **Verify data** with record counts
6. **Test application** functionality
7. **Document what went wrong** to prevent future issues

---

## 🎉 Summary

You now have **FOUR types of backups**:

1. ✅ Binary dump (fastest restore)
2. ✅ SQL dump (human-readable)
3. ✅ Schema only (structure)
4. ✅ JSON export (most portable)

**All backups are located in**: `backend/backups/`

**Total backup size**: ~13 MB (compressed)

**Restoration time**: < 2 minutes for full restore

Your data is **safe and ready for migration** to Neon! 🚀

---

**Last Updated**: January 21, 2025
**Next Recommended Backup**: Before Neon migration
