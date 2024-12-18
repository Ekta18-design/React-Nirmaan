import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import db from '../config/db.js';

// Derive __dirname from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Serve static files (for uploaded files)
router.use('/fileupload', express.static(path.join(__dirname, '../../fileupload')));

console.log('Static file serving path:', path.join(__dirname, '../../fileupload'));

// Multer setup for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const builderid = req.body.builderid;

    if (!builderid) {
      return cb(new Error('Builder ID is required'));
    }

    const uploadPath = path.join(__dirname, '../../fileupload', `builder-${builderid}`);
    
    // Ensure the builder-specific directory exists
    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      if (err) {
        console.error('Error creating directory:', err);
        return cb(err);
      }
      cb(null, uploadPath);
    });
  },
  filename: (req, file, cb) => {
    const { builderid, projectid, buildingid, unitcategoryid } = req.body;

    // Construct the filename based on provided IDs
    const filePrefix = [
      builderid || '0',
      projectid || '0',
      buildingid || '0',
      unitcategoryid || '0'
    ].join('-');

    const originalFileName = file.originalname;
    const newFileName = `${filePrefix}-${originalFileName}`;
    console.log('Saving file as:', newFileName);
    cb(null, newFileName);
  }
});

const upload = multer({ storage: storage });

// Helper function to handle query results
const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

// API endpoint to handle form submission (POST)
router.post('/', upload.single('documentfile'), async (req, res) => {
  console.log('Request Body:', req.body);
  console.log('Uploaded File:', req.file);

  const { builderid, projectid, buildingid, unitcategoryid, documenttitle, documentdescription, documenttags } = req.body;
  const documentfile = req.file ? req.file.filename : null;

  if (!builderid || !documentfile || !documenttitle || !documentdescription || !documenttags) {
    return res.status(400).json({ error: 'Builder ID, Document File, Document Title, Document Description, and Document Tags are required.' });
  }
  
  try {
    const sql = `CALL stp_UploadMaster(2, NULL, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const result = await query(sql, [builderid, projectid || null, buildingid || null, unitcategoryid || null, documentfile, documenttitle, documentdescription, documenttags]);

    res.status(201).json({ message: 'Upload saved successfully!', uploadid: result[0][0].uploadid });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Error saving data.' });
  }
});

// API endpoint to get all uploads (GET)
router.get('/', async (req, res) => {
  try {
    const sql = 'CALL stp_UploadMaster(1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)';
    const results = await query(sql);

    // Modify the results to include the full file URL
    const updatedResults = results[0].map(upload => ({
      ...upload,
      documentfile: upload.documentfile
        ? `fileupload/builder-${upload.builderid}/${upload.documentfile}`  // Just the relative path
        : null
    }));

    res.status(200).json(updatedResults);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data.' });
  }
});

// API endpoint to get an upload by ID (GET with ID)
router.get('/:uploadid', async (req, res) => {
  const { uploadid } = req.params;

  try {
    const sql = 'CALL stp_UploadMaster(3, ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)';
    const results = await query(sql, [uploadid]);

    if (results[0].length === 0) {
      return res.status(404).json({ error: 'Upload not found' });
    }

    const upload = results[0][0];

    // Construct the full file URL if the document file exists
    const fullDocumentFileUrl = upload.documentfile
      ? `${req.protocol}://${req.get('host')}/fileupload/builder-${upload.builderid}/${upload.documentfile}`
      : null;

    // Send the response with the full document file URL
    res.status(200).json({
      ...upload,
      documentfile: fullDocumentFileUrl,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data.' });
  }
});

// API endpoint to update an upload by ID (PUT)
router.put('/:uploadid', upload.single('documentfile'), async (req, res) => {
  const { uploadid } = req.params;
  const { builderid, projectid, buildingid, unitcategoryid, documenttitle, documentdescription, documenttags } = req.body;
  const documentfile = req.file ? req.file.filename : null;

  if (!builderid || !documenttitle || !documentdescription || !documenttags) {
    return res.status(400).json({ error: 'Builder ID, Document Title, Document Description, and Document Tags are required.' });
  }

  try {
    // Fetch the existing file details
    const sqlSelect = 'CALL stp_UploadMaster(3, ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)';
    const existingFile = await query(sqlSelect, [uploadid]);

    if (existingFile[0].length === 0) {
      return res.status(404).json({ error: 'Upload not found.' });
    }

    const oldFile = existingFile[0][0];
    const oldFilePath = oldFile.documentfile && oldFile.builderid
      ? path.join(__dirname, '../../fileupload', `builder-${oldFile.builderid}`, oldFile.documentfile)
      : null;

    // Delete the old file if a new file is being uploaded
    if (documentfile && oldFilePath && fs.existsSync(oldFilePath)) {
      console.log('Deleting old file:', oldFilePath);
      fs.unlinkSync(oldFilePath);
    }

    // Now assign the documentfile (either the new file or keep the old one)
    const newDocumentFile = documentfile || oldFile.documentfile;

    // Update the database with new values
    const sqlUpdate = `CALL stp_UploadMaster(4, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    await query(sqlUpdate, [
      uploadid,
      builderid,
      projectid || null,
      buildingid || null,
      unitcategoryid || null,
      newDocumentFile,
      documenttitle,
      documentdescription,
      documenttags
    ]);

    res.status(200).json({ message: 'Upload updated successfully!' });
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ error: `Error updating data: ${error.message}` });
  }
});

// API endpoint to delete an upload by ID (DELETE)
router.delete('/:uploadid', async (req, res) => {
  const { uploadid } = req.params;

  try {
    const sql = 'CALL stp_UploadMaster(5, ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)';
    const result = await query(sql, [uploadid]);

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ error: 'Upload not found.' });
    }

    res.status(200).json({ message: 'Upload deleted successfully!' });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ error: 'Error deleting data.' });
  }
});

export default router;
