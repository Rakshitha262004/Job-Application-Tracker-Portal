import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import JobCard from '../components/JobCard';
import { useAuth } from '../context/AuthContext';

const STATUSES = ['All', 'Applied', 'Interview', 'Offer', 'Rejected'];

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ total: 0, applied: 0, interview: 0, offer: 0, rejected: 0 });
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchJobs();
    fetchStats();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axiosInstance.get('/api/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axiosInstance.get('/api/jobs/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleDelete = (deletedId) => {
    setJobs(prev => prev.filter(j => j._id !== deletedId));
    fetchStats(); // Refresh stats after deletion
  };

  const filteredJobs = jobs.filter(job => {
    const matchesStatus = filter === 'All' || job.status === filter;
    const matchesSearch =
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.role.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statCards = [
    { label: 'Total', value: stats.total, color: 'bg-indigo-500' },
    { label: 'Applied', value: stats.applied, color: 'bg-blue-500' },
    { label: 'Interview', value: stats.interview, color: 'bg-yellow-500' },
    { label: 'Offers', value: stats.offer, color: 'bg-green-500' },
    { label: 'Rejected', value: stats.rejected, color: 'bg-red-500' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user?.name}! 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Track your job search journey</p>
        </div>
        <Link
          to="/add-job"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition text-sm"
        >
          + Add Application
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {statCards.map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <div className={`text-2xl font-bold text-white ${color} rounded-lg px-3 py-1 inline-block mb-2`}>
              {value}
            </div>
            <p className="text-xs text-gray-500 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by company or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
        />
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition ${
                filter === s
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Job List */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading your applications...</div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-gray-500 font-medium">No applications found.</p>
          <Link to="/add-job" className="text-indigo-600 text-sm mt-2 inline-block hover:underline">
            Add your first job application →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map(job => (
            <JobCard key={job._id} job={job} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;