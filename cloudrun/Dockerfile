# Use an official Node.js runtime
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Install Python3 and pip (required for yt-dlp)
RUN apt-get update && apt-get install -y python3 python3-pip ffmpeg curl \
    && rm -rf /var/lib/apt/lists/*

# Install yt-dlp via pip
RUN pip3 install --break-system-packages yt-dlp

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the project files
COPY . .

# Copy cookies file
COPY cookies.txt ./cookies.txt

# Expose the port your app uses
EXPOSE 8080

# Start the server
CMD ["node", "server.js"]
