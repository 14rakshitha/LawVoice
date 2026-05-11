# LawVoice Backend

Spring Boot API for the English LawVoice legal assistance app.

## MySQL

Create a MySQL database named `lawvoice`, or let the JDBC URL create it.

```powershell
$env:MYSQL_URL="jdbc:mysql://localhost:3306/lawvoice?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Kolkata"
$env:MYSQL_USER="lawvoice_user"
$env:MYSQL_PASSWORD="lawvoice_pass"
mvn spring-boot:run
```

API base URL: `http://localhost:8081/api`

Create the local MySQL user first:

```sql
CREATE DATABASE IF NOT EXISTS lawvoice;
CREATE USER IF NOT EXISTS 'lawvoice_user'@'localhost' IDENTIFIED BY 'lawvoice_pass';
GRANT ALL PRIVILEGES ON lawvoice.* TO 'lawvoice_user'@'localhost';
FLUSH PRIVILEGES;
```
