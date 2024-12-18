import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mysql from 'mysql';

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nirmandb'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// Define a route
app.get('/usermaster', (req, res) => {
  const query = 'SELECT * FROM tbl_UserMaster';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).send('Server Error');
    }
    res.send(results);
  });
});

// Define POST route to insert data
app.post('/usermaster', (req, res) => {
  const { username, user_firstname, user_lastname, user_email, user_phone, user_password, user_confirmpassword, role, isactive, isdeleted } = req.body;

  // Validate required fields
  if (!username || !user_firstname || !user_lastname || !user_email || !user_phone || !user_password || !user_confirmpassword || !role) {
    return res.status(400).send('All fields are required');
  }

  // Prepare SQL query
  const query = `INSERT INTO tbl_UserMaster (username, user_firstname, user_lastname, user_email, user_phone, user_password, user_confirmpassword, role, isactive, isdeleted)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  // Execute SQL query
  db.query(query, [username, user_firstname, user_lastname, user_email, user_phone, user_password, user_confirmpassword, role, isactive, isdeleted], (err) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).send('Server Error');
    }
    res.status(201).send('User added successfully');
  });
});

app.get('/usermaster/:userid', (req, res) => {
  const query = 'SELECT * FROM tbl_UserMaster WHERE userid = ?';
  db.query(query, [req.params.userid], (err, results) => {
    if (err) throw err;
    res.send(results[0]);
  });
});
// Define PUT route to update data
app.put('/usermaster/:userid', (req, res) => {
  const { userid } = req.params;
  const { username, user_firstname, user_lastname, user_email, user_phone, user_password, user_confirmpassword, role, isactive, isdeleted } = req.body;

  const query = `UPDATE tbl_UserMaster SET username = ?, user_firstname = ?, user_lastname = ?, user_email = ?, user_phone = ?, user_password = ?, user_confirmpassword = ?, role = ?, isactive = ?, isdeleted = ? WHERE userid = ?`;

  db.query(query, [username, user_firstname, user_lastname, user_email, user_phone, user_password, user_confirmpassword, role, isactive, isdeleted, userid], (err) => {
    if (err) {
      console.error('Error updating data:', err);
      return res.status(500).send('Server Error');
    }
    res.send('User updated successfully');
  });
});

// Define DELETE route to delete data

app.delete('/usermaster/:userid', (req, res) => {
  const query = 'DELETE FROM tbl_UserMaster WHERE userid = ?';
  db.query(query, [req.params.userid], (err) => {
    if (err) throw err;
    res.send({ message: 'User deleted' });
  });
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
