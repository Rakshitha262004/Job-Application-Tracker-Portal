import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const EditJob = () => {
  const [form, setForm] = useState({
    company: '', role: '', status: 'Applied', appliedDate: '',
    interviewDate: '', jobLink: '', salary: '', location: '', notes: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // Fetch existing job data to pre-fill form
    const fetchJob = async () => {
      try {
        const res = await axiosInstance.get('/api/jobs');
        const job = res.data.find(j => j._id === id);
        if (job) {
          setForm({
            company: job.company || '',
            role: job.role || '',
            status: job.status || 'Applied',
            appliedDate: job.appliedDate ? job.appliedDate.split('T')[0] : '',
            interviewDate: job.interviewDate ? job.interviewDate.split('T')[0] : '',
            jobLink: job.jobLink || '',
            salary: job.salary || '',
            location: job.location || '',
            notes: job.notes || '',
          });
        }
      } catch (err) {
        setError('Failed to load job data.');
      } finally {
        setFetching(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axiosInstance.put(`/api/jobs/${id}`, form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-center mt-20 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/dashboard" className="text-indigo-600 hover:underline text-sm">← Back to Dashboard</Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Application</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Same fields as AddJob */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
              <input type="text" name="company" value={form.company} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Role *</label>
              <input type="text" name="role" value={form.role} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select name="status" value={form.status} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm">
              <option>Applied</option>
              <option>Interview</option>
              <option>Offer</option>
              <option>Rejected</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Applied Date</label>
              <input type="date" name="appliedDate" value={form.appliedDate} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interview Date</label>
              <input type="date" name="interviewDate" value={form.interviewDate} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm resize-none" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-60">
              {loading ? 'Updating...' : 'Update Application'}
            </button>
            <Link to="/dashboard"
              className="flex-1 text-center border border-gray-300 text-gray-600 py-2.5 rounded-lg hover:bg-gray-50 font-medium transition text-sm flex items-center justify-center">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJob;