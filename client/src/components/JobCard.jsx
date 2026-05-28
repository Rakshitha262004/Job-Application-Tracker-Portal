import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import axiosInstance from '../api/axiosInstance';

const JobCard = ({ job, onDelete }) => {

  const handleDelete = async () => {
    if (!window.confirm(`Delete application to ${job.company}?`)) return;
    try {
      await axiosInstance.delete(`/api/jobs/${job._id}`);
      onDelete(job._id); // Tell parent to remove from list
    } catch (err) {
      alert('Failed to delete. Try again.');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-lg text-gray-800">{job.company}</h3>
          <p className="text-gray-500 text-sm">{job.role}</p>
        </div>
        <StatusBadge status={job.status} />
      </div>

      {job.location && <p className="text-xs text-gray-400 mb-1">📍 {job.location}</p>}
      {job.salary && <p className="text-xs text-gray-400 mb-1">💰 {job.salary}</p>}
      {job.appliedDate && (
        <p className="text-xs text-gray-400 mb-3">
          📅 Applied: {new Date(job.appliedDate).toLocaleDateString()}
        </p>
      )}
      {job.notes && <p className="text-sm text-gray-600 mb-3 italic">"{job.notes}"</p>}

      <div className="flex gap-2 mt-2">
        <Link
          to={`/edit-job/${job._id}`}
          className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded text-sm font-medium hover:bg-indigo-100 transition"
        >
          Edit
        </Link>
        <button
          onClick={handleDelete}
          className="bg-red-50 text-red-700 px-3 py-1 rounded text-sm font-medium hover:bg-red-100 transition"
        >
          Delete
        </button>
        {job.jobLink && (
          <a
            href={job.jobLink}
            target="_blank"
            rel="noreferrer"
            className="bg-gray-50 text-gray-700 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100 transition"
          >
            View Job
          </a>
        )}
      </div>
    </div>
  );
};

export default JobCard;