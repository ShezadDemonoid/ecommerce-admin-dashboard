import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Welcome to your ecommerce admin panel.
      </p>

      <div className="grid grid-cols-3 gap-4 max-w-lg">
        <Link
          to="/products"
          className="p-4 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
        >
          Manage Products
        </Link>

        <Link
          to="/users"
          className="p-4 bg-green-600 text-white rounded shadow hover:bg-green-700"
        >
          Manage Users
        </Link>

        <Link
          to="/employees"
          className="p-4 bg-purple-600 text-white rounded shadow hover:bg-purple-700"
        >
          Manage Employees
        </Link>
      </div>
    </div>
  );
}
