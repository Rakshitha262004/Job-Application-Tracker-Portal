// Color-coded status badge component
const statusColors = {
  Applied:   'bg-blue-100 text-blue-800',
  Interview: 'bg-yellow-100 text-yellow-800',
  Offer:     'bg-green-100 text-green-800',
  Rejected:  'bg-red-100 text-red-800',
};

const StatusBadge = ({ status }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
    {status}
  </span>
);

export default StatusBadge;