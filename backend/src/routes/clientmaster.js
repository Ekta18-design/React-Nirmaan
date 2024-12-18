import express from 'express';
import multer from 'multer';
import db from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// GET all clients
router.get('/', (req, res) => {
  db.query('CALL stp_ManageClient(1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)', (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).send('Server Error');
    }
    res.send(results[0]);
  });
});

// POST a new client
router.post('/', upload.fields([{ name: 'clientpanphoto', maxCount: 1 }, { name: 'clientaadharphoto', maxCount: 1 }]), (req, res) => {
  const { clientname, clientreferencename, clientemail, clientaddress, clientpanno, clientaadharno, clientphone } = req.body;
  const clientpanphoto = req.files['clientpanphoto'] ? req.files['clientpanphoto'][0].path : null;
  const clientaadharphoto = req.files['clientaadharphoto'] ? req.files['clientaadharphoto'][0].path : null;
  const isactive = req.body.isactive === 'true';
  const isdeleted = req.body.isdeleted === 'true';

  if (!clientname || !clientreferencename || !clientaddress || !clientpanno || !clientaadharno || !clientemail) {
    return res.status(400).send('All fields are required');
  }

  const params = [2, null, clientname, clientpanphoto, clientaadharphoto, clientreferencename, clientemail, clientaddress, clientpanno, clientaadharno, clientphone, isactive, isdeleted];

  db.query('CALL stp_ManageClient(?, ?)', params, (err, results) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).send('Server Error');
    }
    res.status(201).send({ insertId: results[0][0].insertId });
  });
});

// GET a client by id
router.get('/:clientid', (req, res) => {
  const clientid = req.params.clientid;
  db.query('CALL stp_ManageClient(3, ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)', [clientid], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).send('Server Error');
    }
    res.send(results[0][0]);
  });
});

// PUT to update a client by id
router.put('/:clientid', upload.fields([{ name: 'clientpanphoto', maxCount: 1 }, { name: 'clientaadharphoto', maxCount: 1 }]), (req, res) => {
  const { clientid } = req.params;
  const { clientname, clientreferencename, clientemail, clientaddress, clientpanno, clientaadharno, clientphone, isactive, isdeleted } = req.body;
  
  // Handle uploaded files
  const clientpanphoto = req.files['clientpanphoto'] ? req.files['clientpanphoto'][0].path : null;
  const clientaadharphoto = req.files['clientaadharphoto'] ? req.files['clientaadharphoto'][0].path : null;

  // Validate required fields
  if (!clientname || !clientreferencename || !clientaddress || !clientpanno || !clientaadharno || !clientemail) {
    return res.status(400).send('All fields are required');
  }

  // Prepare parameters for the stored procedure
  const params = [4, clientid, clientname, clientpanphoto, clientaadharphoto, clientreferencename, clientemail, clientaddress, clientpanno, clientaadharno, clientphone, isactive, isdeleted];

  // Call the stored procedure
  db.query('CALL stp_ManageClient(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', params, (err, results) => {
    if (err) {
      console.error('Error updating data:', err);
      return res.status(500).send('Server Error');
    }

    // Assuming the stored procedure returns the updated ID
    const updatedId = results[0][0].updatedId; // Adjust this based on your stored procedure's output

    // If new files were uploaded, handle file deletion for old photos
    if (clientpanphoto || clientaadharphoto) {
      db.query('SELECT clientpanphoto, clientaadharphoto FROM tbl_ClientMaster WHERE clientid = ?', [clientid], (err, results) => {
        if (err) {
          console.error('Error querying database for old photos:', err);
          return res.status(500).send('Server Error');
        }

        const existingClient = results[0];
        if (existingClient) {
          if (clientpanphoto && existingClient.clientpanphoto) {
            fs.unlink(path.join(__dirname, '..', existingClient.clientpanphoto), err => {
              if (err) console.error('Error deleting old client pan photo:', err);
            });
          }
          if (clientaadharphoto && existingClient.clientaadharphoto) {
            fs.unlink(path.join(__dirname, '..', existingClient.clientaadharphoto), err => {
              if (err) console.error('Error deleting old client aadhar photo:', err);
            });
          }
        }
      });
    }

    res.send({ updatedId: updatedId });
  });
});

// DELETE a client by id
router.delete('/:clientid', (req, res) => {
  const clientid = req.params.clientid;
  db.query('CALL stp_ManageClient(5, ?)', [clientid], (err) => {
    if (err) {
      console.error('Error deleting data:', err);
      return res.status(500).send('Server Error');
    }
    res.send({ message: 'Client deleted successfully' });
  });
});

export default router;
