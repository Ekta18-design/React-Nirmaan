// backend/routes/auth.js
import express from 'express';
import db from '../config/db.js';

const router = express.Router();

router.post('/login',  (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const query = 'SELECT * FROM tbl_UserMaster WHERE user_email = ?';
  db.query(query, [email],  (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ error: 'Server Error' });
    }

    if (results.length === 0 ) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = results[0];

     // Compare hashed password
     if (password !== user.user_password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    res.json({  
      message: 'Login successful',
      user: {
        firstname: user.user_firstname,
        lastname: user.user_lastname,
        email: user.user_email,
        role: user.role,
      },
    });
  });
});

export default router;
