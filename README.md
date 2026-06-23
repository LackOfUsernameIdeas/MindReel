# MindReel

> **EEG-powered neuro-recommendation platform** - analyzes live brainwave signals from a NeuroSky MindWave Mobile 2 headset to understand psycho-emotional state, stress levels, and cognitive performance, then recommends movies, TV series, books, and songs in real time. Includes a VR cinema experience for watching trailers through a Meta Quest 2 headset.

---

## Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Gitignored Configuration Files](#gitignored-configuration-files)
- [Local Development](#local-development)
- [Cloud Run Service](#cloud-run-service)
- [Hardware Setup](#hardware-setup)

---

## Architecture

```
MindReel/
├── app/          # React + Vite frontend (TypeScript)
├── api/          # Node.js + Express backend
└── cloudrun/     # Containerized yt-dlp service (Google Cloud Run)
```

| Sub-project | Role                                                                                                          |
| ----------- | ------------------------------------------------------------------------------------------------------------- |
| `app/`      | User-facing SPA: EEG session UI, recommendations, VR cinema, statistics, ML metrics dashboard                 |
| `api/`      | REST + Socket.IO server: EEG data ingestion, AI calls via LangChain, MySQL persistence, JWT auth              |
| `cloudrun/` | Isolated Docker service: downloads YouTube trailers via yt-dlp and stores them in GCS for A-Frame VR playback |

---

## Tech Stack

**Frontend (`app/`)** - React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Socket.IO Client, ApexCharts, A-Frame (VR cinema)

**Backend (`api/`)** - Node.js, Express, Socket.IO, MySQL, LangChain, OpenAI API, Gemini API, OMDb API, Spotify API, YouTube Data API v3, Google Books API, Google Custom Search JSON API, Goodreads scraper (Python/BeautifulSoup), JWT/HMAC-SHA-256, Jest

**Cloud Run (`cloudrun/`)** - Docker, yt-dlp, Google Cloud Storage, Google Cloud Run

**Hardware** - NeuroSky MindWave Mobile 2, ThinkGear Connector, PyMindWave2 (Python, partially rewritten), Meta Quest 2

---

## Gitignored Configuration Files

These files are excluded from version control and must exist locally before running the project. Templates below show the expected structure - fill in real values yourself.

There are two configuration objects in **api/config.js**: one for local development and another for deployment to a hosting environment using MySQL.

### `api/config.js`

```js
module.exports = {
  dbOpts: {
    host: "your_db_host",
    user: "your_db_user",
    password: "your_db_password",
    database: "your_db_name"
  },
  dbOptsLocal: {
    host: "localhost",
    user: "root",
    password: "",
    database: "mindreel"
  },
  pythonPath: "/path/to/virtualenv/bin/python",
  pythonPathLocal: "python"
};
```

### `api/credentials.js`

```js
module.exports = {
  SECRET_KEY: "your_jwt_secret",
  EMAIL_USER: "your_email_user",
  EMAIL_PASS: "your_email_password",
  OPENAI_API_KEY: "your_openai_api_key",
  GEMINI_API_KEY: "your_gemini_api_key"
};
```

### `app/.env`

```env
XAMPP_PATH=D:/xampp
API_PATH=D:/dev/MindReel/api
BROWSER_PATH=C:/Program Files/Google/Chrome/Application/chrome.exe
VITE_PORT=5174
# HOSTING:
VITE_OPENAI_API_KEY=your_openai_api_key
# VITE_OPENAI_API_KEY=your_alternate_openai_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_API_BASE_URL=https://mindreel-api.noit.eu
# VITE_API_BASE_URL=http://localhost:5000
# VITE_SOCKET_IO_URL=ws://localhost:5000
VITE_SOCKET_IO_URL=wss://mindreel-api.noit.eu
VITE_CLOUDRUN_BASE_URL=https://mindreel-service-dkbjkyxsxq-lm.a.run.app
VITE_BOOKS_SOURCE=Goodreads # GoogleBooks | Goodreads
# HOSTING:
VITE_YOUTUBE_API_KEY=your_youtube_api_key
# VITE_YOUTUBE_API_KEY=your_alternate_youtube_api_key
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
VITE_DEFAULT_THEME=light # dark | light
VITE_PUBLIC_DIR=/tmp
```

### `cloudrun/service-account.json`

```json
{
  "type": "service_account",
  "project_id": "your_project_id",
  "private_key_id": "your_private_key_id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nyour_key_here\n-----END PRIVATE KEY-----\n",
  "client_email": "your_service_account@your_project.iam.gserviceaccount.com",
  "client_id": "your_client_id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "your_client_cert_url",
  "universe_domain": "googleapis.com"
}
```

Only needed for running `cloudrun/` locally outside Cloud Run, where Workload Identity isn't available.

---

## Local Development

### 1. Install dependencies

```bash
cd api
npm i

cd ../app
npm i
```

### 2. Start XAMPP

Open the XAMPP Control Panel and start:

- **Apache**
- **MySQL**

### 3. Start the API

```bash
cd api
node index.js
```

The API runs on `http://localhost:3001`.

### 4. Start the frontend

```bash
cd app
npm run dev
```

The app runs on `http://localhost:5173`.

That's it - no further setup is required for local development.

---

## Cloud Run Service

The `cloudrun/` service downloads YouTube trailers via `yt-dlp` and uploads them to Google Cloud Storage as `.mp4` files for VR playback (A-Frame can't render `<iframe>` elements).

### Test on deployed Cloud Run service

`https://mindreel-service-dkbjkyxsxq-lm.a.run.app`

Open Docker Desktop, then open a PowerShell terminal:

```powershell
cd D:\Projects\MindReel\cloudrun
docker build -t gcr.io/neural-clarity-468312-d8/mindreel-service .
docker push gcr.io/neural-clarity-468312-d8/mindreel-service
gcloud run deploy mindreel-service `
  --image=gcr.io/neural-clarity-468312-d8/mindreel-service `
  --platform=managed `
  --region=europe-central2 `
  --allow-unauthenticated `
  --memory=2Gi `
  --cpu=2 `
  --timeout=600 `
  --concurrency=1 `
  --min-instances=1 `
  --max-instances=10 `
  --set-env-vars="GCS_BUCKET_NAME=my-public-videos" `
  --set-secrets="YOUTUBE_COOKIES=youtube-cookies:latest" `
  --service-account="download-videos@neural-clarity-468312-d8.iam.gserviceaccount.com"
```

> `--service-account` is required. `Storage()` in `server.js` uses Workload Identity (no key file). If the service account is ever recreated, re-run:
>
> ```bash
> gcloud projects add-iam-policy-binding neural-clarity-468312-d8 \
>   --member="serviceAccount:download-videos@neural-clarity-468312-d8.iam.gserviceaccount.com" \
>   --role="roles/storage.objectAdmin"
> ```

### Test locally

`http://localhost:8080`

```powershell
cd D:\Projects\MindReel\cloudrun
docker build -t mindreel-video-service .
docker run -p 8080:8080 `
  -v "${PWD}/data:/data" `
  -v "${PWD}/service-account.json:/usr/src/app/service-account.json:ro" `
  -e DATA_DIR=/data `
  --name video-service `
  mindreel-video-service
```

### Useful console links

- **Logs:** [Cloud Run logs](https://console.cloud.google.com/run/detail/europe-central2/mindreel-service/observability/logs?authuser=3&project=neural-clarity-468312-d8)
- **Secret versions:** [youtube-cookies secret](https://console.cloud.google.com/security/secret-manager/secret/youtube-cookies/versions?authuser=4&project=neural-clarity-468312-d8)
- **Revisions:** [Cloud Run revisions](https://console.cloud.google.com/run/detail/europe-central2/mindreel-service/revisions?authuser=4&project=neural-clarity-468312-d8)
- **Edit & deploy revision** (increase max requests/instances): [Deploy revision](https://console.cloud.google.com/run/deploy/europe-central2/mindreel-service?project=neural-clarity-468312-d8&authuser=4)
- **Billing account:** [Manage billing](https://console.cloud.google.com/billing/01CF5A-990DBA-AF432C/manage?authuser=4&project=neural-clarity-468312-d8)
- **Update env/secrets without redeploying:** [Gist instructions](https://gist.github.com/gamer191/ddf0b23b0a6df8e2ffe81bd1dda9154c)

### Exporting YouTube cookies (Chromium-based browsers)

1. Install [Get cookies.txt LOCALLY](https://chromewebstore.google.com/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc).
2. Enable **"Allow in incognito"** for the extension at `chrome://extensions/?id=cclelndahbckbenkjhflpdbgdldlbecc`.
3. Open an incognito window and log into YouTube.
4. Open `https://youtube.com/robots.txt` in a new tab, then close the YouTube tab.
5. Export YouTube cookies only ("Export as" → rename to `cookies.txt`), then close the incognito window so the cookies never rotate.
6. Push the new cookies:

```bash
gcloud secrets versions add youtube-cookies --data-file=cookies.txt
gcloud run services update mindreel-service \
  --region europe-central2 \
  --update-secrets YOUTUBE_COOKIES=youtube-cookies:latest
```

---

## Hardware Setup

### NeuroSky MindWave Mobile 2

1. Charge the headset and pair it over Bluetooth.
2. Install and launch **ThinkGear Connector (TGC)** - opens a TCP socket on `localhost:13854`.
3. The Python PyMindWave2 bridge reads raw EEG packets from TGC and forwards the processed signal to the API via Socket.IO.

### Meta Quest 2 (VR Cinema)

- No additional setup required - the VR cinema runs in-browser via A-Frame (WebGL).
- Open the app URL in the Meta Quest 2 browser and enter the VR cinema section.
