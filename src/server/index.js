const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const multer = require('multer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const rateLimit = require('express-rate-limit');

const app = express();
const port = 8080;

app.use(cors());

// set rate limit for file uploads and URL uploads (adjust limits as needed)
const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // file limit (adjust as needed)
    message: 'Too many requests, please try again later.',
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());

// create a directory to store uploaded files
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const fileSizeLimit = 500 * 1024 * 1024; // 500MB
const blockedExtensions = ['.exe', '.jar', '.cpl', '.scr', '.sh', '.doc'];

function isBlockedExtension(fileName) {
    const fileExt = path.extname(fileName).toLowerCase();
    return blockedExtensions.some(blockedExt => {
        return fileExt === blockedExt || fileExt.startsWith(blockedExt);
    });
}

const fileFilter = (req, file, cb) => {
    if (isBlockedExtension(file.originalname)) {
        return cb(new Error('File type not allowed.'));
    }
    cb(null, true);
};

// configure multer
const upload = multer({
    storage: multer.diskStorage({
        destination: uploadDir,
        filename: function (req, file, cb) {
            // Generate a short URL using crypto
            const shortURL = crypto.randomBytes(10).toString('hex'); // you can adjust the number of bytes for your desired length
            cb(null, `${shortURL}${path.extname(file.originalname)}`);
        },
    }),
    limits: { fileSize: fileSizeLimit },
    fileFilter: fileFilter,
});


// handle file uploads with rate limiting
app.post('/upload', uploadLimiter, (req, res) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: 'File size exceeds the limit of 500MB.' });
            }
            if (err.message === 'File type not allowed.') {
                return res.status(400).json({ error: 'File type not allowed.' });
            }
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        const fileLink = `/uploads/${req.file.filename}`;
        res.json({ fileLink });
    });
});

// handle URL uploads with rate limiting and file type check
app.post('/urlupload', uploadLimiter, async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'No URL provided.' });
        }

        const fileExt = path.extname(url.split('/').pop()).toLowerCase();
        if (blockedExtensions.includes(fileExt)) {
            return res.status(400).json({ error: 'File type not allowed.' });
        }

        const response = await axios.get(url, { responseType: 'stream' });
        const fileSize = parseInt(response.headers['content-length'], 10);

        if (fileSize > fileSizeLimit) {
            return res.status(400).json({ error: 'File size exceeds the limit of 500MB.' });
        }

        const uniqueFileName = crypto.randomBytes(10).toString('hex') + path.extname(url.split('/').pop());
        const writeStream = fs.createWriteStream(path.join(uploadDir, uniqueFileName));

        response.data.pipe(writeStream);

        writeStream.on('finish', () => {
            res.json({ fileLink: `/uploads/${uniqueFileName}` });
        });

        writeStream.on('error', (err) => {
            console.error(`Error saving file: ${err.message}`);
            res.status(500).json({ error: 'File saving error.' });
        });
    } catch (error) {
        console.error(`Error downloading file: ${error.message}`);
        res.status(500).json({ error: 'File download error.' });
    }
});

// handle file deletion
app.post('/delete', (req, res) => {
    const { files } = req.body;
    const fileNames = files.split(' ');
    fileNames.forEach((fileName) => {
        const filePath = path.join(uploadDir, fileName);
        try {
            fs.unlinkSync(filePath);
        } catch (err) {
            console.error(`Error deleting file ${fileName}: ${err.message}`);
        }
    });
    res.json({ message: 'Files deleted successfully.' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
