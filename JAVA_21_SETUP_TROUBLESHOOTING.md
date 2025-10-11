# Java 21 Setup and Troubleshooting Guide

## Quick Start with Java 21

### Step 1: Install Java 21
```bash
# Verify Java version
java -version
# Should show: openjdk version "21.x.x"

# If not installed:
# Download from: https://adoptium.net/temurin/releases/?version=21
```

### Step 2: Set JAVA_HOME Environment Variable

#### Windows:
```cmd
# Set system environment variable
setx JAVA_HOME "C:\Program Files\Eclipse Adoptium\jdk-21.x.x"
setx PATH "%JAVA_HOME%\bin;%PATH%"

# Verify
echo %JAVA_HOME%
java -version
```

#### macOS/Linux:
```bash
# Add to ~/.bash_profile or ~/.zshrc
export JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home
export PATH=$JAVA_HOME/bin:$PATH

# Reload
source ~/.bash_profile
# or
source ~/.zshrc

# Verify
echo $JAVA_HOME
java -version
```

### Step 3: Configure Maven for Java 21

Create or update `~/.m2/settings.xml`:
```xml
<settings>
  <profiles>
    <profile>
      <id>java-21</id>
      <activation>
        <activeByDefault>true</activeByDefault>
      </activation>
      <properties>
        <maven.compiler.source>21</maven.compiler.source>
        <maven.compiler.target>21</maven.compiler.target>
        <maven.compiler.release>21</maven.compiler.release>
      </properties>
    </profile>
  </profiles>
</settings>
```

## Common Errors and Solutions

### Error 1: "Invalid target release: 21"
**Cause**: Maven is using an older Java version

**Solution**:
```bash
# Check Maven is using correct Java
mvn -version
# Should show Java version 21.x.x

# If not, set JAVA_HOME correctly
export JAVA_HOME=/path/to/jdk-21
mvn -version
```

### Error 2: "Source option 21 is no longer supported"
**Cause**: IDE using wrong Java version

**Solution for IntelliJ IDEA**:
1. File → Project Structure → Project → SDK: Select Java 21
2. File → Project Structure → Project → Language Level: Select "21 - Record patterns, pattern matching for switch"
3. File → Settings → Build, Execution, Deployment → Compiler → Java Compiler → Target bytecode version: 21

**Solution for Eclipse**:
1. Window → Preferences → Java → Compiler → Compiler compliance level: 21
2. Right-click project → Properties → Java Build Path → Libraries → Add Library → JRE System Library → Workspace default JRE (java-21)

### Error 3: "package javax.persistence does not exist"
**Cause**: Jakarta EE migration (Java 9+ uses jakarta.* instead of javax.*)

**Solution**: The pom.xml already uses correct dependencies:
- `spring-boot-starter-data-jpa` includes `jakarta.persistence`
- Make sure you're importing `jakarta.persistence.*` not `javax.persistence.*`

### Error 4: "Cannot resolve symbol 'Data'" (Lombok)
**Cause**: Lombok not properly configured

**Solution**:
```bash
# Clean and rebuild
mvn clean install

# For IntelliJ IDEA:
# Install Lombok plugin: File → Settings → Plugins → Search "Lombok" → Install
# Enable annotation processing: File → Settings → Build → Compiler → Annotation Processors → Enable annotation processing

# For Eclipse:
# Download lombok.jar from https://projectlombok.org/download
# Run: java -jar lombok.jar
# Select Eclipse installation directory
```

### Error 5: MySQL Connection Failed
**Cause**: MySQL server not running or wrong credentials

**Solution**:
```bash
# Check MySQL is running
# macOS
brew services list | grep mysql

# Linux
sudo systemctl status mysql

# Windows
services.msc # Check MySQL service

# Test connection
mysql -u campus_admin -p campus_events
# Enter password: campus_password123

# If connection fails, verify user exists:
mysql -u root -p
SELECT User, Host FROM mysql.user WHERE User='campus_admin';
```

### Error 6: "Table 'campus_events.users' doesn't exist"
**Cause**: Hibernate didn't create tables (ddl-auto not working)

**Solution**:
```properties
# In application.properties, ensure:
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# If still not working, manually create tables:
# See MYSQL_SETUP_GUIDE.md for SQL scripts
```

### Error 7: JWT Token Errors
**Cause**: JWT secret key issues

