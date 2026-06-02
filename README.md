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

Open `http://localhost:6000`.

## Run Backend

```powershell
cd backend
$env:MYSQL_USER="lawvoice_user"
$env:MYSQL_PASSWORD="lawvoice_pass"
$env:SARVAM_API_KEY="your_sarvam_api_key"
$env:SARVAM_MODEL="sarvam-105b"
mvn spring-boot:run
```

API base URL: `http://localhost:8081/api`

`SARVAM_API_KEY` enables Tamil AI answers on the சட்டக்குரல் page. If it is not set, the app falls back to local demo guidance.

## MySQL Setup

Open MySQL as an admin or root user and run:

```sql
CREATE DATABASE IF NOT EXISTS lawvoice;
CREATE USER IF NOT EXISTS 'lawvoice_user'@'localhost' IDENTIFIED BY 'lawvoice_pass';
GRANT ALL PRIVILEGES ON lawvoice.* TO 'lawvoice_user'@'localhost';
FLUSH PRIVILEGES;
```

If you want to use `root`, replace `lawvoice_user` and `lawvoice_pass` with your real MySQL username and password. Do not use the placeholder text `your_password`.
