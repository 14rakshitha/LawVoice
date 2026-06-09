# LawVoice Backend Deployment Guide (Render & Railway)

This guide helps you deploy the **LawVoice Spring Boot backend** to Render or Railway and configure the PDF knowledge base.

---

## 🛠️ Deployment Instructions

### Method A: Deploy on Render

1. **Sign up/Log in** to your [Render Dashboard](https://render.com/).
2. Click **New** -> **Web Service**.
3. Connect your GitHub repository.
4. Set the following fields:
   - **Name**: `lawvoice-backend`
   - **Root Directory**: `backend` (This points Render to the backend subfolder)
   - **Runtime**: `Docker` (Render will automatically detect the `Dockerfile` inside `backend/`)
5. Scroll down to **Advanced** and click **Add Environment Variable**:
   - `PORT`: `8081`
   - `SARVAM_API_KEY`: *(Your Sarvam AI API Key)*
   - `FRONTEND_ORIGIN`: *(Your Vercel Frontend URL, e.g., `https://lawvoice.vercel.app`)*
   - `LAWVOICE_PDF_PATH`: `/app/data/law_book.pdf` (See the PDF upload section below)
6. Click **Deploy Web Service**.

---

### Method B: Deploy on Railway

1. **Sign up/Log in** to [Railway](https://railway.app/).
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select your repository.
4. Once added, click on the service and select **Settings**:
   - Under **Build**, set the **Root Directory** to `backend`.
   - Railway will automatically detect the `Dockerfile` inside the directory and build the container.
5. Select the **Variables** tab and add:
   - `PORT`: `8081`
   - `SARVAM_API_KEY`: *(Your Sarvam AI API key)*
   - `FRONTEND_ORIGIN`: *(Your Vercel Frontend URL)*
   - `LAWVOICE_PDF_PATH`: `/app/data/law_book.pdf`
6. Click **Deploy**.

---

## 📂 Handling the PDF Knowledge Base

Because the Spring Boot API uses a local PDF file as its legal database, you must make this file accessible to the backend server. Choose **one** of the following ways:

### Option 1: Place it in the repository (Easiest)
1. Copy your PDF file (e.g. `20240716890312078.pdf`) into the backend resources folder at:
   `backend/src/main/resources/law_book.pdf`
2. Commit and push it to your GitHub repository.
3. In your Render/Railway dashboard, set this environment variable:
   - `LAWVOICE_PDF_PATH` = `backend/src/main/resources/law_book.pdf` (or just leave it empty, as the service will automatically search for it relative to compile-time resource directories if the file matches standard paths).

### Option 2: Mount a Persistent Volume (Best for production)
If you don't want to check the PDF into Git, you can mount a persistent disk volume on Render or Railway:
1. In Render, go to **Web Service** -> **Disks** -> **Add Disk**:
   - **Mount Path**: `/app/data`
2. Use an SFTP tool, SCP, or the Render Shell to upload your PDF to `/app/data/law_book.pdf`.
3. Set the environment variable:
   - `LAWVOICE_PDF_PATH` = `/app/data/law_book.pdf`
