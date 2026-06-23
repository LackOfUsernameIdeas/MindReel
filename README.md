# MindReel

> **EEG-powered neuro-recommendation platform** — analyzes live brainwave signals from a NeuroSky MindWave Mobile 2 headset to understand your psycho-emotional state, stress levels, and cognitive performance, then recommends the most suitable movies, TV series, books, and songs in real time. Includes a VR cinema experience for watching trailers through a Meta Quest 2 headset.

Developed by **Kaloyan Kostadinov** and team. Finalist at the **NOIT National IT Competition 2025**. Built in consultation with qualified neurologists to validate its science-based approach to brainwave interpretation.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Local Development (localhost)](#local-development-localhost)
- [Server Deployment (XAMPP + VPS)](#server-deployment-xampp--vps)
- [Cloud Run Service](#cloud-run-service)
- [Hardware Setup](#hardware-setup)
- [Core Features](#core-features)
- [Development Notes](#development-notes)

---

## Overview

MindReel integrates **live EEG bioelectric brain activity analysis** with **AI-driven content recommendations** tailored to the user's real-time emotional and cognitive state. The full signal pipeline is:

```
NeuroSky MindWave Mobile 2 (Bluetooth)
  → ThinkGear Connector
    → PyMindWave2 (Python)
      → Socket.IO
        → Node.js API
          → React App (Vite)
```

Brainwave data is classified into five frequency bands using **Power Spectral Density (PSD)**, alongside NeuroSky's proprietary **Attention** and **Meditation** scores (0–100). After a 1-minute session, all data is passed to the AI to determine corrective content recommendations via **OpenAI API**, managed through **LangChain**.

Recommendation quality is continuously evaluated using industry-standard ML metrics — **Precision, Recall, F1 Score, Accuracy, Specificity, FPR, FNR** — measured against a custom relevance algorithm grounded in the user's own preferences.

---

## Architecture

The repository contains three sub-projects:

```
MindReel/
├── app/          # React + Vite frontend (TypeScript)
├── api/          # Node.js + Express backend
└── cloudrun/     # Containerized yt-dlp service (Google Cloud Run)
```

| Sub-project | Role                                                                                                                           |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `app/`      | User-facing SPA: EEG session UI, recommendations, VR cinema, statistics, ML metrics dashboard                                  |
| `api/`      | REST + Socket.IO server: EEG data ingestion, AI calls via LangChain, MySQL persistence, JWT auth, data pipelines               |
| `cloudrun/` | Isolated Docker service: downloads YouTube trailers via yt-dlp and stores them in Google Cloud Storage for A-Frame VR playback |

---

## Tech Stack

**Frontend (`app/`)**

- React 18, TypeScript, Vite
- Tailwind CSS, shadcn/ui
- Socket.IO Client
- ApexCharts
- A-Frame (Three.js / WebGL) — VR cinema

**Backend (`api/`)**

- Node.js, Express.js
- Socket.IO
- MySQL
- LangChain
- OpenAI API (GPT-4o, GPT-4-Turbo, GPT-4.1, GPT-5-mini)
- Gemini API (earlier versions)
- OMDb API, Spotify API, YouTube Data API v3
- Google Books API, Google Custom Search JSON API
- Goodreads scraper (BeautifulSoup, Python)
- JWT / HMAC-SHA-256 authentication
- Jest (86 unit tests)

**Cloud Run (`cloudrun/`)**

- Docker
- yt-dlp
- Google Cloud Storage (GCS)
- Google Cloud Run

**Hardware**

- NeuroSky MindWave Mobile 2 (EEG headset)
- ThinkGear Connector (TGC) — NeuroSky desktop bridge
- PyMindWave2 (Python library, partially rewritten)
- Meta Quest 2 (VR cinema)

---

## Prerequisites

Ensure the following are installed before proceeding:

- **Node.js** v18+ and **npm** v9+
- **Python** 3.9+ (for PyMindWave2 and Goodreads scraper)
- **MySQL** 8.0+
- **Git**
- **ThinkGear Connector** — download from [NeuroSky's developer site](http://developer.neurosky.com/); must be running locally on port `13854` for EEG data to flow
- **Docker** (only required for the `cloudrun/` service if running locally)

---

## Environment Variables

Both `app/` and `api/` require `.env` files. **Never commit these files.** `.gitignore` already excludes them.

### `api/.env`

```env
# ── Server ─────────────────────────────────────────────
PORT=3001

# ── MySQL ──────────────────────────────────────────────
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=mindreel

# ── JWT ────────────────────────────────────────────────
JWT_SECRET=your_jwt_secret_here

# ── OpenAI ─────────────────────────────────────────────
OPENAI_API_KEY=sk-...

# ── Google Gemini ──────────────────────────────────────
GEMINI_API_KEY=your_gemini_api_key

# ── OMDb (movies & series metadata) ───────────────────
OMDB_API_KEY=your_omdb_api_key

# ── Spotify ────────────────────────────────────────────
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# ── YouTube Data API v3 ────────────────────────────────
YOUTUBE_API_KEY=your_youtube_api_key

# ── Google Books API ───────────────────────────────────
GOOGLE_BOOKS_API_KEY=your_google_books_api_key

# ── Google Custom Search JSON API ─────────────────────
GOOGLE_CUSTOM_SEARCH_API_KEY=your_google_cse_api_key
GOOGLE_CUSTOM_SEARCH_CX=your_cse_cx_id

# ── Google Cloud Storage (for VR trailer serving) ──────
GCS_BUCKET_NAME=your_gcs_bucket_name
GOOGLE_APPLICATION_CREDENTIALS=./gcs-service-account.json
```

### `app/.env`

```env
VITE_API_URL=http://localhost:3001
VITE_SOCKET_URL=http://localhost:3001
```

### `cloudrun/.env` (only needed if running the Docker service locally)

```env
GCS_BUCKET_NAME=your_gcs_bucket_name
GOOGLE_APPLICATION_CREDENTIALS=./gcs-service-account.json
PORT=8080
```

---

## Local Development (localhost)

### 1. Clone the repository

```bash
git clone https://github.com/LackOfUsernameIdeas/MindReel.git
cd MindReel
```

### 2. Set up the database

Import the schema into MySQL:

```bash
mysql -u root -p -e "CREATE DATABASE mindreel;"
mysql -u root -p mindreel < api/database/schema.sql
```

### 3. Set up and start the API

```bash
cd api
npm install
cp .env.example .env   # then fill in your values
npm run dev
```

The API will start on `http://localhost:3001`.

### 4. Set up and start the frontend

Open a new terminal:

```bash
cd app
npm install
cp .env.example .env   # set VITE_API_URL=http://localhost:3001
npm run dev
```

The app will be available at `http://localhost:5173`.

### 5. Start ThinkGear Connector

Launch the **ThinkGear Connector** desktop application. It must be running on port `13854` before starting an EEG session. The Python PyMindWave2 bridge will connect to it automatically when a session begins.

### 6. (Optional) Run the Cloud Run trailer service locally

```bash
cd cloudrun
npm install
# or with Docker:
docker build -t mindreel-cloudrun .
docker run -p 8080:8080 --env-file .env mindreel-cloudrun
```

### Running tests

```bash
# API unit tests (Jest — 86 tests)
cd api
npm test
```

---

## Server Deployment (XAMPP + VPS)

> This section assumes a Linux VPS (e.g. Ubuntu 22.04) with Apache (XAMPP) serving the frontend as a static build, and Node.js running the API as a background process.

### 1. Build the frontend

```bash
cd app
npm install
npm run build
# Output is in app/dist/
```

Copy the contents of `app/dist/` into your XAMPP `htdocs` directory (or configure Apache to serve it):

```bash
cp -r dist/* /opt/lampp/htdocs/mindreel/
```

If serving from a subdirectory, update `vite.config.ts`:

```ts
export default defineConfig({
  base: "/mindreel/"
  // ...
});
```

### 2. Configure Apache (XAMPP)

Create or edit a virtual host in `/opt/lampp/etc/extra/httpd-vhosts.conf`:

```apache
<VirtualHost *:80>
    ServerName mindreel.yourdomain.com
    DocumentRoot /opt/lampp/htdocs/mindreel

    <Directory /opt/lampp/htdocs/mindreel>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    # Proxy API requests to Node.js
    ProxyPass /api http://localhost:3001/api
    ProxyPassReverse /api http://localhost:3001/api

    # Proxy Socket.IO
    ProxyPass /socket.io http://localhost:3001/socket.io
    ProxyPassReverse /socket.io http://localhost:3001/socket.io
    ProxyPass /socket.io ws://localhost:3001/socket.io
    ProxyPassReverse /socket.io ws://localhost:3001/socket.io
</VirtualHost>
```

Enable `mod_proxy` and `mod_proxy_http` in `httpd.conf`:

```apache
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
LoadModule proxy_wstunnel_module modules/mod_proxy_wstunnel.so
```

Restart XAMPP:

```bash
sudo /opt/lampp/lampp restart
```

### 3. Create an `.htaccess` for React client-side routing

Place this in your `htdocs/mindreel/` directory:

```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

### 4. Set up MySQL via XAMPP

```bash
/opt/lampp/bin/mysql -u root -p -e "CREATE DATABASE mindreel;"
/opt/lampp/bin/mysql -u root -p mindreel < api/database/schema.sql
```

### 5. Deploy and run the API

```bash
cd api
npm install --production
cp .env.example .env   # fill in production values; set DB_HOST=localhost
```

Install **PM2** to keep the API running as a background service:

```bash
npm install -g pm2
pm2 start index.js --name mindreel-api
pm2 save
pm2 startup   # follow the printed command to enable on boot
```

### 6. Update frontend environment for production

In `app/.env` before building:

```env
VITE_API_URL=https://mindreel.yourdomain.com
VITE_SOCKET_URL=https://mindreel.yourdomain.com
```

Then rebuild (`npm run build`) and re-copy `dist/` to htdocs.

---

## Cloud Run Service

The `cloudrun/` service handles YouTube trailer downloads (via `yt-dlp`) and uploads them to **Google Cloud Storage**, because A-Frame cannot render `<iframe>` elements, making YouTube embeds impossible in VR. The solution routes around this by serving plain `.mp4` files from GCS.

### Deploy to Google Cloud Run

Authenticate and set your project:

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

Build and push the container:

```bash
cd cloudrun
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/mindreel-cloudrun
```

Deploy:

```bash
gcloud run deploy mindreel-cloudrun \
  --image gcr.io/YOUR_PROJECT_ID/mindreel-cloudrun \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --set-env-vars GCS_BUCKET_NAME=your_bucket_name
```

Set the resulting Cloud Run service URL in the API's `.env`:

```env
CLOUDRUN_SERVICE_URL=https://mindreel-cloudrun-xxxx-ew.a.run.app
```

### GCS Bucket setup

```bash
gsutil mb -l europe-west1 gs://your_bucket_name
gsutil iam ch allUsers:objectViewer gs://your_bucket_name
```

Trailers are served via public GCS URLs:

```
https://storage.googleapis.com/your_bucket_name/trailer-<omdb-id>.mp4
```

---

## Hardware Setup

### NeuroSky MindWave Mobile 2

1. Charge the headset and pair it over Bluetooth with the host machine.
2. Install and launch **ThinkGear Connector (TGC)** — it opens a TCP socket on `localhost:13854`.
3. The Python PyMindWave2 bridge reads raw EEG packets from TGC and forwards the processed signal to the Node.js API via Socket.IO.

> **Note:** Parts of the PyMindWave2 library were incompatible with this project's requirements and were rewritten from scratch.

### Meta Quest 2 (VR Cinema)

- No additional setup required — the VR cinema runs in the browser via A-Frame (WebGL).
- Open the app URL in the Meta Quest 2 browser and enter the VR cinema section.
- A-Frame hand controllers required a custom fix; the solution described in the official A-Frame docs did not produce the expected result.

---

## Core Features

**Real-time EEG analysis**
Live brainwave data classified into five frequency bands via Power Spectral Density (PSD): Delta, Theta, Alpha, Beta, Gamma. Also captures NeuroSky's Attention and Meditation scores (0–100). Session duration: 1 minute.

**AI recommendations**
Movies, TV series, books, and songs generated via OpenAI API, managed through LangChain. After extensive benchmarking across Claude 3 Opus, Gemini 1.5 Pro, and the OpenAI family:

- Movies & series → GPT-4o
- Books → GPT-4-Turbo
- Songs → GPT-4.1
- Brain state analysis → GPT-5-mini

**Custom relevance algorithm**
Determines recommendation relevance across six criteria: preferred genres, content type, mood-to-genre mapping, available time vs. runtime, release year range, and target audience. Score above 5 points = relevant.

**ML evaluation metrics**
Precision, Recall/TPR, F1 Score, Accuracy, Specificity/TNR, FPR, FNR — evaluated against the relevance algorithm. Per-generation Precision also calculated for the last 5 recommendations per user.

**VR cinema**
A-Frame scene with cinema hall, projectors, popcorn machine, and a large screen. Trailers served as `.mp4` from GCS. Tested with Meta Quest 2.

**Content data pipelines**

- Movies & series: OMDb API
- Books: Custom BeautifulSoup scraper targeting Goodreads (extracts hidden JSON from `<script>` tags) + Google Books API
- Songs: Spotify API (metadata) merged with YouTube Data API v3 (view counts, likes, links)

**Authentication**
JWT + HMAC/SHA-256. 86 unit tests (Jest) across user, recommendation, preference, statistics, and metrics functions.

---

## Development Notes

**PyMindWave2 rewrites**
Parts of the PyMindWave2 library for retrieving EEG data were incompatible with the project's requirements and had to be rewritten from scratch.

**VR cinema / A-Frame iframe blocker**
A-Frame cannot render `<iframe>` elements, making YouTube embeds impossible in VR. A DOM-based workaround (creating an `<iframe>` outside the scene and overlapping it visually) also failed. Since the YouTube API only provides a video ID (not a streamable file), downloading trailers as MP4s was the only viable path. `yt-dlp-wrap` and Python yt-dlp were tried first but both failed on shared hosting (no `sudo` access; Python 3.6.8 incompatible with the library). The final solution: yt-dlp running inside a containerized Google Cloud Run service, storing downloads in GCS, served via public GCS URLs. A-Frame hand controllers also didn't appear as documented; the official A-Frame workaround didn't work either, requiring a separate custom fix.

**Goodreads API shutdown**
Goodreads shut down its public API in 2020. After evaluating all alternatives, scraping was chosen because Goodreads has the most comprehensive metadata — including Bulgarian books and older titles. The scraper extracts a large hidden JSON object embedded in a `<script>` tag on each book page, containing fields not even visible on the page.

**Spotify + YouTube data gaps**
Spotify frequently lacked data for older or less-popular tracks, so the YouTube Data API was added as a complementary source. Early on, the AI regularly hallucinated fictional songs not found on either platform — extensive prompt modifications and testing across different preference combinations resolved it.

**LangChain for multi-model benchmarking**
LangChain provides a unified interface across LLMs, enabling structured, comparable benchmarking. Claude 3 Opus, Gemini 1.5 Pro, and multiple GPT variants were all tested before settling on per-task model assignments.

**Task management**
Trello for task distribution throughout development. GitHub branching strategy: `main`, `dev`, per-feature branches.
