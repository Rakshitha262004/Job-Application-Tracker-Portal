// Job Application CRUD business logic
const JobApplication = require('../models/JobApplication');

// GET all jobs for logged-in user
const getJobs = async (req, res) => {
  try {
    const jobs = await JobApplication.find({ userId: req.user.id })
      .sort({ createdAt: -1 }); // Most recent first
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// CREATE new job application
const createJob = async (req, res) => {
  try {
    const { company, role, status, appliedDate, interviewDate, jobLink, notes, salary, location } = req.body;

    if (!company || !role) {
      return res.status(400).json({ message: 'Company and role are required.' });
    }

    const job = new JobApplication({
      userId: req.user.id,  // Link job to logged-in user
      company,
      role,
      status,
      appliedDate,
      interviewDate,
      jobLink,
      notes,
      salary,
      location,
    });

    const savedJob = await job.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// UPDATE job application
const updateJob = async (req, res) => {
  try {
    // Find job and verify it belongs to this user
    const job = await JobApplication.findOne({ _id: req.params.id, userId: req.user.id });

    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized.' });
    }

    const updatedJob = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true } // Return updated document
    );

    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// DELETE job application
const deleteJob = async (req, res) => {
  try {
    const job = await JobApplication.findOne({ _id: req.params.id, userId: req.user.id });

    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized.' });
    }

    await JobApplication.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job application deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// GET dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const jobs = await JobApplication.find({ userId: req.user.id });

    const stats = {
      total: jobs.length,
      applied: jobs.filter(j => j.status === 'Applied').length,
      interview: jobs.filter(j => j.status === 'Interview').length,
      offer: jobs.filter(j => j.status === 'Offer').length,
      rejected: jobs.filter(j => j.status === 'Rejected').length,
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

module.exports = { getJobs, createJob, updateJob, deleteJob, getDashboardStats };