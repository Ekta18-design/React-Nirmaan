import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../config/db.js';

// Derive __dirname from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer setup for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } }); // 100MB file size limit

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

// Get all builders (Flag 1)
router.get('/', async (req, res) => {
  const queryStr = 'CALL stp_ManageBuilder(?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)';
  try {
    const results = await query(queryStr, [1]);
    res.send(results[0]); // Assuming the stored procedure returns a single result set
  } catch (err) {
    console.error('Error querying database:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Insert a new builder (Flag 2)
router.post('/', upload.single('companylogo'), async (req, res) => {
  const { userid, companyname, companyestyear, headofficephone, companydescription, headofficeaddress, headofficeemail, alternateofficeemail, alternateofficephone, alternateofficeaddress, isactive, isdeleted } = req.body;
  const companylogo = req.file ? req.file.path : null;

  if (!userid || !companyname || !companyestyear || !headofficephone || !companydescription || !headofficeaddress || !headofficeemail || isactive === undefined || isdeleted === undefined) {
    return res.status(400).json({ error: 'All required fields must be filled' });
  }

  const queryStr = 'CALL stp_ManageBuilder(?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  try {
    const result = await query(queryStr, [2, userid, companyname, companylogo, companyestyear, headofficephone, companydescription, headofficeaddress, headofficeemail, alternateofficeemail, alternateofficephone, alternateofficeaddress, isactive === 'true', isdeleted === 'true']);
    res.status(201).json({ message: 'Builder added successfully', builderid: result[0][0].insertId });
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Get a single builder by ID (Flag 4)
router.get('/:builderid', async (req, res) => {
  const queryStr = 'CALL stp_ManageBuilder(?, ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)';
  try {
    const results = await query(queryStr, [4, req.params.builderid]);
    if (results[0].length > 0) {
      res.send(results[0][0]);
    } else {
      res.status(404).send('Builder not found');
    }
  } catch (err) {
    console.error('Error querying database:', err);
    res.status(500).send('Server Error');
  }
});

// Update a builder by ID (Flag 3)
router.put('/:builderid', upload.single('companylogo'), async (req, res) => {
  const { builderid } = req.params;
  const { userid, companyname, companyestyear, headofficephone, companydescription, headofficeaddress, headofficeemail, alternateofficeemail, alternateofficephone, alternateofficeaddress, isactive, isdeleted } = req.body;
  const newLogo = req.file ? req.file.path : req.body.companylogo;

  try {
    // Fetch existing builder for potential logo replacement
    const builderQuery = 'CALL stp_ManageBuilder(?, ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)';
    const [builder] = await query(builderQuery, [4, builderid]);
    if (!builder) return res.status(404).send('Builder not found');

    // Remove old logo file if exists and different from the new one
    if (builder.companylogo && builder.companylogo !== newLogo && req.file) {
      const oldLogoPath = path.join(__dirname, builder.companylogo);
      if (fs.existsSync(oldLogoPath)) {
        fs.unlinkSync(oldLogoPath);
      }
    }

    // Update builder details
    const updateQuery = 'CALL stp_ManageBuilder(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    await query(updateQuery, [3, builderid, userid, companyname, newLogo, companyestyear, headofficephone, companydescription, headofficeaddress, headofficeemail, alternateofficeemail, alternateofficephone, alternateofficeaddress, isactive === 'true', isdeleted === 'true']);
    res.send('Builder updated successfully!');
  } catch (error) {
    console.error('Error updating builder:', error);
    res.status(500).send('Error updating builder');
  }
});

// Delete a builder by ID (Flag 5)
router.delete('/:builderid', async (req, res) => {
  const queryStr = 'CALL stp_ManageBuilder(?, ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)';
  try {
    const result = await query(queryStr, [5, req.params.builderid]);
    if (result.affectedRows > 0) {
      res.send({ message: 'Builder deleted' });
    } else {
      res.status(404).send('Builder not found');
    }
  } catch (err) {
    console.error('Error deleting data:', err);
    res.status(500).send('Server Error');
  }
});

export default router;
