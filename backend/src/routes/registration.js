import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// Get all users
router.get('/', (req, res) => {
  const query = 'SELECT * FROM tbl_UserMaster';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ error: 'Server Error' });
    }
    res.json(results);
  });
});

// Create a new user
router.post('/', (req, res) => {
  console.log('Incoming Request Body:', req.body);
  const { user_firstname, user_lastname, user_email, user_password, user_confirmpassword, username, user_phone } = req.body;

  if (!user_firstname || !user_lastname || !user_email || !user_password || !user_confirmpassword || !username || !user_phone) {
    console.log('Missing fields:', { user_firstname, user_lastname, user_email, user_password, user_confirmpassword, username, user_phone });
    return res.status(400).json({ error: 'All fields are required', missingFields: { user_firstname, user_lastname, user_email, user_password, user_confirmpassword, username, user_phone } });
  }
  const query = `INSERT INTO tbl_UserMaster (user_firstname, user_lastname, user_email, user_password, user_confirmpassword, username, role, isactive, isdeleted, user_phone)
    VALUES (?, ?, ?, ?, ?, ?, 'user', 1, 0, ?)`;
    
    db.query(query, [user_firstname, user_lastname, user_email, user_password, user_confirmpassword, username, user_phone], (err) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ error: 'Server Error' });
    }
    res.status(201).json({ message: 'User added successfully' });
  });
});

// Update a user by ID
router.put('/:userid', (req, res) => {
  const { user_firstname, user_lastname, user_email, user_password, user_confirmpassword } = req.body;
  const { userid } = req.params;

  if (!user_firstname || !user_lastname || !user_email || !user_password || !user_confirmpassword) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = `  UPDATE tbl_UserMaster SET user_firstname = ?, user_lastname = ?, user_email = ?, user_password = ?, user_confirmpassword = ?, username = ?
   WHERE userid = ?`;
   db.query(query, [user_firstname, user_lastname, user_email, user_password, user_confirmpassword, `${user_firstname}${user_lastname}`, userid], (err) => {
    if (err) {
      console.error('Error updating data:', err);
      return res.status(500).json({ error: 'Server Error' });
    }
    res.json({ message: 'User updated successfully' });
  });
});

// Delete a user by ID
router.delete('/:userid', (req, res) => {
  const query = 'DELETE FROM tbl_UserMaster WHERE userid = ?';
  db.query(query, [req.params.userid], (err) => {
    if (err) {
      console.error('Error deleting data:', err);
      return res.status(500).json({ error: 'Server Error' }); 
    }
    res.json({ message: 'User deleted' });
  });
});

export default router;
