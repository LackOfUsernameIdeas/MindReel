const express = require("express");
const bodyParser = require("body-parser");
const YTDlpWrap = require("yt-dlp-wrap").default;
const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
const path = require("path");

const app = express();
const ytDlpWrap = new YTDlpWrap("yt-dlp");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Initialize Google Cloud Storage
const storage = new Storage({
  keyFilename: "service-account.json" // path to your JSON key
});
const bucketName = "my-public-videos";
const bucket = storage.bucket(bucketName);

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "video-download-service" });
});

// 📥 Изтегляне на YouTube видео в съответната директория
app.get("/download/youtube-video", (req, res) => {
  try {
    const { url, outputDir, fileName } = req.query;

    if (!url || !outputDir || !fileName) {
      return res.status(400).json({ error: "Missing parameter." });
    }

    const safeOutputDir = outputDir;
    const fullPath = path.join(safeOutputDir, fileName);

    // Ensure output directory exists
    if (!fs.existsSync(safeOutputDir)) {
      fs.mkdirSync(safeOutputDir, { recursive: true });
    }

    console.log(`🎬 Starting download for ${url} → ${fullPath}`);

    const args = [
      url,
      "-f",
      "bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4",
      "-o",
      fullPath,
      "--merge-output-format",
      "mp4"
    ];

    const ytDlpEventEmitter = ytDlpWrap.exec(args);

    let progressData = {};
    let errorOccurred = null;

    ytDlpEventEmitter
      .on("progress", (progress) => {
        progressData = progress;
        process.stdout.write(
          `\rDownloading: ${progress.percent}% (${progress.currentSpeed}) ETA: ${progress.eta}s`
        );
      })
      .on("ytDlpEvent", (eventType, eventData) => {
        console.log(eventType, eventData);
      })
      .on("error", (error) => {
        console.error("❌ Download error:", error);
        errorOccurred = error;
      })
      .on("close", async (code) => {
        console.log("\n✅ Download process finished with code:", code);

        if (errorOccurred) {
          return res.status(500).json({
            status: "error",
            message: "Download failed",
            error: errorOccurred.message || errorOccurred
          });
        }

        // Check if file exists
        if (!fs.existsSync(fullPath)) {
          return res.status(404).json({
            status: "error",
            message: "File not found after download"
          });
        }

        try {
          // Upload to Google Cloud Storage
          console.log(`☁️ Uploading ${fileName} to GCS...`);
          await bucket.upload(fullPath, {
            destination: fileName,
            metadata: { contentType: "video/mp4" }
          });

          const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
          console.log(`✅ Uploaded successfully: ${publicUrl}`);

          // Get file info
          const stats = fs.statSync(fullPath);
          const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

          // Optionally delete local file after upload
          fs.unlinkSync(fullPath);

          res.json({
            status: "success",
            message: "Download and upload completed successfully",
            videoUrl: publicUrl,
            fileSizeMB,
            progress: progressData
          });
        } catch (uploadError) {
          console.error("☁️ Upload failed:", uploadError);
          res.status(500).json({
            status: "error",
            message: "Upload to Google Cloud Storage failed",
            error: uploadError.message || uploadError
          });
        }
      });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Video download service running on port ${PORT}`);
});
