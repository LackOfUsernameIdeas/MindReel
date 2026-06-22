# Use Node.js 22+ (required by yt-dlp's NodeJsRuntime, minimum version is v22.0.0)
FROM node:22

WORKDIR /usr/src/app

# Install system dependencies: ffmpeg for video merging, aria2 for faster downloads
RUN apt-get update && apt-get install -y python3 python3-pip ffmpeg curl aria2 \
    && rm -rf /var/lib/apt/lists/*

# Install yt-dlp and yt-dlp-ejs via pip into python3.11 (must share the same Python env).
# yt-dlp-ejs provides the JS solver scripts needed for YouTube's n-challenge.
RUN python3.11 -m pip install --break-system-packages yt-dlp yt-dlp-ejs

# Symlink node so yt-dlp can find it at runtime
RUN ln -sf /usr/local/bin/node /usr/bin/node \
    && ln -sf /usr/local/bin/node /usr/local/bin/nodejs

# Verify yt-dlp-ejs is installed in python3.11's env and node is detectable
RUN python3.11 -c "import yt_dlp_ejs; print('yt-dlp-ejs OK')"
RUN python3.11 -c "from yt_dlp.utils._jsruntime import NodeJsRuntime; r = NodeJsRuntime(); print(r.info)"

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the project files
COPY . .

# Expose the port the app uses
EXPOSE 8080

# Start the server
CMD ["node", "server.js"]