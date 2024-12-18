import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// GET all active Unit Categories
router.get('/', (req, res) => {
  const query = 'CALL stp_ManageUnitCategory(?, NULL, NULL, NULL, NULL, NULL)';
  db.query(query, [1], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).send('Server Error');
    }
    res.send(results[0]);
  });
});

// GET Unit Category by ID
router.get('/:unitcategoryid', (req, res) => {
  const query = 'CALL stp_ManageUnitCategory(?, ?, NULL, NULL, NULL, NULL)';
  db.query(query, [3, req.params.unitcategoryid], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).send('Server Error');
    }
    if (results[0].length === 0) {
      return res.status(404).send('Unit Category not found');
    }
    res.send(results[0][0]);
  });
});

// POST route to create a new Unit Category
router.post('/', (req, res) => {
  const { categoryname, categoryreferencename, isactive, isdeleted } = req.body;
  const query = 'CALL stp_ManageUnitCategory(?, NULL, ?, ?, ?, ?)';
  db.query(query, [2, categoryname, categoryreferencename, isactive, isdeleted], (err, results) => {
    if (err) {
      console.error('Error inserting unit category:', err);
      return res.status(500).send('Server Error');
    }
    res.status(201).send({ message: 'Unit Category created', unitcategoryid: results[0][0].insertId });
  });
});

// PUT route to update an existing Unit Category
router.put('/:unitcategoryid', (req, res) => {
  const { categoryname, categoryreferencename, isactive, isdeleted } = req.body;
  const query = 'CALL stp_ManageUnitCategory(?, ?, ?, ?, ?, ?)';
  db.query(query, [4, req.params.unitcategoryid, categoryname, categoryreferencename, isactive, isdeleted], 
    (err, results) => {
      if (err) {
        console.error('Error updating unit category:', err);
        return res.status(500).send('Server Error');
      }
      if (results.affectedRows === 0) {
        return res.status(404).send('Unit Category not found');
      }
      res.send({ message: 'Unit Category updated' });
  });
});

// DELETE route to delete a Unit Category
router.delete('/:unitcategoryid', (req, res) => {
  const query = 'CALL stp_ManageUnitCategory(?, ?, NULL, NULL, NULL, NULL)';
  db.query(query, [5, req.params.unitcategoryid], (err, results) => {
    if (err) {
      console.error('Error deleting unit category:', err);
      return res.status(500).send('Server Error');
    }
    if (results.affectedRows === 0) {
      return res.status(404).send('Unit Category not found');
    }
    res.send({ message: 'Unit Category deleted' });
  });
});

export default router;
