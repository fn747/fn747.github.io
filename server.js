const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 8080;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for all origins
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const { nfcId } = req.body;
        const fileExt = path.extname(file.originalname);
        const newFilename = `${nfcId}${fileExt}`;
        cb(null, newFilename);
    },
});
const upload = multer({ storage });

// Handle form submission
app.post('/upload', upload.single('image'), (req, res) => {
    const { name, email, nfcId, date, message } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    const userData = {
        nfcId,
        name,
        email,
        date,
        message,
        imageUrl: `/uploads/${req.file.filename}`,
    };

    fs.writeFile(
        path.join(uploadDir, `${nfcId}.json`),
        JSON.stringify(userData, null, 2),
        (err) => {
            if (err) {
                console.error('Error saving data:', err);
                return res.status(500).json({ message: 'Error saving data.' });
            }
            res.json({ message: 'Upload successful!', nfcId });
        }
    );
});

// Route to fetch user data based on NFC ID
app.get('/data/:nfcId', (req, res) => {
    const { nfcId } = req.params;
    const dataPath = path.join(uploadDir, `${nfcId}.json`);

    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data:', err);
            return res.status(404).json({ message: 'Data not found.' });
        }
        res.json(JSON.parse(data));
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
