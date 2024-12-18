import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// Helper functions to check existence of builder and project
const checkBuilderExists = (builderid, callback) => {
  const query = 'SELECT * FROM tbl_BuilderMaster WHERE builderid = ?';
  db.query(query, [builderid], (err, results) => {
    if (err) return callback(err);
    callback(null, results.length > 0);
  });
};

const checkProjectExists = (projectid, callback) => {
  const query = 'SELECT * FROM tbl_ProjectMaster WHERE projectid = ?';
  db.query(query, [projectid], (err, results) => {
    if (err) return callback(err);
    callback(null, results.length > 0);
  });
};

// Retrieve all buildings
router.get('/', (req, res) => {
  const query = 'CALL stp_ManageBuilding(1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).send('Server Error');
    }
    res.send(results[0]);
  });
});

// Add a new building
router.post('/', (req, res) => {
  const { buildingname, builderid, projectid, buildingsiteaddress, buildingdescription, buildingreferencename, buildingwingname, buildingarea, nooffloors, nooflats, noofshops, noofotherunits, noofparking, isactive, isdeleted } = req.body;

  // Validate required fields
  if (!buildingname || !builderid || !projectid || !buildingsiteaddress || !buildingdescription || !buildingreferencename || !buildingwingname || !buildingarea || !nooffloors || !nooflats || !noofshops || !noofotherunits || !noofparking) {
    return res.status(400).send('All fields are required');
  }

  // Check if builder and project exist
  checkBuilderExists(builderid, (err, exists) => {
    if (err) return res.status(500).send('Server Error');
    if (!exists) return res.status(400).send('Builder does not exist');

    checkProjectExists(projectid, (err, exists) => {
      if (err) return res.status(500).send('Server Error');
      if (!exists) return res.status(400).send('Project does not exist');

      const query = 'CALL stp_ManageBuilding(2, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      db.query(query, [buildingname, builderid, projectid, buildingsiteaddress, buildingdescription, buildingreferencename, buildingwingname, buildingarea, nooffloors, nooflats, noofshops, noofotherunits, noofparking, isactive, isdeleted], (err, results) => {
        if (err) {
          console.error('Error inserting data:', err);
          return res.status(500).send({ message: 'Server Error' });
        }
        res.status(201).send({ message: 'Building added successfully', insertId: results[0][0].insertId });
      });
    });
  });
});

// Retrieve a single building by ID
router.get('/:buildingid', (req, res) => {
  const { buildingid } = req.params;
  const query = 'CALL stp_ManageBuilding(3, ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)';
  db.query(query, [buildingid], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).send('Server Error');
    }
    if (results[0].length === 0) {
      return res.status(404).send('Building not found');
    }
    res.send(results[0][0]);
  });
});

// Update a building by ID
router.put('/:buildingid', (req, res) => {
  const { buildingname, builderid, projectid, buildingsiteaddress, buildingdescription, buildingreferencename, buildingwingname, buildingarea, nooffloors, nooflats, noofshops, noofotherunits, noofparking, isactive, isdeleted } = req.body;
  const { buildingid } = req.params;

  checkBuilderExists(builderid, (err, exists) => {
    if (err) return res.status(500).send('Server Error');
    if (!exists) return res.status(400).send('Builder does not exist');

    checkProjectExists(projectid, (err, exists) => {
      if (err) return res.status(500).send('Server Error');
      if (!exists) return res.status(400).send('Project does not exist');

      const query = 'CALL stp_ManageBuilding(4, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      db.query(query, [buildingid, buildingname, builderid, projectid, buildingsiteaddress, buildingdescription, buildingreferencename, buildingwingname, buildingarea, nooffloors, nooflats, noofshops, noofotherunits, noofparking, isactive, isdeleted], (err, results) => {
        if (err) {
          console.error('Error updating data:', err);
          return res.status(500).send('Server Error');
        }
        res.send({ message: 'Building updated successfully', updatedId: buildingid });
      });
    });
  });
});

// Soft-delete a building by ID
router.delete('/:buildingid', (req, res) => {
  const { buildingid } = req.params;
  const query = 'CALL stp_ManageBuilding(5, ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)';
  db.query(query, [buildingid], (err) => {
    if (err) {
      console.error('Error deleting data:', err);
      return res.status(500).send('Server Error');
    }
    res.send({ message: 'Building deleted successfully', deletedId: buildingid });
  });
});

export default router;
