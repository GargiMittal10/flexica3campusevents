# MySQL Database Setup Guide for Campus Events System

## 1. Install MySQL

### Windows
1. Download MySQL Installer from https://dev.mysql.com/downloads/installer/
2. Run installer and choose "Developer Default"
3. Set root password during installation
4. Complete installation

### MacOS
```bash
brew install mysql
brew services start mysql
mysql_secure_installation
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo mysql_secure_installation
```

---

## 2. Create Database

### Connect to MySQL
```bash
mysql -u root -p
# Enter your root password
```

### Create Database and User
```sql
-- Create database
CREATE DATABASE campus_events;

-- Create user (optional, for security)
CREATE USER 'campus_admin'@'localhost' IDENTIFIED BY 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON campus_events.* TO 'campus_admin'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- Verify
SHOW DATABASES;
USE campus_events;
```

---

## 3. Spring Boot Configuration

Update `src/main/resources/application.properties`:

```properties
# Server Configuration
server.port=8080
spring.application.name=Campus Events Management System

# MySQL Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/campus_events?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# JWT Configuration
jwt.secret=your-256-bit-secret-key-change-this-in-production
jwt.expiration=86400000

# CORS Configuration
cors.allowed-origins=http://localhost:5173,http://localhost:3000

# File Upload Configuration
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

---

## 4. Database Schema Creation

The Spring Boot application will automatically create tables based on your entities when you run it for the first time (due to `spring.jpa.hibernate.ddl-auto=update`).

However, if you want to create tables manually:

```sql
USE campus_events;

-- Users table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    student_id VARCHAR(50) NOT NULL UNIQUE,
    role ENUM('STUDENT', 'FACULTY', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
    qr_code_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_student_id (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Events table
CREATE TABLE events (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date TIMESTAMP NOT NULL,
    location VARCHAR(255),
    created_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_event_date (event_date),
    INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Event registrations table
CREATE TABLE event_registrations (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL,
    student_id VARCHAR(36) NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_registration (event_id, student_id),
    INDEX idx_event_id (event_id),
    INDEX idx_student_id (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Attendance table
CREATE TABLE attendance (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL,
    student_id VARCHAR(36) NOT NULL,
    qr_data TEXT NOT NULL,
    marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    marked_by VARCHAR(36) NOT NULL,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (marked_by) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_attendance (event_id, student_id),
    INDEX idx_event_attendance (event_id),
    INDEX idx_student_attendance (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Feedback table
CREATE TABLE feedback (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL,
    student_id VARCHAR(36) NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_feedback (event_id, student_id),
    INDEX idx_event_feedback (event_id),
    INDEX idx_student_feedback (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 5. Verify Tables

```sql
-- Show all tables
SHOW TABLES;

-- Describe table structure
DESCRIBE users;
DESCRIBE events;
DESCRIBE event_registrations;
DESCRIBE attendance;
DESCRIBE feedback;

-- Check table creation
SELECT 
    table_name, 
    table_rows, 
    create_time
FROM information_schema.tables
WHERE table_schema = 'campus_events';
```

---

## 6. Test Database Connection

### Using MySQL Command Line
```bash
mysql -u root -p campus_events
```

### Using MySQL Workbench
1. Open MySQL Workbench
2. Create new connection
3. Host: localhost
4. Port: 3306
5. Username: root (or campus_admin)
6. Test connection

---

## 7. Useful MySQL Commands

```sql
-- Show current database
SELECT DATABASE();

-- Show all tables
SHOW TABLES;

-- Show table structure
DESCRIBE table_name;

-- Count records in table
SELECT COUNT(*) FROM users;

-- View recent records
SELECT * FROM users ORDER BY created_at DESC LIMIT 10;

-- Delete all data (careful!)
TRUNCATE TABLE table_name;

-- Drop database (careful!)
DROP DATABASE campus_events;
```

---

## 8. Common MySQL Configuration Issues

### Issue: Access Denied
```sql
-- Reset user permissions
GRANT ALL PRIVILEGES ON campus_events.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### Issue: Connection Refused
```bash
# Check if MySQL is running
sudo systemctl status mysql  # Linux
brew services list           # MacOS

# Start MySQL
sudo systemctl start mysql   # Linux
brew services start mysql    # MacOS
```

### Issue: Unknown Database
```sql
-- Create database if not exists
CREATE DATABASE IF NOT EXISTS campus_events;
```

---

## 9. MySQL vs PostgreSQL Differences

| Feature | PostgreSQL | MySQL |
|---------|-----------|-------|
| JDBC URL | jdbc:postgresql://... | jdbc:mysql://... |
| Driver Class | org.postgresql.Driver | com.mysql.cj.jdbc.Driver |
| Hibernate Dialect | PostgreSQLDialect | MySQLDialect |
| UUID Type | UUID | VARCHAR(36) |
| Boolean Type | BOOLEAN | TINYINT(1) or BOOLEAN |
| Timestamp | TIMESTAMP WITH TIME ZONE | TIMESTAMP |

---

## 10. Performance Optimization

```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_event_date ON events(event_date);

-- Analyze tables
ANALYZE TABLE users;
ANALYZE TABLE events;

-- Check table status
SHOW TABLE STATUS FROM campus_events;
```

---

## 11. Backup and Restore

### Backup
```bash
mysqldump -u root -p campus_events > campus_events_backup.sql
```

### Restore
```bash
mysql -u root -p campus_events < campus_events_backup.sql
```

---

## 12. Connection Pooling (Optional)

Add to `application.properties` for better performance:

```properties
# HikariCP Connection Pool
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=20000
spring.datasource.hikari.idle-timeout=300000
spring.datasource.hikari.max-lifetime=1200000
```

---

## 13. Environment-Specific Configuration

### Development (application-dev.properties)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/campus_events_dev?useSSL=false
spring.jpa.show-sql=true
```

### Production (application-prod.properties)
```properties
spring.datasource.url=jdbc:mysql://production-host:3306/campus_events?useSSL=true
spring.jpa.show-sql=false
spring.jpa.hibernate.ddl-auto=validate
```

---

## Next Steps

1. ✅ Install MySQL
2. ✅ Create database and user
3. ✅ Configure Spring Boot application.properties
4. ✅ Run Spring Boot application (tables will be created automatically)
5. ✅ Test using Postman (see POSTMAN_COLLECTION.md)
6. ✅ Verify data in MySQL Workbench or command line
