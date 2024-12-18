import express from 'express';
import db from '../config/db.js'; // Import your DB config

const router = express.Router();

router.get('/:userid', async (req, res) => {
  const { userid } = req.params;

  try {
    const query = 'SELECT user_firstname, user_email, role,user_lastname FROM tbl_UserMaster WHERE userid = ?';
    db.query(query, [userid], (err, results) => {
      if (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ error: 'Server Error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = results[0];
      res.json({
        firstname: user.user_firstname,
        lastname: user.user_lastname,
        email: user.user_email,
        role: user.role,
      });
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});
export default router;
