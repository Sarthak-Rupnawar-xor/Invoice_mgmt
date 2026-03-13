import { Link, useLocation } from "react-router-dom";

function Navbar() {

  const location = useLocation();

  return (
    <div className="bg-white border-b shadow-sm">

      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">

        {/* Logo / App Name */}
        <Link to="/" className="text-xl font-bold text-gray-800 flex items-center gap-2">
          📦 SCM Invoice
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-4">

          <Link
            to="/"
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              location.pathname === "/"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Invoices
          </Link>

          <Link
            to="/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
          >
            + Create Invoice
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Navbar;