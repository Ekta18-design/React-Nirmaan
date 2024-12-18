// backend/routes/protectedRoutes.js
import express from 'express';


const router = express.Router();

router.get('/protected',  (req, res) => {
  res.json({ message: 'This is a route no longer protected' });
});

export default router;
