import { Link, useLocation } from 'react-router-dom';

export function Navigation() {
  const location = useLocation();

  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
      isActive
        ? 'border-indigo-500 text-gray-900'
        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
    }`;
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-indigo-600">Promise Keeper</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className={getLinkClass('/')}>
                Dashboard
              </Link>
              <Link to="/new-promise" className={getLinkClass('/new-promise')}>
                New Promise
              </Link>
              <Link to="/payment-setup" className={getLinkClass('/payment-setup')}>
                Payment Setup
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}