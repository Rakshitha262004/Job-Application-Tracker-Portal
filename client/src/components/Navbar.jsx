import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/dashboard" className="text-xl font-bold tracking-wide">
        🎯 JobTracker
      </Link>
      {user && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-indigo-200">Hi, {user.name}</span>
          <Link to="/add-job" className="bg-white text-indigo-700 px-3 py-1 rounded text-sm font-medium hover:bg-indigo-50 transition">
            + Add Job
          </Link>
          <button onClick={handleLogout} className="text-sm hover:underline text-indigo-200">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;