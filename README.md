# LawVoice

English full-stack legal assistance web app.

## Folders

- `frontend` - React responsive web app with voice input, speech output, guide pages, lawyer help, emergency help, history, profile, and admin screens.
- `backend` - Java Spring Boot REST API with MySQL configuration and query history persistence.

## Run Frontend

```powershell
cd frontend
npm.cmd install --strict-ssl=false
npm.cmd run dev
```

Open `http://localhost:5173`.

## Run Backend

```powershell
cd backend
$env:MYSQL_USER="lawvoice_user"
$env:MYSQL_PASSWORD="lawvoice_pass"
mvn spring-boot:run
```

API base URL: `http://localhost:8081/api`

## MySQL Setup

Open MySQL as an admin or root user and run:

```sql
CREATE DATABASE IF NOT EXISTS lawvoice;
CREATE USER IF NOT EXISTS 'lawvoice_user'@'localhost' IDENTIFIED BY 'lawvoice_pass';
GRANT ALL PRIVILEGES ON lawvoice.* TO 'lawvoice_user'@'localhost';
FLUSH PRIVILEGES;
```

If you want to use `root`, replace `lawvoice_user` and `lawvoice_pass` with your real MySQL username and password. Do not use the placeholder text `your_password`.
