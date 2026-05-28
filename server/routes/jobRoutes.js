// Job Application routes — all protected by JWT middleware
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
  getDashboardStats,
} = require('../controllers/jobController');

// All routes require authentication
router.use(verifyToken);

router.get('/stats', getDashboardStats);   // GET /api/jobs/stats
router.get('/', getJobs);                  // GET /api/jobs
router.post('/', createJob);               // POST /api/jobs
router.put('/:id', updateJob);             // PUT /api/jobs/:id
router.delete('/:id', deleteJob);          // DELETE /api/jobs/:id

module.exports = router;