import { NavLink } from "react-router-dom";

type NavItem = {
  name: string;
  path: string;
};

const navItems: NavItem[] = [
  { name: "Dashboard", path: "/" },
  { name: "Products", path: "/products" },
  { name: "Users", path: "/users" },
  { name: "Employees", path: "/employees" },
];

const Sidebar: React.FC = () => {
  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col p-4">
      <h1 className="text-xl font-bold mb-8">Admin Panel</h1>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-gray-800 text-white shadow-md"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
