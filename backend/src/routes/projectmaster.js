import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// GET all active projects
router.get('/', (req, res) => {
  const query = 'CALL stp_ManageProject(1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching projects:', err);
      return res.status(500).send('Server Error');
    }
    res.send(results[0]);  // Access the result from the first element
  });
});

// GET project by ID
router.get('/:projectid', (req, res) => {
  const query = 'CALL stp_ManageProject(3, ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)';
  db.query(query, [req.params.projectid], (err, results) => {
    if (err) {
      console.error('Error fetching project by ID:', err);
      return res.status(500).send('Server Error');
    }
    if (results[0].length === 0) {
      return res.status(404).send('Project not found');
    }
    res.send(results[0][0]);
  });
});

// POST route to create a new project
router.post('/', (req, res) => {
  const { builderid, projectname, projectstartdate, projectenddate, projectarea, projectsiteaddress, surveyno, hissano, isactive, isdeleted } = req.body;
  const query = 'CALL stp_ManageProject(2, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const params = [builderid, projectname, projectstartdate, projectenddate, projectarea, projectsiteaddress, surveyno, hissano, isactive, isdeleted];

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error creating project:', err);
      return res.status(500).send('Server Error');
    }
    res.status(201).send({ message: 'Project created', projectid: results[0][0].insertId });
  });
});

// PUT route to update an existing project
router.put('/:projectid', (req, res) => {
  const { builderid, projectname, projectstartdate, projectenddate, projectarea, projectsiteaddress, surveyno, hissano, isactive, isdeleted } = req.body;
  const query = 'CALL stp_ManageProject(4, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const params = [req.params.projectid, builderid, projectname, projectstartdate, projectenddate, projectarea, projectsiteaddress, surveyno, hissano, isactive, isdeleted];

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error updating project:', err);
      return res.status(500).send('Server Error');
    }
    if (results.affectedRows === 0) {
      return res.status(404).send('Project not found');
    }
    res.send({ message: 'Project updated' });
  });
});

// DELETE route to soft-delete a project
router.delete('/:projectid', (req, res) => {
  const query = 'CALL stp_ManageProject(5, ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)';
  db.query(query, [req.params.projectid], (err, results) => {
    if (err) {
      console.error('Error deleting project:', err);
      return res.status(500).send('Server Error');
    }
    if (results.affectedRows === 0) {
      return res.status(404).send('Project not found');
    }
    res.send({ message: 'Project deleted' });
  });
});

export default router;