**Solution**:
```bash
# Generate a secure 512-bit key
# In Java:
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.util.Base64;

String secret = Base64.getEncoder().encodeToString(
    Keys.secretKeyFor(SignatureAlgorithm.HS512).getEncoded()
);
System.out.println(secret);

# Or use this pre-generated one in application.properties:
jwt.secret=dGhpc2lzYXZlcnlsb25nc2VjcmV0a2V5Zm9ySldUdG9rZW5nZW5lcmF0aW9uYW5kdmFsaWRhdGlvbnB1cnBvc2Vz
```

### Error 8: Port 8080 Already in Use
**Cause**: Another application using port 8080

**Solution**:
```bash
# Find process using port 8080
# macOS/Linux
lsof -i :8080
kill -9 <PID>

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Or change port in application.properties:
server.port=8081
```

### Error 9: CORS Error from React
**Cause**: Spring Boot not allowing React origin

**Solution**: In `application.properties`:
```properties
cors.allowed.origins=http://localhost:5173,http://localhost:8080,https://your-lovable-app.lovable.app
```

### Error 10: "Failed to load ApplicationContext"
**Cause**: Configuration issues

**Solution**:
```bash
# Check logs for specific error
mvn spring-boot:run

# Common fixes:
# 1. Verify all @Entity classes have proper annotations
# 2. Check @Repository interfaces extend JpaRepository
# 3. Ensure @Service classes are in correct package
# 4. Verify application.properties syntax
```

## Step-by-Step First Run

### 1. Create Project
```bash
mkdir campus-events-backend
cd campus-events-backend
```

### 2. Copy pom.xml
Copy the `pom.xml` from your Lovable project to this folder.

### 3. Create Application Class
`src/main/java/com/campusevents/CampusEventsApplication.java`:
```java
package com.campusevents;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class CampusEventsApplication {
    public static void main(String[] args) {
        SpringApplication.run(CampusEventsApplication.class, args);
    }
}
```

### 4. Create application.properties
`src/main/resources/application.properties`:
```properties
# Server
server.port=8080
spring.application.name=campus-events-api

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/campus_events?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=campus_admin
spring.datasource.password=campus_password123
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# JWT
jwt.secret=dGhpc2lzYXZlcnlsb25nc2VjcmV0a2V5Zm9ySldUdG9rZW5nZW5lcmF0aW9uYW5kdmFsaWRhdGlvbnB1cnBvc2Vz
jwt.expiration=86400000

# CORS
cors.allowed.origins=http://localhost:5173,http://localhost:8080
```

### 5. Build
```bash
mvn clean install
```

### 6. Run
```bash
mvn spring-boot:run
```

### 7. Test
```bash
# Should return empty array or authentication error
curl http://localhost:8080/api/events
```

## Recommended IDE Settings

### IntelliJ IDEA
1. **Install Plugins**:
   - Lombok
   - Spring Boot Assistant
   - Database Navigator

2. **Configuration**:
   - Enable annotation processing
   - Set Java 21 as project SDK
   - Import Maven changes automatically

### VS Code
1. **Install Extensions**:
   - Extension Pack for Java
   - Spring Boot Extension Pack
   - Lombok Annotations Support

2. **Configuration**:
   ```json
   {
     "java.configuration.runtimes": [
       {
         "name": "JavaSE-21",
         "path": "/path/to/jdk-21",
         "default": true
       }
     ]
   }
   ```

## Build Commands Reference

```bash
# Clean and build
mvn clean install

# Run application
mvn spring-boot:run

# Run with specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Skip tests
mvn clean install -DskipTests

# Create JAR
mvn clean package

# Run JAR
java -jar target/campus-events-backend-1.0.0.jar

# Debug mode
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"
```

## Verification Checklist

✅ Java 21 installed and verified  
✅ Maven 3.8+ installed  
✅ JAVA_HOME set correctly  
✅ MySQL 8.0+ running  
✅ Database `campus_events` created  
✅ User `campus_admin` created with privileges  
✅ pom.xml copied to project  
✅ application.properties created  
✅ Main application class created  
✅ Build successful (`mvn clean install`)  
✅ Application starts (`mvn spring-boot:run`)  
✅ Can access http://localhost:8080  

## Next Steps

Once Spring Boot is running successfully:
1. Copy remaining Java files from documentation
2. Test endpoints with Postman
3. Integrate with React frontend

See `LOCAL_DEVELOPMENT_GUIDE.md` for complete setup instructions.
