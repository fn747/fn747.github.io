const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 8080;

// Allow CORS for frontend requests
app.use(cors({ origin: "*" }));
app.use(express.static(__dirname));
app.use(express.json());

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configure Multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const { name, email, nfcId } = req.body;

        // Sanitize email (remove special characters to avoid issues)
        const cleanEmail = email.replace(/[^a-zA-Z0-9]/g, "_");

        // Extract file extension
        const fileExt = path.extname(file.originalname);

        // Generate new filename: name_email_uniqueID.extension
        const newFilename = `${name}_${cleanEmail}_${nfcId}${fileExt}`;

        cb(null, newFilename);
    },
});

const upload = multer({ storage });

// Upload route
app.post("/upload", upload.array("image", 3), (req, res) => {
    const { name, email, nfcId, date, message } = req.body;

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded." });
    }

    // Get new filenames
    const uploadedFiles = req.files.map(file => file.filename).join(", ");

    // Append user data to text file
    const userData = `NFC ID: ${nfcId}\nName: ${name}\nEmail: ${email}\nDate: ${date}\nMessage: ${message}\nImages: ${uploadedFiles}\n\n`;

    fs.appendFile("nfc_user_data.txt", userData, (err) => {
        if (err) {
            console.error("Error saving data:", err);
            return res.status(500).json({ message: "Error saving data." });
        }
        res.json({ message: "Upload successful! NFC ID: " + nfcId, files: uploadedFiles });
    });
});

app.get("/latest-upload", (req, res) => {
    fs.readFile("nfc_user_data.txt", "utf8", (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).json({ message: "Error reading data." });
        }

        const entries = data.trim().split("\n\n"); // Split uploads by blank lines
        const latestEntry = entries.pop(); // Get the latest entry

        if (!latestEntry) {
            return res.json({ message: "No uploads found." });
        }

        // Extract the required info from the latest upload
        const matchImage = latestEntry.match(/Images: (.+)/);
        const matchDate = latestEntry.match(/Date: (.+)/);
        const matchMessage = latestEntry.match(/Message: (.+)/);

        res.json({
            imageUrl: matchImage ? `/uploads/${matchImage[1]}` : null,
            date: matchDate ? matchDate[1] : "No date provided",
            message: matchMessage ? matchMessage[1] : "No message provided",
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
