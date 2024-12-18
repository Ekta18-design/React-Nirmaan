import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// Utility function to check if a project exists
const checkProjectExists = (projectid, callback) => {
  const query = 'SELECT * FROM tbl_ProjectMaster WHERE projectid = ?';
  db.query(query, [projectid], (err, results) => {
    if (err) {
      console.error('Error querying project:', err);
      return callback(err);
    }
    callback(null, results.length > 0);
  });
};

// Utility function to check if a building exists and belongs to the selected project
const checkBuildingExists = (buildingid, projectid, callback) => {
  const query = 'SELECT * FROM tbl_BuildingMaster WHERE buildingid = ? AND projectid = ?';
  db.query(query, [buildingid, projectid], (err, results) => {
    if (err) {
      console.error('Error querying building:', err);
      return callback(err);
    }
    callback(null, results.length > 0);
  });
};

// Utility function to check if a unit category exists
const checkUnitCategoryExists = (unitcategoryid, callback) => {
  const query = 'SELECT * FROM tbl_UnitCategoryMaster WHERE unitcategoryid = ?';
  db.query(query, [unitcategoryid], (err, results) => {
    if (err) {
      console.error('Error querying unit category:', err);
      return callback(err);
    }
    callback(null, results.length > 0);
  });
};

// Retrieve all building units
router.get('/', (req, res) => {
  const query = 'SELECT * FROM tbl_BuildingUnitMaster';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).send('Server Error');
    }
    res.send(results);
  });
});

// Add a new building unit
router.post('/', (req, res) => {
  const { projectid, buildingid, unitcategoryid, unitshortname, unitreferencename, unitarea, unitareareference,
    isactive, isdeleted, } = req.body;
    // Validate required fields
  if (!projectid || !buildingid || !unitcategoryid || !unitshortname || !unitreferencename || !unitarea || !unitareareference) {
    return res.status(400).send('All fields are required');
  }

  // Check if project exists
  checkProjectExists(projectid, (err, exists) => {
    if (err) return res.status(500).send('Server Error');
    if (!exists) return res.status(400).send('Project does not exist');

    // Check if building exists and belongs to the selected project
    checkBuildingExists(buildingid, projectid, (err, exists) => {
      if (err) return res.status(500).send('Server Error');
      if (!exists) return res.status(400).send('Building does not exist or does not belong to the selected project');

      // Check if unit category exists
      checkUnitCategoryExists(unitcategoryid, (err, exists) => {
        if (err) return res.status(500).send('Server Error');
        if (!exists) return res.status(400).send('Unit Category does not exist');

        const query = `INSERT INTO tbl_BuildingUnitMaster (projectid, buildingid, unitcategoryid, unitshortname, unitreferencename, unitarea, unitareareference, isactive, isdeleted)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        db.query(query, [projectid, buildingid, unitcategoryid, unitshortname, unitreferencename, unitarea, unitareareference, isactive, isdeleted], (err) => {
          if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).send({ message: 'Server Error' });
          }
          res.status(201).send({ message: 'Building unit added successfully' });
        });
      });
    });
  });
});

// Retrieve a single building unit by ID
router.get('/:buildingunitid', (req, res) => {
  const query = 'SELECT * FROM tbl_BuildingUnitMaster WHERE buildingunitid = ?';
  db.query(query, [req.params.buildingunitid], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).send('Server Error');
    }
    if (results.length === 0) {
      return res.status(404).send('Building Unit not found');
    }
    res.send(results[0]);
  });
});

// Update a building unit by ID
router.put('/:buildingunitid', (req, res) => {
  const {
    projectid, buildingid, unitcategoryid, unitshortname, unitreferencename, unitarea,  unitareareference,  isactive,
    isdeleted,} = req.body;
   const { buildingunitid } = req.params;

  // Check if project exists
  checkProjectExists(projectid, (err, exists) => {
    if (err) return res.status(500).send('Server Error');
    if (!exists) return res.status(400).send('Project does not exist');

    // Check if building exists and belongs to the selected project
    checkBuildingExists(buildingid, projectid, (err, exists) => {
      if (err) return res.status(500).send('Server Error');
      if (!exists) return res.status(400).send('Building does not exist or does not belong to the selected project');

      // Check if unit category exists
      checkUnitCategoryExists(unitcategoryid, (err, exists) => {
        if (err) return res.status(500).send('Server Error');
        if (!exists) return res.status(400).send('Unit Category does not exist');

        const query = `UPDATE tbl_BuildingUnitMaster SET projectid = ?, buildingid = ?, unitcategoryid = ?, unitshortname = ?, unitreferencename = ?, unitarea = ?, unitareareference = ?, isactive = ?, isdeleted = ? WHERE buildingunitid = ?`;

        db.query(query, [projectid, buildingid, unitcategoryid, unitshortname, unitreferencename, unitarea, unitareareference, isactive, isdeleted, buildingunitid], (err) => {
          if (err) {
            console.error('Error updating data:', err);
            return res.status(500).send('Server Error');
          }
          res.send('Building unit updated successfully');
        });
      });
    });
  });
});

// Delete a building unit by ID
router.delete('/:buildingunitid', (req, res) => {
  const query = 'DELETE FROM tbl_BuildingUnitMaster WHERE buildingunitid = ?';
  db.query(query, [req.params.buildingunitid], (err) => {
    if (err) {
      console.error('Error deleting data:', err);
      return res.status(500).send('Server Error');
    }
    res.send('Building unit deleted successfully');
  });
});

// Retrieve buildings for a specific project
router.get('/project/:projectid/buildings', (req, res) => {
  const query = 'SELECT * FROM tbl_BuildingMaster WHERE projectid = ?';
  db.query(query, [req.params.projectid], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).send('Server Error');
    }
    res.send(results);
  });
});

export default router;
