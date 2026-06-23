# MindReel

> **MindReel** is a comprehensive platform that integrates **live EEG bioelectric brain activity analysis** (via **NeuroSky MindWave Mobile 2** headset) with **AI-suggested content recommendations** tailored to the user's real-time emotional and cognitive state, as well as their personal preferences - where the AI itself is continuously subjected to accuracy and reliability evaluation through industry-standard ML metrics adapted to the specific needs and logic of the platform, measuring **Precision, Recall, F1 Score, Accuracy, Specificity, FPR, and FNR** against a relevance algorithm grounded in the user's own preferences. The project was developed in consultation with **qualified neurologists and specialists in that field** to validate its **science-based approach** to brainwave interpretation.

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
| `app/`      | SPA: EEG session UI, recommendations, VR cinema, statistics, ML metrics dashboard                             |
| `api/`      | REST + Socket.IO server: EEG data processing, AI calls via LangChain, MySQL persistence, JWT auth             |
| `cloudrun/` | Isolated Docker service: downloads YouTube trailers via yt-dlp and stores them in GCS for A-Frame VR playback |

---

## Tech Stack

**Frontend (`app/`)**  
React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Socket.IO Client, ApexCharts, A-Frame (VR cinema)

**Backend (`api/`)**  
Node.js, Express.js, Socket.IO, MySQL, LangChain, OpenAI API, Gemini API, OMDb API, Spotify API, YouTube Data API, Google Books API, Google Custom Search JSON API, Goodreads scraper (Python, BeautifulSoup), JWT, HMAC-SHA-256, Jest, ThinkGear Connector, PyMindWave2

**Cloud Run (`cloudrun/`)**  
Docker, yt-dlp, Google Cloud Storage, Google Cloud Run

**Hardware**  
NeuroSky MindWave Mobile 2, Meta Quest 2 (compatible with any other VR headset)

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
XAMPP_PATH=/xampp
API_PATH=/MindReel/api
BROWSER_PATH=C:/Program Files/Google/Chrome/Application/chrome.exe
VITE_PORT=5174
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_API_BASE_URL=https://mindreel-api.noit.eu
VITE_SOCKET_IO_URL=wss://mindreel-api.noit.eu
VITE_CLOUDRUN_BASE_URL=https://mindreel-service-dkbjkyxsxq-lm.a.run.app
VITE_BOOKS_SOURCE=Goodreads # GoogleBooks | Goodreads
VITE_YOUTUBE_API_KEY=your_youtube_api_key
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
node server
```

The API runs on `http://localhost:5000`.

### 4. Start the frontend

```bash
cd app
npm run dev
```

The app runs on `http://localhost:5174`.

That's it - no further setup is required for local development.

---

## Cloud Run Service

The `cloudrun/` service downloads YouTube trailers via `yt-dlp` and uploads them to Google Cloud Storage as `.mp4` files for VR playback (A-Frame can't render `<iframe>` elements).

### Test on deployed Cloud Run service

`https://<your-cloud-run-service-url>.a.run.app`

Open Docker Desktop, then open a PowerShell terminal:

```powershell
cd <path-to>\MindReel\cloudrun
docker build -t gcr.io/<your-project-id>/mindreel-service .
docker push gcr.io/<your-project-id>/mindreel-service
gcloud run deploy mindreel-service `
  --image=gcr.io/<your-project-id>/mindreel-service `
  --platform=managed `
  --region=europe-central2 `
  --allow-unauthenticated `
  --memory=2Gi `
  --cpu=2 `
  --timeout=600 `
  --concurrency=1 `
  --min-instances=1 `
  --max-instances=10 `
  --set-env-vars="GCS_BUCKET_NAME=<your-bucket-name>" `
  --set-secrets="YOUTUBE_COOKIES=youtube-cookies:latest" `
  --service-account="<your-service-account>@<your-project-id>.iam.gserviceaccount.com"
```

> `--service-account` is required. `Storage()` in `server.js` uses Workload Identity (no key file). If the service account is ever recreated, re-run:
>
> ```bash
> gcloud projects add-iam-policy-binding <your-project-id> \
>   --member="serviceAccount:<your-service-account>@<your-project-id>.iam.gserviceaccount.com" \
>   --role="roles/storage.objectAdmin"
> ```

### Test locally

`http://localhost:8080`

```powershell
cd <path-to>\MindReel\cloudrun
docker build -t mindreel-video-service .
docker run -p 8080:8080 `
  -v "${PWD}/data:/data" `
  -v "${PWD}/service-account.json:/usr/src/app/service-account.json:ro" `
  -e DATA_DIR=/data `
  --name video-service `
  mindreel-video-service
```

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

1. **Download ThinkGear Connector (TGC)** from `mwm2.neurosky.com` - pick the download option matching your OS, unzip it, and run ThinkGear Connector (green icon). A brain-shaped icon should appear in the bottom-right system tray.
2. **Turn on the headset.** A blue light indicates it's powered on.
3. **Pair via Bluetooth.** Your computer needs Bluetooth (built-in or via adapter). Open Bluetooth settings, add a new device, and connect to "MindWave Mobile" - wait until the device shows as connected with a headphone icon.
4. **Configure the COM port.** After pairing, go to _More Bluetooth Options_ → _COM Ports_ tab and find the port the device is connected to. If it isn't listed, add one. The relevant port is the **OUTGOING** one (e.g. `COM4`). Enter that port number into the corresponding field in the ThinkGear Connector app.
5. **Run the MindReel connection program** (a small `.exe` made separately for the EEG session bridge).
6. **Connect, in this order:** start ThinkGear Connector → turn on the headset → enable Bluetooth → launch the MindReel connection program. A successful connection shows the ThinkGear tray icon turning blue with a "device connected" status, and the MindReel session window should appear. If the connection message doesn't show in the console and the session window doesn't appear - even though ThinkGear reports a connection - restart and try again.

### Meta Quest 2 (VR Cinema)

- No additional setup required - the VR cinema runs in-browser via A-Frame (WebGL).
- Open the app URL in the Meta Quest 2 browser and enter the VR cinema section.
